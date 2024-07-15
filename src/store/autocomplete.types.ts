import { IAutocomplete } from '@/types/autocomplete.interface'

export interface IAutocompleteStore {
	autocomplete: IAutocomplete[]
	setVariables: (autocomplete: IAutocomplete[]) => void
	getVariables: () => void
}
