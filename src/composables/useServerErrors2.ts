import { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import { axios } from 'boot/axios'
import { ref, Ref } from 'vue'

type ServerErrorsOptions = {
  unPrefix: string | null
}
export default function useServerErrors2<ErrorsSetup> (defaultErrors: ErrorsSetup, options: ServerErrorsOptions = {
  unPrefix: null
}): {
  serverErrors: Ref<ErrorsSetup>,
  catchValidationErrors: (error: AxiosError | unknown) => boolean,
  resetServerErrors: () => void
} {
  const serverErrors: Ref<ErrorsSetup> = ref(Object.assign({}, defaultErrors)) as Ref<ErrorsSetup>

  const resetServerErrors = () => {
    serverErrors.value = Object.assign({}, defaultErrors)
  }

  /**
   * @example
   * try {
   *     // some code with axios request
   * } catch (e) {
   *   console.log('ctc')
   *   catchValidationErrors(e)
   * }
   */
  const catchValidationErrors = (error: AxiosError | unknown) => {
    if (axios.isAxiosError(error) && error?.response?.status === 422) {
      serverErrors.value = Object.assign({},
        { ...defaultErrors, ...helper.getFirstErrors(error.response.data, undefined, options.unPrefix) })
      return true
    }
    return false
  }

  return {
    serverErrors,
    catchValidationErrors,
    resetServerErrors
  }
}
