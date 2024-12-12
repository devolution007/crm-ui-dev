<template>
  <q-list v-if="issuesLoading">
    <q-item>
      <q-item-section>
        <q-item-label>
          <q-skeleton
            height="40px"
            width="80px"
          />
          <q-skeleton
            type="text"
            width="130px"
          />
          <q-skeleton
            type="text"
            width="130px"
          />
          <q-skeleton
            type="text"
            width="130px"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <q-list v-else-if="issues.length === 0">
    <q-item>
      <q-item-section>
        <q-item-label>
          No issues yet
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <q-list
    v-else
    separator
  >
    <issue-card-item
      v-for="issue in issues"
      :key="`issue_list_item_${issue.id}`"
      :issue="issue"
    />
  </q-list>
</template>

<script setup lang="ts">

import { IssueFilter } from 'src/types'
import IssueApi from 'src/api/IssueApi'
import { api } from 'boot/axios'
import { onMounted, ref } from 'vue'
import IssueModel from 'src/models/IssueModel'
import { Notify } from 'quasar'

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  },
  customerId: {
    type: Number,
    required: true
  }
})

const issuesLoading = ref(false)
const issues = ref<IssueModel[]>([])

const getIssuesByOrder = async () => {
  const filterBy: IssueFilter = {
    customerId: props.customerId,
    orderId: props.orderId
  }

  issuesLoading.value = true
  const { items } = await new IssueApi(api).getIssues(1, filterBy, [{ id: 'desc' }], 1000)
    .catch(() => {
      Notify.create({
        message: 'Failed to fetch issues',
        color: 'negative'
      })
    })
    .finally(() => {
      issuesLoading.value = false
    })
  issues.value = items
}

onMounted(() => {
  getIssuesByOrder()
})
</script>
