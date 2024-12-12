<template>
  <q-table
    :columns="columns"
    :rows="rows"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    :loading="!cStore.isReady"
  >
    <template #body-cell-text="scope">
      <q-td :props="scope">
        <div class="white-space-normal min-width-300">
          {{ scope.value }}
        </div>
      </q-td>
    </template>
    <template #body-cell-addedBy="scope">
      <q-td :props="scope">
        <tools-member-indicator
          :member="scope.row.addedBy"
          show-name
        />
      </q-td>
    </template>
    <template #body-cell-isShow="scope">
      <q-td :props="scope">
        <q-toggle
          v-model="scope.row.isShow"
          @update:model-value="cStore.editNote(scope.row.id, { isShow: $event })"
        />
      </q-td>
    </template>
    <template #body-cell-isForOrder="scope">
      <q-td :props="scope">
        <q-toggle
          v-model="scope.row.isForOrder"
          @update:model-value="cStore.editNote(scope.row.id, { isForOrder: $event })"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { helper } from 'boot/helper'
import { computed } from 'vue'
import { CustomerNote, NoteBasic } from 'src/models/NoteModelShort'

const props = defineProps<{
  customerId: number
}>()

const cStore = useCustomerStore()
cStore.init(props.customerId)
const columns = [
  {
    name: 'text',
    label: 'Note Text',
    field: 'text',
    align: 'left',
    sortable: true
  },
  {
    name: 'addedAt',
    label: 'Created on',
    field: 'addedAt',
    align: 'left',
    sortable: true,
    format: (val: string) => helper.dateEst(val)
  },
  {
    label: 'Show note when identify user',
    field: 'isShow',
    name: 'isShow',
    align: 'center'
  },
  {
    label: 'Tick as for Orders',
    field: 'isForOrder',
    name: 'isForOrder',
    align: 'center'
  },
  {
    name: 'addedBy',
    label: 'Created by',
    field: 'addedBy',
    align: 'left',
    sortable: false
  }
]

const rows = computed(() => {
  return cStore.customer?.notes
    ? [...cStore.customer.notes].sort((a: CustomerNote, b: CustomerNote) => {
        return a.id - b.id
      })
    : []
})
</script>

<style scoped>

</style>
