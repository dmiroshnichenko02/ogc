import Layout from '@/components/layout/Layout'
import { FC, PropsWithChildren } from 'react'
import ReactQueryProvider from './ReactQueryProvider'
import { AutocompleteStoreProvider } from './StoreProvider'

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<AutocompleteStoreProvider>
			<ReactQueryProvider>
				<Layout>{children}</Layout>
			</ReactQueryProvider>
		</AutocompleteStoreProvider>
	)
}

export default MainProvider
