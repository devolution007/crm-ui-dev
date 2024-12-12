import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { Notify } from 'quasar'

/**
 * @deprecated use useServerErrors2 instead
 */
export function useServerErrors () {
  const serverErrors = ref<any>({})
  function processErrors (error: Error | AxiosError) {
    if (axios.isAxiosError(error) && error?.response?.status === 422) {
      Object.entries(error.response.data).forEach(([key, value]) => {
        key = key.replace(/\.\d+$/, '')
        const errorField = key.split('.').length === 2 ? key.split('.')[1] : key.split('.')[0]
        serverErrors.value[errorField] = value
      })
    } else {
      console.error(error)
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Unknown error emerged'
      })
    }
  }
  return { serverErrors, processErrors }
}
