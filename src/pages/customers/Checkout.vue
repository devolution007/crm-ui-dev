<template>
  <q-page class="q-pb-xl">
    <!-- content -->
    <q-card>
      <div
        v-if="checkoutForm"
        class="absolute-top-right q-pr-sm q-pt-xs z-index-2"
      >
        <q-spinner v-if="checkoutForm.loading" />
        <q-icon
          v-else-if="checkoutFormSavedSignal !== null && Number.isInteger(checkoutFormSavedSignal)"
          name="sym_o_cloud_done"
          size="sm"
        >
          <q-tooltip
            class="text-body2"
          >
            {{ t('allChangesAreSaved', {fromNowAgoString: $helper.fromNow(checkoutFormSavedSignal)}) }}
          </q-tooltip>
        </q-icon>
        <q-icon
          v-else-if="checkoutFormSavedSignal !== null && !Number.isInteger(checkoutFormSavedSignal)"
          name="sym_o_sync_problem"
          size="sm"
        >
          <q-tooltip
            class="text-body2"
          >
            {{ checkoutFormSavedSignal }}
          </q-tooltip>
        </q-icon>
        <q-icon
          v-if="!!checkoutError"
          name="sym_o_warning"
          color="negative"
        >
          <q-tooltip
            class="text-body2"
          >
            {{ checkoutError }}
          </q-tooltip>
        </q-icon>
      </div>
      <q-card-section>
        <div class="text-h6">
          {{ $t('orderItems') }}
        </div>
        <order-checkout-positions-manager
          :customer-id="props.customerId"
          :order-id="props.orderId"
          :rejected-rows="rejectedSkus"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">
          {{ $t('orderInformation') }}
        </div>

        <div class="text-body2 q-mb-sm">
          {{ $t('shippingAddress') }}
        </div>
        <order-checkout-address-selector
          class="q-mb-md"
          :customer-id="props.customerId"
          :order-id="props.orderId"
          @select:error="$q.notify({ message: $event, color: 'negative' })"
        />

        <order-checkout-information-form
          v-if="oStore.isOrderReady"
          ref="checkoutForm"
          :customer-id="props.customerId"
          :order-id="props.orderId"
          @saved="checkoutFormSavedSignal = Date.now()"
          @save:error="checkoutFormSavedSignal = $event"
          @save:start="checkoutFormSavedSignal = null"
        />
        <div
          v-else
          class="q-pt-md"
        >
          <q-skeleton
            class="q-mb-xs"
            height="10px"
            width="50%"
          />
          <q-skeleton
            class="q-mb-md"
            height="20"
          />
          <q-skeleton
            class="q-mb-xs"
            height="10px"
            width="50%"
          />
          <q-skeleton
            class="q-mb-md"
            height="20"
          />
        </div>
      </q-card-section>

      <order-checkout-payment-form
        v-if="oStore.isOrderReady"
        ref="paymentForm"
        :customer-id="props.customerId"
        :order-id="props.orderId"
        :payment-processor="paymentProcessor"
        @success="onPaymentSuccess"
        @update:processor="paymentProcessor = $event"
        @pay:start="checkoutError = null; rejectedSkus = []"
        @pay:error="checkoutError = $event"
        @pay:rejected-skus="rejectedSkus = $event"
      />

      <order-summary :order-id="props.orderId" />

      <q-banner
        v-if="!!mixedSourceError"
        :class="{
          'bg-negative': !!checkoutError,
          'bg-amber-10': !checkoutError
        }"
      >
        <div class="flex items-center">
          {{ mixedSourceError }}
          <q-space />
          <q-btn
            v-if="!!checkoutError"
            :label="$t('doDismiss')"
            @click="checkoutError = null"
          />
        </div>
      </q-banner>
      <q-banner
        v-if="oStore.checkoutLoading || oStore.payLoading"
      >
        <div class="flex items-center">
          <q-spinner class="q-mr-md" />

          <span v-if="oStore.checkoutLoading">{{ $t('orderPlacementWait') }}</span>
          <span v-if="oStore.payLoading">{{ $t('paymentProcessingWait') }}</span>
        </div>
      </q-banner>
    </q-card>
    <q-page-sticky
      position="bottom-right"
      :offset="[0, 0]"
    >
      <order-the-order-submitter
        v-if="oStore.isOrderReady"
        :customer-id="props.customerId"
        :order-id="props.orderId"
        :disabled="isHasCheckoutInputErrors"
        @checkout:start="checkoutError = null"
        @checkout:error="checkoutError = $event"
        @checkout:success="$refs.paymentForm?.paymentAttempt()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">

import { useMeta } from 'quasar'
import { computed, Ref, ref } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { PaymentProcessorCode } from 'src/types'
import { useCall } from 'stores/call'
import { useRouter } from 'vue-router'
import { RejectedRowInterface } from 'src/models/OrderRowModel'
import { useI18n } from 'vue-i18n'

useMeta({
  title: 'Checkout'
})

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  }
})

const { t } = useI18n()

interface InformationForm {
  loading: boolean
}
interface PaymentForm {
  paymentAttempt: () => void
  paymentFormValidationError: string|null
}
const checkoutForm: Ref<InformationForm | null> = ref(null)
const checkoutFormSavedSignal: Ref<null|number|string> = ref(null)
const paymentForm: Ref<PaymentForm | null> = ref(null)

const oStore = useOrderStore()
oStore.init(props.orderId, () => {
  oStore.recalculate()
})

const paymentProcessor: Ref<PaymentProcessorCode | null> = ref(null)

const checkoutInputErrors = computed(() => {
  const errors: string[] = []
  if (!paymentProcessor.value) {
    errors.push('Payment method is required')
  }
  if (paymentForm.value?.paymentFormValidationError) {
    errors.push(paymentForm.value?.paymentFormValidationError)
  }

  return errors
})
const isHasCheckoutInputErrors = computed(() => checkoutInputErrors.value.length > 0)

const checkoutError: Ref<string|null> = ref(null)
const rejectedSkus: Ref<RejectedRowInterface[]> = ref([])
const router = useRouter()

const onPaymentSuccess = () => {
  // Go to order details page
  router.push({
    name: 'customer-order-details',
    params: {
      customerId: props.customerId,
      orderId: oStore.orderId
    },
    query: {
      new: 1
    }
  })
}

const mixedSourceError = computed(() => {
  if (isHasCheckoutInputErrors.value) {
    return checkoutInputErrors.value[0]
  }
  if (checkoutError.value) {
    return checkoutError.value
  }
  return null
})
</script>
