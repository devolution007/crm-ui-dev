<template>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    binary-state-sort
    :rows-per-page-options="[15, 25, 50, 100]"
    separator="cell"
    @request="onRequest"
  >
    <template #body-cell-id="scope">
      <q-td :props="scope">
        <q-btn
          text-color="primary"
          size="md"
          :to="{ name: 'customer-order-details', params: { orderId: scope.value } }"
        >
          {{ scope.value }}
        </q-btn>
      </q-td>
    </template>
    <template #body-cell-createdAt="scope">
      <q-td :props="scope">
        {{ $helper.dateEst(scope.value) }}
      </q-td>
    </template>
    <template #body-cell-price="scope">
      <q-td :props="scope">
        $ {{ scope.value }}
      </q-td>
    </template>
    <template #body-cell-note="scope">
      <q-td :props="scope">
        <q-btn
          v-if="scope.value"
          icon="sym_o_text_snippet"
          round
          text-color="text-toner"
          size="md"
          @click="showOrderNote(scope.row)"
        />
      </q-td>
    </template>
    <template #body-cell-attachments="scope">
      <q-td :props="scope">
        <app-attachments-btn-download
          v-if="scope.value && scope.value.length > 0"
          :attachments="scope.value"
        />
      </q-td>
    </template>
    <template #body-cell-trackingNumber="scope">
      <q-td>
        <order-track-button
          v-if="scope.value"
          :tracking-code="scope.value"
          :tracking-link="scope.row.trackingLink"
        />
      </q-td>
    </template>
    <template #body-cell-deliveryDate="scope">
      <q-td :props="scope">
        <span v-if="scope.value">
          {{ $helper.dateEst(scope.value, DATE_FORMAT) }}
        </span>
      </q-td>
    </template>
    <template #body-cell-actions="scope">
      <q-td :props="scope">
        <order-repeat-button
          :order="scope.row"
          component="QBtn"
        />
      </q-td>
    </template>
  </q-table>

  <AppDialog
    v-model="isNoteDialogOpen"
    :title="$t('orderNote')"
    min-width="400px"
    :show-actions="false"
    @cancel="orderForNote = null"
  >
    <div v-if="!!orderForNote">
      <div
        v-for="note in orderForNote.notes"
        :key="`orderNote-${note.id}`"
      >
        <div class="text-caption">{{ note.authorName }} at {{ note.addedAtEst }}</div>
        <div class="white-space-pre-line">
          {{ note.text }}
        </div>
      </div>
      <div
        v-if="orderForNote?.noteForPostman"
        class="q-pt-md"
      >
        <div class="text-caption">{{ $t('shippingLabelNoteForPostman') }}</div>
        {{ orderForNote?.noteForPostman }}
      </div>
    </div>
  </AppDialog>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  }
})

import { ref, onMounted, computed, Ref, reactive, watch } from 'vue'
import { QTable, format } from 'quasar'
import { OrdersFilter, SortBy } from 'src/types'
import { api } from 'boot/axios'
import OrderApi from 'src/api/OrderApi'
import OrderModel, { OrderInterface } from 'src/models/OrderModel'
import { useI18n } from 'vue-i18n'
import { DATE_FORMAT } from 'src/types/formats'
import { useOrderTypes } from 'src/composables/useOrderTypes'
const { t } = useI18n()
const { capitalize } = format
const { labelByType: orderLabel } = useOrderTypes()

const tableRef = ref(<QTable>{})

const loading = ref(false)
const filters: OrdersFilter = reactive({
  // status: null,
  customerId: props.customerId
})

const columns = computed(() => [
  {
    name: 'id',
    field: 'id',
    required: true,
    label: 'Order ID',
    align: 'left',
    sortable: true
  },
  {
    field: (row: OrderInterface) => capitalize(orderLabel(row.type)) || `${row.type}`,
    label: 'Type'
  },
  {
    name: 'createdAt',
    field: 'createdAt',
    label: 'Date',
    sortable: true
  },
  {
    field: 'statusName',
    label: 'Status'
  },
  {
    name: 'price',
    field: 'price',
    label: 'Total'
  },
  {
    name: 'note',
    field: (row: OrderInterface) => !!row.noteForPostman || row.notes.length > 0,
    label: 'Note'
  },
  {
    name: 'attachments',
    field: 'attachments',
    label: 'Attachments',
    align: 'center'
  },
  {
    field: 'carrierName',
    label: 'Carrier'
  },
  {
    name: 'trackingNumber',
    field: 'trackingNumber',
    label: t('trackingInfo'),
  },
  {
    name: 'deliveryDate',
    field: 'deliveryDate',
    label: 'Est. Delivery Date'
  },
  {
    field: 'actions',
    name: 'actions',
    label: t('actions')
  }
])

const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: <number | undefined>-1
})

const sorting: Ref<SortBy[]> = ref([])
const ordersRepo = new OrderApi(api)
const rows = ref(<OrderModel[]>[])

const isNoteDialogOpen = ref(false)
const orderNote = ref('')
const orderForNote: Ref<OrderInterface | null> = ref(null)

async function onRequest (props: any) {
  console.log('requested')
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  loading.value = true

  // Store requested sorting info
  const sortEntry = {} as SortBy
  sortEntry[sortBy] = descending ? 'desc' : 'asc'
  sorting.value = [
    sortEntry
  ]
  // Note: we are sending a full set of collected sorting variations to the server
  const response = await ordersRepo.getOrders(page, filters, sorting.value, rowsPerPage)

  pagination.value.rowsNumber = response.totalItemCount

  rows.value.splice(0, rows.value.length, ...response.items)

  // don't forget to update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  // ...and turn of loading indicator
  loading.value = false
}

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})
watch(() => props.customerId, () => {
  filters.customerId = Number(props.customerId)
  tableRef.value.requestServerInteraction()
})

const showOrderNote = (order: OrderInterface) => {
  orderNote.value = order.noteForPostman as string
  orderForNote.value = order
  isNoteDialogOpen.value = true
}

const customerStore = useCustomerStore()
</script>
