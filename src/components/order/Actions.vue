<template>
  <div class="col-auto">
    <q-btn
      v-if="oStore.isOrderReady && oStore.order?.rejectable"
      color="negative"
      size="md"
      label="Cancel"
      class="q-ml-sm"
      :loading="oStore.loading"
      @click="voidOrder"
    />

    <order-return-refund-form
      v-if="oStore.isOrderReady && oStore.order?.refundable"
      v-slot="{ open: openDialog }"
      :order-id="props.orderId"
      @success="onRefundRequested"
    >
      <q-btn
        color="secondary"
        text-color="primary"
        size="md"
        label="Refunds"
        class="q-ml-sm"
        @click="openDialog"
      />
    </order-return-refund-form>

    <q-btn
      v-if="oStore.isOrderReady
        && authStore.hasAccessFeature('approve_payment')
        && oStore.order?.status === $constants.ORDER_STATUS_PAID_NOT_VERIFIED"
      color="warning"
      size="md"
      :label="$t('verifyPayment')"
      class="q-ml-sm"
      @click="openApproveDialog(props.orderId)"
    />

    <q-btn
      v-if="[ $constants.STATUS_PACKAGED, $constants.ORDER_STATUS_CREATED ].includes(oStore.order?.status || -100)"
      :disable="orderConfirmationSent"
      color="secondary"
      text-color="primary"
      size="md"
      :label="$t('resendOrderConfirmation')"
      class="q-ml-sm"
      @click="sendOrderConfirmation"
    />
    <q-btn
      v-if="oStore.isOrderReady && oStore.order?.status===$constants.STATUS_PACKAGED"
      :disable="orderTrackingSent"
      color="secondary"
      text-color="primary"
      size="md"
      label="Resend Tracking Link"
      class="q-ml-sm"
      @click="sendTrackingLink"
    />

    <q-btn
      :loading="!oStore.isOrderReady || oStore.loading"
      icon="sym_o_more_vert"
      text-color="blue-grey"
      round
    >
      <q-menu auto-close>
        <q-list>
          <q-item
            clickable
            @click="oStore.loadOrder()"
          >
            <q-item-section>
              Reload data from server
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="createTaskDialog(0, { order: props.orderId, customer: oStore.order?.customer?.id })"
          >
            <q-item-section>
              Create a new task for this order
            </q-item-section>
          </q-item>
          <order-repeat-button
            v-if="oStore.isOrderReady"
            :order="oStore.order as OrderInterface"
            component="QItem"
          />
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import useTasks from 'src/composables/useTasks'
import { useOrderStore } from 'stores/order-store'
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import usePaymentsApprove from 'src/composables/usePaymentsApprove'
import { useAuthStore } from 'stores/auth-store'
import { OrderInterface } from 'src/models/OrderModel'

// noinspection JSUnusedGlobalSymbols
const $q = useQuasar()

const props = defineProps<{
  orderId: number
}>()

const authStore = useAuthStore()

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)

const { openApproveDialog } = usePaymentsApprove()

const orderConfirmationSent = ref(false)
const orderTrackingSent = ref(false)

const sendOrderConfirmation = async () => {
  orderConfirmationSent.value = true
  await $q.notify('Not implemented yet')
}
const sendTrackingLink = async () => {
  orderTrackingSent.value = true
  await $q.notify('Not implemented yet')
}

const voidOrder = async () => {
  $q.dialog({
    title: 'Cancel order?',
    message: 'Are you sure you want to cancel this order and return funds to customer? <br /> This action cannot be undone.',
    html: true,
    cancel: 'No, I changed my mind',
    ok: {
      label: 'Yes',
      color: 'negative'
    }
  }).onOk(async () => {
    await oStore.cancel()
      .catch((e: unknown | AxiosError) => {
        $q.notify('Failed to cancel order')
        if (axios.isAxiosError(e)) {
          const serverErrors = helper.getFirstErrors(e.response?.data || {}) as { [key: string]: string }
          if (serverErrors.general) {
            $q.notify({
              message: serverErrors.general,
              color: 'negative'
            })
          }
        }
      })
  })
}

const onRefundRequested = () => {
  $q.notify('Refund requested')
  oStore.loadOrder(props.orderId)
}

const { createTaskDialog } = useTasks()

</script>
