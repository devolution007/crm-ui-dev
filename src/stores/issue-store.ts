import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { Grievance, GrievanceInputPatch } from 'src/models/Grievance'
import IssueApi from 'src/api/IssueApi'
import { api } from 'boot/axios'

export const useIssueStore = defineStore('issue', () => {
  const loading = ref(false)
  const issue: Ref<Grievance | null> = ref(null)

  const issueRepository = new IssueApi(api)

  const loadIssue = async (id: number, force = false, silent = false) => {
    if (!force && issue.value && issue.value?.id === id) return

    if (!silent) {
      loading.value = true
    }
    issue.value = await issueRepository.getGrievance(id)
      .finally(() => {
        if (!silent) {
          loading.value = false
        }
      })
  }

  const updateFields = async (fields: GrievanceInputPatch, silent = true) => {
    if (!issue.value) return
    if (!silent) {
      loading.value = true
    }

    await issueRepository.edit(fields, issue.value.id)
      .then((response) => {
        if (issue.value) {
          issue.value = Object.assign(issue.value, response)
        }
      })
      .finally(() => {
        if (!silent) {
          loading.value = false
        }
      })
  }

  return { issue, loading, loadIssue, updateFields }
})
