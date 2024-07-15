import { FC } from 'react'
import FormulaEditor from '../input/FormulaInput'
import styles from './Dashboard.module.scss'

const Dashboard: FC = () => {
	return (
		<main className={styles.container}>
			<FormulaEditor />
		</main>
	)
}

export default Dashboard
