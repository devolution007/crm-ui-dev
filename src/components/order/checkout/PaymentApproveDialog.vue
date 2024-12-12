<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.lg"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      :style="modalCardStyles"
    >
      <q-form
        ref="form"
        @submit.prevent="submit"
      >
        <bricks-dialog-card-title>
          {{ $t('paymentVerification') }}
        </bricks-dialog-card-title>
        <q-card-section>
          <order-checkout-payment-t-r-n-s-x-helper
            v-if="paymentDetails && paymentDetails.processor === $constants.PAYMENT_PROCESSOR_CODE_TRNSX"
            :card="paymentDetails?.details?.input?.card || ''"
            :order-info="orderInfo"
            @ready="onPaymentHelperReady"
            @not-ready="onPaymentHelperNotReady"
          />
          <order-checkout-payment-n-a-t-i-o-n-s-helper
            v-if="paymentDetails && paymentDetails.processor === $constants.PAYMENT_PROCESSOR_CODE_NATIONS"
            :card="paymentDetails?.details?.input?.card || ''"
            :order-info="orderInfo"
            @ready="onPaymentHelperReady"
            @not-ready="onPaymentHelperNotReady"
          />
        </q-card-section>
        <q-card-actions align="between">
          <span />
          <q-btn
            :disable="!ready"
            color="primary"
            type="submit"
            class="float-right"
            :loading="submitting"
            :label="$t('finalizePayment')"
          />
        </q-card-actions>
      </q-form>

      <q-inner-loading :showing="loading" />
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">

import { Notify, useDialogPluginComponent } from 'quasar'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { useModalCardStyles } from 'src/composables/useModalCardStyles'

import { api } from 'boot/axios'
import OrderApi from 'src/api/OrderApi'
import { OrderPaymentInfoInterface } from 'src/models/OrderModel'
import { PaymentDetailsInterface } from 'src/models/Payments'
import { AxiosError } from 'axios'
import { useOrderStore } from 'stores/order-store'

const props = defineProps<{
  orderId: number
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const { modalCardStyles } = useModalCardStyles('large', 'sm')

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)

const repository: OrderApi = new OrderApi(api)

const loading = ref(false)
const submitting = ref(false)
const ready = ref(false)

const paymentResult: Ref<Record<string, unknown>> = ref({})

const orderInfo: Ref<OrderPaymentInfoInterface> = ref({
  id: 0,
  price: '',
  itemsSubtotal: '',
  itemsUnDiscountedSubtotal: '',
  rows: []
})
const paymentDetails: Ref<PaymentDetailsInterface | null> = ref(null)

const onPaymentHelperReady = (eventData: Record<string, unknown>) => {
  ready.value = true
  paymentResult.value = eventData
}

const onPaymentHelperNotReady = () => {
  ready.value = false
  paymentResult.value = {}
}

async function submit () {
  if (!paymentDetails.value?.processor) {
    Notify.create({
      message: 'Payment processor is not defined',
      color: 'negative'
    })
    return
  }

  submitting.value = true
  try {
    await oStore.approvePayment(paymentDetails.value?.processor, paymentResult.value)
    onDialogOK()
  } catch (error: AxiosError | any) {
    if (error.response && error.response.data && error.response.status === 422) {
      const message = error.response.data?.general || error.response.data?.message || 'Something went wrong'
      Notify.create({
        message,
        color: 'negative'
      })
    }
  } finally {
    submitting.value = false
  }
}

const loadPaymentDetails = async () => {
  loading.value = true
  try {
    const data = await repository.fetchPaymentDetails(props.orderId)
    orderInfo.value = data.order
    paymentDetails.value = data.paymentDetails

    if (window?.callOtcExtensionFunction) {
      window.callOtcExtensionFunction('orderData', {
        id: data.order.id,
        card: data?.paymentDetails?.details?.input?.card || '',
        price: data.order.price,
        rows: data.order.rows
      })
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPaymentDetails()
})

watch(() => props.orderId, () => {
  loadPaymentDetails()
})
</script>

<style scoped>

</style>
