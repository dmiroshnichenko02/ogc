import { EditorView } from '@codemirror/view'
import React from 'react'
import styles from './FormulaCalculator.module.scss'
import { useFormulaCalculator } from './useFormulaCalculator'

interface FormulaCalculatorProps {
	editor: EditorView | null
}

const FormulaCalculator: React.FC<FormulaCalculatorProps> = ({ editor }) => {
	const { result, error } = useFormulaCalculator(editor)

	return (
		<div className={styles.formulaCalculator}>
			{error ? (
				<div className={styles.error}>{error}</div>
			) : (
				<div className={styles.result}>
					<strong>Result:</strong> {result}
				</div>
			)}
		</div>
	)
}

export default FormulaCalculator
