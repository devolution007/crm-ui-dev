<script setup lang="ts">
import { useMeta } from 'quasar'

const props = defineProps<{
  customerId: number
  issueId: number
}>()

useMeta({
  title: `Issue #${props.issueId}`
})

</script>

<template>
  <q-page>
    <bricks-top-back-button
      :label="$t('backToCustomerIssues')"
      :to="{ name: 'customer-issues' }"
    />
    <IssueCardDetails
      :customer-id="props.customerId"
      :issue-id="props.issueId"
    />
  </q-page>
</template>

<style scoped>

</style>
