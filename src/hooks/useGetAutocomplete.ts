import { AutocompleteService } from '@/services/autocomplete.service'
import { IAutocomplete } from '@/types/autocomplete.interface'
import { useQuery } from '@tanstack/react-query'

export const useGetAutocomplete = () => {
	const { isLoading, data } = useQuery({
		queryKey: ['autocomplete'],
		queryFn: () => AutocompleteService.getAll(),
		select: ({ data }) =>
			data.map((autocomplete: IAutocomplete) => {
				return {
					name: autocomplete.name,
					id: autocomplete.id,
					label: autocomplete.name,
					value: autocomplete.value,
					category: autocomplete.category,
				}
			}),
		throwOnError: error => {
			console.log(error)
			return true
		},
	})

	return { isLoading, data }
}
