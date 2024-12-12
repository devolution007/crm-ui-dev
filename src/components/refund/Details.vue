<!--suppress VueUnrecognizedSlot -->
<template>
  <q-card>
    <q-card-section class="bg-toner">
      <div class="row items-center no-wrap">
        <div class="col">
          <bricks-page-title :padding="false">Refund #{{ props.refundId }}</bricks-page-title>
        </div>
        <refund-actions
          :refund-id="props.refundId"
          :selected-rows="selectedRows"
          @on-deleted="(refId) => $emit('onDeleted', refId)"
          @on-rows-acted="cancelSelection"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="bg-toner">
      <div class="text-h6">
        Refund Information
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-4">
          <q-list>
            <list-details-line
              label="Order"
              :show-data="isEntryReady"
            >
              <q-btn
                color="secondary"
                text-color="blue-8"
                size="md"
                :to="{ name: 'customer-order-details', params: {
                  customerId: refund?.order.customer?.id,
                  orderId: refund?.order.id
                } }"
              >
                #{{ refund?.order.id }}
              </q-btn>
            </list-details-line>

            <list-details-line
              label="Order issues"
              :show-data="isEntryReady"
            >
              <!-- @todo: add issue modal -->
              <q-btn
                v-for="issue in refund?.order.issues"
                :key="`refund_${refund.id}_issue_${issue.id}`"
                color="secondary"
                text-color="blue-8"
                size="md"
                class="q-mr-sm"
                @click="$q.notify(`Issue open is not implemented yet.`)"
              >
                #{{ issue.id }}
              </q-btn>
            </list-details-line>

            <list-details-line
              label="Customer"
              :show-data="isEntryReady"
            >
              <q-btn
                color="secondary"
                text-color="blue-8"
                size="md"
                :to="{ name: 'customer-details', params: {
                  customerId: refund?.order.customer?.id
                } }"
              >
                {{ refund?.order.customer?.name }}
              </q-btn>
            </list-details-line>
          </q-list>
        </div>
        <div class="col-4">
          <list-details-line
            label="Attachments"
            :show-data="isEntryReady"
          >
            <app-attachments-btn-download
              v-if="isEntryReady && refund?.attachments.length > 0"
              :attachments="refund?.attachments"
            />
          </list-details-line>
          <list-details-line
            label="Notes"
            :show-data="isEntryReady"
          >
            <div
              v-for="note in refund?.notes"
              :key="`refund${refund.id}_note_${note.id}`"
            >
              {{ note.addedAtEst }}:
              "{{ note.text }}". ({{ note.authorName }})
            </div>
          </list-details-line>
        </div>
        <div class="col-4">
          <list-details-line
            label="Requested On"
            :show-data="isEntryReady"
          >
            {{ $helper.dateEst(refund?.createdAt) }}
          </list-details-line>
          <list-details-line
            label="Requested By"
            :show-data="isEntryReady"
          >
            <tools-member-indicator
              :member="refund?.performer"
              :show-name="true"
            />
          </list-details-line>
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="text-h6">
        Refund Rows
      </div>

      <q-table
        v-model:selected="selectedRows"
        :rows="refundRows"
        :pagination="{
          rowsPerPage: 0
        }"
        hide-pagination
        flat
        selection="multiple"
        row-key="id"
        :columns="columns"
      >
        <template #body-cell-skuImage="props">
          <q-td :props="props">
            <q-img
              :src="props.value.mainImage"
              :alt="props.value.name"
              width="100px"
              ratio="1"
              fit="scale-down"
            />
          </q-td>
        </template>
        <template #body-cell-sku="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.value.name }}
            </div>
            <div class="row q-gutter-md">
              <span class="text-grey-8">SKU: {{ props.value.sku }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-price="props">
          <q-td :props="props">
            $ {{ props.value }}
          </q-td>
        </template>
        <template #body-cell-reason="props">
          <q-td :props="props">
            <div>
              {{ $constants.REFUND_REASONS.find((r) => r.value === props.value).label }}
            </div>
            <div v-if="props.row.isReversed">
              <span>Reverse reason:</span>
              {{ $constants.REFUND_ROW_REVERSE_REASONS.find((r) => r.value === props.row.reverseReason).label }}
            </div>
            <div v-if="props.row.isRejected">
              <span>Reject reason:</span>
              {{ $constants.REFUND_ROW_REJECT_REASONS.find((r) => r.value === props.row.rejectReason).label }}
            </div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getRowColor(props.row)"
              square
            >
              {{ props.row.statusText }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import ListDetailsLine from 'components/tools/ListDetailsLine.vue'
import { useRefundsStore } from 'stores/refunds-store'
import { computed, readonly, Ref, ref } from 'vue'
import RefundRowModel from 'src/models/RefundRowModel'
import { QTable } from 'quasar'

const props = defineProps<{
  refundId: number
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'onDeleted', payload: number): void
}>()

const {
  getEntryByID,
  getIsEntryReadyByID
} = useRefundsStore()

const refund = getEntryByID(props.refundId)
const isEntryReady = getIsEntryReadyByID(props.refundId)

const refundRows = readonly(
  computed(() => (isEntryReady.value && refund?.value.rows) || [])
)
const selectedRows: Ref<RefundRowModel[]> = ref([])
const columns = computed(() => [
  {
    name: 'skuImage',
    field: 'sku',
    label: '',
    align: 'left'
  },
  {
    name: 'sku',
    field: 'sku',
    label: 'Sku',
    align: 'left'
  },
  {
    name: 'reason',
    field: 'reason',
    align: 'left',
    label: 'Reason'
  },
  {
    name: 'status',
    field: 'status',
    label: 'Status'
  },
  {
    name: 'price',
    field: 'price',
    label: 'Price',
    sortable: true
  }
])

const getRowColor = (row: RefundRowModel) => {
  if (row.isRefunded) {
    return 'green-3'
  }
  if (row.isRejected) {
    return 'red-3'
  }
  if (row.isReversed) {
    return 'orange-3'
  }
  return 'grey-3'
}

const cancelSelection = () => {
  selectedRows.value = []
}
</script>
