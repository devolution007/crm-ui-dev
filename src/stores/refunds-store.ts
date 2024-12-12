import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { computed, readonly } from 'vue'
import RefundModel from 'src/models/RefundModel'
import RefundApi from 'src/api/RefundApi'

export const useRefundsStore = defineStore('refunds', {
  state: () => ({
    entries: <Record<number, RefundModel>>{},
    loadings: <Record<number, boolean>>{}
  }),

  getters: {

  },

  actions: {
    getEntryByID (id: number) {
      if (!this.entries[id]) {
        this.fetchEntry(id)
          .finally()
      }
      return readonly(
        computed(() => {
          return this.entries[id] || null
        })
      )
    },
    getLoadingByID (id: number) {
      return readonly(
        computed(() => {
          return this.loadings[id] || false
        })
      )
    },
    getIsEntryReadyByID (id: number) {
      return readonly(
        computed(() => {
          return !!id && !this.loadings[id] && this.entries[id] !== undefined
        })
      )
    },
    async fetchEntry (id: number, force = false) {
      if (this.loadings[id] && !force) return this.entries[id]
      this.loadings[id] = true

      this.entries[id] = await (new RefundApi(api)).getEntry(id)
        .finally(() => {
          this.loadings[id] = false
        })

      return this.entries[id]
    },
    async deleteEntry (id: number) {
      this.loadings[id] = true
      await (new RefundApi(api)).delete(id)
        .finally(() => {
          this.loadings[id] = false
        })
      delete this.entries[id]
    }
  }
})
