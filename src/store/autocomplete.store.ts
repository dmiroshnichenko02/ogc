import { IAutocomplete } from '@/types/autocomplete.interface'
import { createStore } from 'zustand/vanilla'
import { IAutocompleteStore } from './autocomplete.types'

export const defaultInitState: { autocomplete: IAutocomplete[] } = {
	autocomplete: [],
}

export const createAutocompleteStore = (
	initState: { autocomplete: IAutocomplete[] } = defaultInitState
) => {
	return createStore<IAutocompleteStore>()((set, get) => ({
		...initState,
		setVariables: autocomplete => set({ autocomplete }),
		getVariables: () => get().autocomplete,
	}))
}
