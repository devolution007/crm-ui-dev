<template>
  <div
    v-if="isEntryReady && ! isProcessing"
    class="col-auto"
  >
    <q-btn
      :disable="! isRowsAcceptable"
      color="secondary"
      text-color="primary"
      size="md"
      label="Confirm rows"
      class="q-ml-sm"
      @click="onAcceptRows"
    />

    <q-btn
      :disable="! isRowsRejectable"
      color="secondary"
      text-color="primary"
      size="md"
      label="Reject"
      class="q-ml-sm"
      @click="onRejectRows"
    />

    <q-btn
      v-if="isRowsReversable"
      color="secondary"
      text-color="primary"
      size="md"
      label="Reverse"
      class="q-ml-sm"
      @click="onReverseRows"
    />

    <q-btn
      v-if="refund?.deletable === true"
      color="negative"
      size="md"
      label="Delete refund"
      class="q-ml-sm"
      @click="deleteRefundAttempt"
    />

    <q-icon
      v-if="props.selectedRows.length === 0"
      class="q-ml-md"
      color="warning"
      size="sm"
      name="sym_o_tips_and_updates"
    >
      <q-tooltip
        anchor="bottom left"
        class="text-body2"
      >
        Select rows to perform actions
      </q-tooltip>
    </q-icon>
  </div>
  <div
    v-else
    class="col-auto"
  >
    <q-skeleton
      type="QBtn"
    />
  </div>
</template>

<script setup lang="ts">
import { Dialog, Notify } from 'quasar'
import { computed, ref, Ref } from 'vue'

import { useRefundsStore } from 'stores/refunds-store'
import RefundRowModel from 'src/models/RefundRowModel'
import RefundApi from 'src/api/RefundApi'
import { api } from 'boot/axios'
import { constants } from 'boot/constants'
import { AxiosError } from 'axios'
import { helper } from 'boot/helper'

const isProcessing: Ref<boolean> = ref(false)

const props = defineProps<{
  refundId: number
  selectedRows: RefundRowModel[]
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'onDeleted', payload: number): void,
  (event: 'onRowsActed', payload: RefundRowModel[]): void,
}>()

const {
  getEntryByID,
  fetchEntry,
  getIsEntryReadyByID,
  getLoadingByID,
  deleteEntry
} = useRefundsStore()

const refund = getEntryByID(props.refundId)
const isEntryReady = getIsEntryReadyByID(props.refundId)

const deleteRefundAttempt = async () => {
  isProcessing.value = true
  Dialog.create({
    title: 'Delete refund?',
    message: 'Are you sure you want to delete this refund? <br /> This action cannot be undone.',
    html: true,
    cancel: 'No, I changed my mind',
    ok: {
      label: 'Yes',
      color: 'negative'
    }
  }).onOk(async () => {
    await deleteEntry(props.refundId)
    Notify.create({
      message: 'Refund deleted',
      color: 'positive'
    })
    emit('onDeleted', props.refundId)
  })
  isProcessing.value = false
}

const isRowsRejectable = computed(() => {
  return props.selectedRows.length > 0 && props.selectedRows.every((row: RefundRowModel) => row.isPending)
})

const isRowsAcceptable = computed(() => {
  return props.selectedRows.length > 0 && props.selectedRows.every((row: RefundRowModel) => row.isPending)
})

const isRowsReversable = computed(() => {
  return props.selectedRows.length > 0 && props.selectedRows.every((row: RefundRowModel) => row.isReversible)
})

const onRejectRows = async () => {
  Dialog.create({
    title: 'Reject rows?',
    message: 'Please select a reason for rejecting the selected rows:',
    html: true,
    options: {
      type: 'radio',
      model: '',
      items: constants.REFUND_ROW_REJECT_REASONS,
      isValid: val => !!val
    },
    cancel: 'No, I changed my mind',
    ok: {
      label: 'Confirm',
      color: 'negative'
    }
  }).onOk(async (reason) => {
    isProcessing.value = true
    try {
      await (new RefundApi(api)).rejectRows(props.refundId, props.selectedRows.map((row) => row.id), reason)

      await fetchEntry(props.refundId)
      Notify.create({
        message: 'Rows rejected',
        color: 'positive'
      })
      emit('onRowsActed', props.selectedRows)
    } catch (error: AxiosError | any) {
      if (error.response && error.response.data && error.response.status === 422) {
        Notify.create({
          message: 'Error rejecting rows',
          color: 'negative'
        })
      } else {
        Notify.create({
          message: 'Undefined error rejecting rows',
          color: 'negative'
        })
      }
    }
    isProcessing.value = false
  })
}

const onAcceptRows = async () => {
  Dialog.create({
    message: 'Are you sure you want to refund the selected rows?<br />' +
      'After confirmation, the funds will be returned to the customer.' +
      '<br /><br />' +
      '⚠️ This action may not be undone (depending on the payment method)',
    html: true,
    cancel: 'No, I changed my mind',
    ok: {
      label: 'Confirm',
      color: 'negative'
    }
  }).onOk(async () => {
    isProcessing.value = true

    try {
      await (new RefundApi(api)).acceptRows(props.refundId, props.selectedRows.map((row) => row.id))

      await fetchEntry(props.refundId)

      Notify.create({
        message: 'Refund completed',
        color: 'positive'
      })

      emit('onRowsActed', props.selectedRows)
    } catch (error: AxiosError | any) {
      if (error.response && error.response.data && error.response.status === 422) {
        Notify.create({
          message: 'Error refunding rows',
          color: 'negative'
        })
      } else {
        Notify.create({
          message: 'Undefined error when trying to refund rows',
          color: 'negative'
        })
      }
    }

    isProcessing.value = false
  })
}

const onReverseRows = async () => {
  Dialog.create({
    message: 'Are you sure you want to reverse the selected rows?' +
      '<br />' +
      'After confirmation, the customer will be charged again.' +
      '<br /><br />' +
      'Please select a reason for reversing the selected rows:',
    html: true,
    options: {
      type: 'radio',
      model: '',
      items: constants.REFUND_ROW_REVERSE_REASONS,
      isValid: val => !!val
    },
    cancel: 'No, I changed my mind',
    ok: {
      label: 'Confirm',
      color: 'negative'
    }
  }).onOk(async (reason) => {
    isProcessing.value = true

    try {
      await (new RefundApi(api)).reverseRows(props.refundId, props.selectedRows.map((row) => row.id), reason)

      await fetchEntry(props.refundId)

      Notify.create({
        message: 'Rows reversed',
        color: 'positive'
      })

      emit('onRowsActed', props.selectedRows)
    } catch (error: AxiosError | any) {
      if (error.response && error.response.data && error.response.status === 422) {
        Notify.create({
          message: 'Error reversing rows',
          caption: helper.convertFirstValidationErrorToMessage(error.response.data),
          color: 'negative'
        })
      } else {
        Notify.create({
          message: 'Undefined error when trying to reverse rows',
          color: 'negative'
        })
      }
    }

    isProcessing.value = false
  })
}
</script>
