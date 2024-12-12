import { boot } from 'quasar/wrappers'
import axios, { AxiosError, AxiosInstance } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import qs from 'qs'
import { useAuthStore } from 'stores/auth-store'
import { Notify } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_URL })

/**
 * When some authorized request is failed, this interceptor will be called to refresh the token and retry the request
 */
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const auth = useAuthStore()
  return auth.renewToken()
    .then((tokenRefreshResponse) => {
      if (failedRequest.response) {
        failedRequest.response.config.headers.Authorization = 'Bearer ' + tokenRefreshResponse?.data.token
      } else {
        console.error('Failed to refresh token. No response from server')
      }
      return Promise.resolve()
    })
}

createAuthRefreshInterceptor(api, refreshAuthLogic)

api.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response === undefined) {
    Notify.create({
      type: 'negative',
      message: 'There is no connection with server!',
      caption: 'Error'
    })
  } else if (error.response) {
    if (error.response.status === 500) {
      Notify.create({
        type: 'negative',
        message: 'The server encountered an unexpected condition that prevented it from fulfilling the request',
        caption: '500 Internal Server Error'
      })
    } else if ([404, 403].includes(error.response.status)) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.detail || error.response?.data?.message || 'No details',
        caption: `Response status: ${error.response.status}`
      })
    }
  } else if (error.request) {
    Notify.create({
      type: 'negative',
      message: 'Request Error'
    })
  } else {
    Notify.create({
      type: 'negative',
      message: 'Something absolutely dreadful happened!',
      caption: 'Unknown terrible error!'
    })
  }

  return Promise.reject(error)
})

api.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  config.paramsSerializer = params => {
    return qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false
    })
  }
  return config
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, axios }
