import { Ref, ref, watch } from 'vue'
import { isString } from '@vueuse/core'

export default function useOptionsFilter<T, K extends keyof T> (optionsAll: Ref<T[]>, filterField: K) {
  const options: Ref<T[]> = ref([])

  watch(optionsAll, (value) => {
    options.value = value
  })

  options.value = optionsAll.value

  const filterFn = (search: string, update: (fn: () => void) => void) => {
    if (search === '') {
      update(() => {
        options.value = optionsAll.value
      })
      return
    }

    update(() => {
      const needle = search.toLowerCase()
      options.value = optionsAll.value.filter((v: T) => {
        if (!v[filterField] || !isString(v[filterField])) return false
        const label = v[filterField] as unknown as string
        return label.toLowerCase().indexOf(needle) > -1
      })
    })
  }

  return {
    options,
    filterFn
  }
}
