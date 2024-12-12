<template>
  <q-page>
    <!-- content -->
    <div class="q-mb-md">
      <q-btn
        color="secondary"
        text-color="primary"
        :label="$t('addNote')"
        icon="add"
        size="md"
        @click="cStore.openAddNoteDialog(props.customerId)"
      />
    </div>
    <customer-notes-notes-list :customer-id="props.customerId" />
  </q-page>
</template>
<script setup lang="ts">

import { useCustomerStore } from 'stores/customer-store'

const props = defineProps<{
  customerId: number
}>()

const cStore = useCustomerStore()
</script>
