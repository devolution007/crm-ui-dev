<template>
  <slot
    :open="openDialog"
  />
  <app-dialog
    v-model="editShown"
    title="Refund request"
    :loading="loading"
    min-width="900"
  >
    <div class="text-toner q-mb-sm">
      Registered refunds
    </div>
    <q-markup-table class="q-mb-lg">
      <template #default>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product</th>
            <th class="text-right">
              Price
            </th>
            <th class="text-right">
              Ordered
            </th>
            <th class="text-right">
              To Refund
            </th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="refundedRow in refundedRows"
            :key="`refunded-row-${props.orderId}-${refundedRow.id}`"
          >
            <td>{{ refundedRow.sku }}</td>
            <td class="white-space-normal">
              {{ refundedRow.name }}
            </td>
            <td class="text-right">
              $ {{ refundedRow.price }}
            </td>
            <td class="text-right">
              {{ refundedRow.ordered }}
            </td>
            <td class="text-right">
              {{ refundedRow.amount }}
            </td>
            <td>
              <div
                v-for="reason in refundedRow.reasons"
                :key="`regReason${orderId}_${refundedRow.order_row_id}_RefRow_${refundedRow.sku}_${reason}`"
              >
                {{ constants.REFUND_REASONS.find((r) => r.value === reason).label }}
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </q-markup-table>

    <q-form
      v-if="notRefundedRows.length > 0"
      autocomplete="off"
      class="q-mb-sm"
      @submit.prevent="prepareFullRefund"
    >
      <q-select
        v-model="mutableEntry.reason"
        label="Reason"
        :options="$constants.REFUND_REASONS"
        map-options
        emit-value
        :error="!!serverErrors.reason"
        :error-message="serverErrors.reason"
      >
        <template #append>
          <q-btn
            size="md"
            color="secondary"
            text-color="primary"
            label="Apply to all"
            :disable="!mutableEntry.reason"
            @click.stop.prevent="prepareFullRefund"
          />
        </template>
      </q-select>
    </q-form>

    <q-banner
      v-if="notRefundedRows.length === 0"
      class="bg-amber-1"
    >
      No order rows available for refund
    </q-banner>
    <q-form
      v-if="notRefundedRows.length > 0"
      ref="newRowsForm"
      autocomplete="off"
      @submit.prevent="refundRowsSubmit"
    >
      <div class="text-toner q-mb-sm">
        Order rows available for refund
      </div>
      <q-markup-table class="q-mb-md">
        <template #default>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th class="text-right">
                Price
              </th>
              <th class="text-right">
                Ordered
              </th>
              <th class="text-right">
                Rest
              </th>
              <th class="text-right">
                To Refund
              </th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in notRefundedRows"
              :key="`not-refunded-row-${props.orderId}-${row.id}`"
              class="vertical-middle"
            >
              <td>{{ row.sku }}</td>
              <td class="white-space-normal">
                {{ row.name }}
              </td>
              <td>
                <div class="q-pb-md">
                  $ {{ row.price }}
                </div>
              </td>
              <td>
                <div class="q-pb-md">
                  {{ row.ordered }}
                </div>
              </td>
              <td>
                <div class="q-pb-md">
                  {{ row.maxAmount }}
                </div>
              </td>
              <td>
                <q-select
                  v-model="row.amount"
                  :error="!!getErr(index, 'amount')"
                  :error-message="getErr(index, 'amount')"
                  :options="Array.from(Array(row.maxAmount + 1).keys())"
                  dense
                />
              </td>
              <td>
                <q-select
                  v-model.number="row.reason"
                  :options="$constants.REFUND_REASONS"
                  dense
                  map-options
                  emit-value
                  :error="!!getErr(index, 'reason')"
                  :error-message="getErr(index, 'reason')"
                />
              </td>
            </tr>
          </tbody>
        </template>
      </q-markup-table>

      <q-input
        v-model="mutableEntry.note"
        type="textarea"
        label="Notes"
        rows="3"
        class="q-mb-md"
        :error="!!serverErrors.notes"
        :error-message="serverErrors.notes"
      />

      <q-field
        label="Attachments"
        :stack-label="true"
        class="q-mb-md"
      >
        <div class="q-pt-sm full-width">
          <app-attachments-upload
            ref="attachmentsBox"
            :attachments="attachments"
            @uploaded-one="attachments.push($event)"
            @deleted="onAttachmentDeleted"
          />
        </div>
      </q-field>
    </q-form>

    <template #primary-action>
      <q-btn
        color="negative"
        label="Create Refund"
        :loading="loading"
        type="submit"
        :disable="!isFormReady"
        @click="refundRowsSubmit"
      />
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import { ErrorContainer } from 'src/types/classes'
import { constants } from 'boot/constants'
import { AttachmentInfo, FileUploadedResponse, RefundFormRegisteredRow, RefundFormRow } from 'src/types'
import OrderRowModel from 'src/models/OrderRowModel'
import RefundLERowModel from 'src/models/RefundLERowModel'
import { api } from 'boot/axios'
import RefundApi from 'src/api/RefundApi'
import { useAuthStore } from 'stores/auth-store'
import { QForm, QUploader, useQuasar } from 'quasar'
import { helper } from 'boot/helper'
import { AxiosError } from 'axios'
import { useOrderStore } from 'stores/order-store'

const $q = useQuasar()
const auth = useAuthStore()

class IErr extends ErrorContainer {
  reason: string | null = null
  notes: string | null = null
  rows: {
    [key: number]: {
      amount: string | null
      reason: string | null
    }
  } = {}
}

const props = defineProps<{
  orderId: number
}>()
// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'success'): void
}>()

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)

const newRowsForm = ref<QForm | null>(null)
const editShown = ref(false)
const loading = ref(false)
const mutableEntry = ref({
  reason: null,
  note: ''
})
const attachments = ref<AttachmentInfo[]>([])
const notRefundedRows = ref<RefundFormRow[]>([])
const serverErrors = <Ref<IErr>>ref(new ErrorContainer())

const openDialog = () => {
  editShown.value = true
  fillNotRefundedRows()
}

const prepareFullRefund = async () => {
  notRefundedRows.value = notRefundedRows.value.map(row => {
    row.amount = row.maxAmount
    row.reason = mutableEntry.value.reason
    return row
  })
}

const isFormReady = computed(() => {
  return notRefundedRows.value.length > 0 && notRefundedRows.value.some(row => {
    return row.amount && row.reason
  })
})

const refundRowsSubmit = async () => {
  if (!isFormReady.value) {
    return
  }

  loading.value = true
  const rows = notRefundedRows.value.filter(row => row.amount > 0)

  try {
    await new RefundApi(api).create({
      order_id: props.orderId,
      note: mutableEntry.value.note,
      rows,
      attachments: attachments.value.map(attachment => attachment.id)
    })
      .finally(() => {
        loading.value = false
      })

    emit('success')
    editShown.value = false
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    if (axiosError.response && axiosError.response.data && axiosError.response.status === 422) {
      setServerErrors(axiosError.response.data)
      $q.notify('Validation error')
    }
  }
}

const getErr = (index: number, field: 'reason'|'amount') => {
  if (!serverErrors.value.rows || !serverErrors.value.rows[index]) {
    return null
  }
  const err = serverErrors.value.rows[index] || {}
  return err ? err[field] : null
}

const setServerErrors = (errors: object) => {
  serverErrors.value = Object.assign(new IErr(), helper.getFirstErrors(errors))
}

const refundedRows = computed<RefundFormRegisteredRow[]>(() => {
  const rows: RefundFormRegisteredRow[] = []

  if (!oStore.order) {
    return rows
  }

  oStore.order.rows.forEach((orderRow) => {
    orderRow.refundRows.filter((refundRow: RefundLERowModel) => {
      return !refundRow.hasInactiveStatus
    }).forEach((refundRow: RefundLERowModel) => {
      const found = rows.find((item: RefundFormRegisteredRow) => item.sku === orderRow.sku.sku)
      if (found) {
        if (!found.reasons.includes(refundRow.reason)) {
          found.reasons.push(refundRow.reason)
        }

        found.amount = (found.amount || 0) + 1
      } else {
        const refundFormRow: RefundFormRegisteredRow = {
          order_row_id: orderRow.id,
          sku: orderRow.sku.sku,
          name: orderRow.sku.name,
          price: orderRow.price,
          amount: 1,
          reasons: [refundRow.reason],
          ordered: orderRow.amount
        }
        rows.push(refundFormRow)
      }
    })
  })
  return rows
})

const fillNotRefundedRows = () => {
  notRefundedRows.value = []
  if (!oStore.order) {
    return
  }
  oStore.order.rows.forEach((orderRow) => {
    const notRefundedYet = orderRow.amount - orderRow.refundRows.filter((refundRow: RefundLERowModel) => {
      return !refundRow.hasInactiveStatus
    }).length
    if (notRefundedYet > 0) {
      notRefundedRows.value.push({
        order_row_id: orderRow.id,
        sku: orderRow.sku.sku,
        name: orderRow.sku.name,
        price: orderRow.price,
        amount: 0,
        reason: null,
        maxAmount: notRefundedYet,
        ordered: orderRow.amount
      })
    }
  })
}

const onAttachmentDeleted = (attachment: AttachmentInfo) => {
  attachments.value = attachments.value.filter(item => item.id !== attachment.id)
}
</script>
