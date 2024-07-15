import { IAutocomplete } from '@/types/autocomplete.interface'
import axios from 'axios'

export const AutocompleteService = {
	async getAll() {
		return axios.get<IAutocomplete[]>(
			'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete'
		)
	},
}
