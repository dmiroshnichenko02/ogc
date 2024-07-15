'use client'

import Dashboard from '@/components/ui/dashboard/Dashboard'
import { useGetAutocomplete } from '@/hooks/useGetAutocomplete'
import { useAutocompleteStore } from '@/providers/StoreProvider'
import { FC, useEffect } from 'react'

const Home: FC = () => {
	const { isLoading, data } = useGetAutocomplete()

	const setVariables = useAutocompleteStore(state => state.setVariables)

	useEffect(() => {
		if (data) setVariables(data)
	}, [data, setVariables])

	console.log(data)

	return (
		<>
			<Dashboard />
		</>
	)
}

export default Home
