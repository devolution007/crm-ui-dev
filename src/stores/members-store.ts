import { defineStore } from 'pinia'
import { computed } from 'vue'
import { api } from 'boot/axios'
import MemberModel from 'src/models/MemberModel'
import MemberApi from 'src/api/MemberApi'

export const useMembersStore = defineStore('members', {
  state: () => ({
    entries: <Record<number, any>>{},
    loadings: <Record<number, boolean>>{},
    isFullLoaded: false,
    isListLoadingNow: false
  }),

  getters: {
    fullListAsOptions: (state) => {
      return computed(() => {
        return Object.values(state.entries).map((entry: MemberModel) => {
          return {
            label: entry.name,
            description: entry.email,
            value: entry.id,
            entry
          }
        })
      })
    },
    fullListAsData: (state) => {
      return computed(() => {
        return state.entries;
      })
    },
    isLoadingList: (state) => {
      return computed(() => {
        return state.isFullLoaded === false
      })
    }
  },

  actions: {
    async fetchFullList () {
      if (this.isFullLoaded || this.isListLoadingNow) return

      this.isListLoadingNow = true
      const items = await (new MemberApi(api)).getMembersForThisOrganization()
      items.forEach((item) => {
        this.entries[item.id] = item
      })
      this.isFullLoaded = true
      this.isListLoadingNow = false
    }
  }
})
