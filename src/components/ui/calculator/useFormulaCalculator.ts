import { useAutocompleteStore } from '@/providers/StoreProvider'
import {
	autocompletion,
	CompletionContext,
	CompletionResult,
} from '@codemirror/autocomplete'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { RangeSetBuilder } from '@codemirror/rangeset'
import { Compartment, StateEffect } from '@codemirror/state'
import {
	Decoration,
	DecorationSet,
	EditorView,
	keymap,
	ViewUpdate,
} from '@codemirror/view'
import { tags } from '@lezer/highlight'
import * as math from 'mathjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const useFormulaCalculator = (editor: EditorView | null) => {
	const [result, setResult] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const autocompleteData = useAutocompleteStore(state => state.autocomplete)

	const variableHighlightStyle = useMemo(
		() => HighlightStyle.define([{ tag: tags.variableName, color: '#00a' }]),
		[]
	)

	const calculateFormula = useCallback(
		(formula: string) => {
			console.log('Calculating formula:', formula)
			try {
				const trimmedFormula = formula.trim()

				if (!trimmedFormula || /[+\-*/]$/.test(trimmedFormula)) {
					setResult('')
					setError(null)
					return
				}

				const scope = autocompleteData.reduce((acc, item) => {
					if (item.name && item.value !== undefined) {
						acc[item.name] = item.value
					}
					return acc
				}, {} as Record<string, number>)

				const sortedVariables = Object.keys(scope).sort(
					(a, b) => b.length - a.length
				)

				const variableRegex = new RegExp(
					sortedVariables
						.map(key => `\\b${key.replace(/\s+/g, '\\s+')}\\b`)
						.join('|'),
					'g'
				)

				let preparedFormula = trimmedFormula
				sortedVariables.forEach(variable => {
					const regex = new RegExp(
						`\\b${variable.replace(/\s+/g, '\\s+')}\\b`,
						'g'
					)
					preparedFormula = preparedFormula.replace(
						regex,
						scope[variable].toString()
					)
				})

				console.log('Prepared formula:', preparedFormula)

				const calculatedResult = math.evaluate(preparedFormula)
				setResult(calculatedResult.toString())
				setError(null)
			} catch (error) {
				console.error('Error calculating formula:', error)
				setResult('')
				if (error instanceof Error) {
					if (error.message.includes('Undefined symbol')) {
						const symbolMatch = error.message.match(/Undefined symbol (.+)/)
						if (symbolMatch) {
							setError(`Error: Invalid variable "${symbolMatch[1]}".`)
						} else {
							setError(`Error: ${error.message}`)
						}
					} else {
						setError(`Error: ${error.message}`)
					}
				} else {
					setError('Error: Invalid formula')
				}
			}
		},
		[autocompleteData]
	)

	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const debouncedCalculateFormula = useCallback(
		(formula: string) => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
			timerRef.current = setTimeout(() => calculateFormula(formula), 1000)
		},
		[calculateFormula]
	)

	const autocompleteSource = useCallback(
		(context: CompletionContext): CompletionResult => {
			const word = context.matchBefore(/\w*/)
			if (word === null || (word.from === word.to && !context.explicit)) {
				return { from: context.pos, options: [] }
			}

			return {
				from: word.from,
				options: autocompleteData.map(item => ({
					label: item.name,
					type: 'variable',
				})),
			}
		},
		[autocompleteData]
	)

	const highlightVariables = useCallback(
		(view: EditorView): DecorationSet => {
			const builder = new RangeSetBuilder<Decoration>()
			const text = view.state.doc.toString()
			const variableNames = autocompleteData.map(item => item.name)

			const sortedVariables = variableNames.sort((a, b) => b.length - a.length)

			const variableRegex = new RegExp(
				sortedVariables
					.map(name => `\\b${name.replace(/\s+/g, '\\s+')}\\b`)
					.join('|'),
				'g'
			)

			let match
			while ((match = variableRegex.exec(text)) !== null) {
				const from = match.index
				const to = from + match[0].length
				builder.add(
					from,
					to,
					Decoration.mark({
						class: 'cm-variable-highlight',
					})
				)
				// Прогрессирование регулярного выражения
				if (match.index === variableRegex.lastIndex) {
					variableRegex.lastIndex++
				}
			}

			return builder.finish()
		},
		[autocompleteData]
	)

	useEffect(() => {
		if (editor) {
			const compartment = new Compartment()

			const updateListener = EditorView.updateListener.of(
				(update: ViewUpdate) => {
					if (update.docChanged) {
						const newFormula = update.state.doc.toString()
						debouncedCalculateFormula(newFormula)
					}
				}
			)

			const preventNewline = keymap.of([
				{
					key: 'Enter',
					run: () => true,
				},
			])

			const autocompleteExtension = autocompletion({
				override: [autocompleteSource],
			})

			editor.dispatch({
				effects: StateEffect.appendConfig.of(
					compartment.of([
						updateListener,
						preventNewline,
						autocompleteExtension,
						EditorView.decorations.of(highlightVariables),
						syntaxHighlighting(variableHighlightStyle),
					])
				),
			})

			const initialFormula = editor.state.doc.toString()
			calculateFormula(initialFormula)

			return () => {
				if (timerRef.current) {
					clearTimeout(timerRef.current)
				}
				editor.dispatch({
					effects: compartment.reconfigure([]),
				})
			}
		}
	}, [
		editor,
		debouncedCalculateFormula,
		calculateFormula,
		autocompleteSource,
		highlightVariables,
		variableHighlightStyle,
		autocompleteData,
	])

	return { result, error }
}
