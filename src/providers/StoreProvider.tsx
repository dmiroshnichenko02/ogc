'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { createAutocompleteStore } from '@/store/autocomplete.store'
import { type IAutocompleteStore } from '@/store/autocomplete.types'

export type AutocompleteStoreApi = ReturnType<typeof createAutocompleteStore>

export const AutocompleteStoreContext = createContext<
	AutocompleteStoreApi | undefined
>(undefined)

export interface AutocompleteStoreProviderProps {
	children: ReactNode
}

export const AutocompleteStoreProvider = ({
	children,
}: AutocompleteStoreProviderProps) => {
	const storeRef = useRef<AutocompleteStoreApi>()
	if (!storeRef.current) {
		storeRef.current = createAutocompleteStore()
	}

	return (
		<AutocompleteStoreContext.Provider value={storeRef.current}>
			{children}
		</AutocompleteStoreContext.Provider>
	)
}

export const useAutocompleteStore = <T,>(
	selector: (store: IAutocompleteStore) => T
): T => {
	const autocompleteStoreContext = useContext(AutocompleteStoreContext)

	if (!autocompleteStoreContext) {
		throw new Error(
			`useAutocompleteStore must be used within AutocompleteStoreProvider`
		)
	}

	return useStore(autocompleteStoreContext, selector)
}
