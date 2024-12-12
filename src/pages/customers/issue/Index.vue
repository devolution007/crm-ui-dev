<template>
  <q-form
    ref="form"
    class="row q-mb-md"
  >
    <div class="col-4">
      <q-select
        v-model="filterBy.period"
        :options="[
          {value: '-6 month', label: 'Last 6 months'}
        ]"
        option-value="value"
        option-label="label"
        dense
        bg-color="secondary"
        hide-dropdown-icon
        label-color="primary"
        color="primary"
        standout
        :label="$t('showIssuesFor')"
        clearable
        emit-value
        map-options
      >
        <template #selected-item="scope">
          <span class="text-primary">
            {{ scope.opt.label }}
          </span>
        </template>
        <template #append>
          <q-icon
            name="arrow_drop_down"
            color="dark"
          />
        </template>
      </q-select>
    </div>
  </q-form>
  <q-card>
    <q-card-section class="min-height-200">
      <q-inner-loading
        :showing="loading"
        :label="$t('pleaseWait')"
      />
      <q-list
        :padding="false"
      >
        <issue-card-item
          v-for="issue in issues"
          :key="`issue_list_item_${issue.id}`"
          :issue="issue"
          :with-order="true"
        />
        <q-item v-if="issues.length === 0 && !loading">
          <q-item-section>
            <q-item-label>
              {{ $t('noEntriesFound') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">

import { IssuesFilter, SortBy } from 'src/types'
import IssueApi from 'src/api/IssueApi'
import { api } from 'boot/axios'
import { ref, watchEffect } from 'vue'
import IssueModel from 'src/models/IssueModel'
import { AxiosError } from 'axios'
import { useServerErrors } from 'src/composables/useServerErrors'
import { useRoute } from 'vue-router'

const route = useRoute()
const issues = ref<IssueModel[]>([])
const filterBy = ref<IssuesFilter>({
  customerId: Number(route.params.customerId),
  period: undefined
})
const issueRepository: IssueApi = new IssueApi(api)
const loading = ref<boolean>(false)
const sortBy = ref<SortBy[]>([{ createdAt: 'desc' }])
const { serverErrors, processErrors } = useServerErrors()

async function getIssues (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    const { items } = await issueRepository.getIssues(1, filterBy.value, sortBy.value, 1000)
    issues.value = items
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    loading.value = false
  }
}

watchEffect(async () => {
  await getIssues()
})
</script>
