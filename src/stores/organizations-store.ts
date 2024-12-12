import { defineStore } from 'pinia'
import { computed } from 'vue'
import { api } from 'boot/axios'
import OrganizationApi from 'src/api/OrganizationApi'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'

export const useOrganizationsStore = defineStore('organizations', {
  state: () => ({
    entries: <Record<number, any>>{},
    loadings: <Record<number, boolean>>{},
    isFullLoaded: false
  }),

  getters: {
    fullListAsOptions: (state) => {
      return computed(() => {
        return Object.values(state.entries).map((entry: InsuranceOrganizationModel) => {
          return {
            label: entry.name,
            value: entry.id
          }
        })
      })
    }
  },

  actions: {
    async fetchFullList () {
      if (this.isFullLoaded) return

      const items = await (new OrganizationApi(api)).getOrganizations()
      items.forEach((item) => {
        this.entries[item.id] = item
      })
      this.isFullLoaded = true
    }
  }
})
