import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { computed, readonly, Ref } from 'vue'
import TaskApi from 'src/api/TaskApi'
import { CustomTaskFormModel, TaskFullInterface } from 'src/models/TaskModel'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    entries: <Record<number, TaskFullInterface>>{},
    loadings: <Record<number, boolean>>{}
  }),

  getters: {

  },

  actions: {
    getEntryByID (id: number): Readonly<Ref<TaskFullInterface | null>> {
      if (!this.entries[id] && id !== 0) {
        this.fetchEntry(id)
          .finally()
      }
      return readonly(
        computed(() => {
          return this.entries[id] || null
        })
      ) as Readonly<Ref<TaskFullInterface | null>>
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

      this.entries[id] = await (new TaskApi(api)).getEntry(id)
        .finally(() => {
          this.loadings[id] = false
        })

      return this.entries[id]
    },
    async deleteEntry (id: number) {
      this.loadings[id] = true
      await (new TaskApi(api)).delete(id)
        .finally(() => {
          this.loadings[id] = false
        })
      delete this.entries[id]
    },

    async patchEntry (id: number, data: Partial<CustomTaskFormModel>) {
      this.loadings[id] = true
      try {
        await (new TaskApi(api)).patch(id, data)
        return await this.fetchEntry(id, true)
      } catch (e: unknown) {
        this.loadings[id] = false
        throw e
      }
    },

    async addEntry (data: CustomTaskFormModel) {
      const item = await (new TaskApi(api)).create(data)
      const id = item.id
      this.loadings[id] = false
      this.entries[id] = item

      return this.entries[id]
    }
  }
})
