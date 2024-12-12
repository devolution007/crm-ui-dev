import { computed, ref, Ref, unref } from 'vue'

export default function useFilters<FiltersSetup extends Record<string, undefined | number | string>> (defaultFilters: FiltersSetup, options: {
  onClear?: () => void
} = {}) {
  const filters: Ref<FiltersSetup> = ref(Object.assign({}, defaultFilters)) as Ref<FiltersSetup>

  const clearFilters = () => {
    filters.value = Object.assign({}, defaultFilters)
    if (options.onClear) {
      options.onClear()
    }
  }

  const isFiltersApplied = computed(() => {
    return JSON.stringify(filters.value) !== JSON.stringify(defaultFilters)
  })

  const toFilterArray = (): Array<{ name: string, value: number | string }> => {
    return Object
      .entries(unref(filters))
      .reduce((acc, cur) => {
        if (cur[1] != null) {
          acc.push({ name: cur[0], value: cur[1] })
        }
        return acc
      }, [] as Array<{ name: string, value: string | number }>)
  }

  return {
    filters,
    isFiltersApplied,
    clearFilters,
    toFilterArray
  }
}
