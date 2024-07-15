import { EditorState } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import React, { useEffect, useState } from 'react'
import FormulaCalculator from '../calculator/FormulaCalculator'

import styles from './FormulaInput.module.scss'

const Dashboard: React.FC = () => {
	const [editor, setEditor] = useState<EditorView | null>(null)

	useEffect(() => {
		const view = new EditorView({
			state: EditorState.create({
				doc: '',
				extensions: [basicSetup],
			}),
			parent: document.getElementById('editor-container')!,
		})
		setEditor(view)

		return () => {
			view.destroy()
		}
	}, [])

	return (
		<div className={styles.dashboard}>
			<h1>Dashboard</h1>
			<div id='editor-container' className={styles.editorContainer}></div>
			<FormulaCalculator editor={editor} />
		</div>
	)
}

export default Dashboard
