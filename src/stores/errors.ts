import { defineStore } from 'pinia'

export const useErrorsStore = defineStore('errors', {
  state: () => ({
    log: [] as string[]
  }),

  getters: {

  },

  actions: {
    logError (error: string) {
      this.log.push(error)
    },
    handleAxiosError (error: any) {
      if (error.response) {
        this.logError(error.response.data)
      } else if (error.request) {
        this.logError(error.request)
      } else {
        this.logError(error.message)
      }
    }
  }
})
