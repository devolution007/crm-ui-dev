<template>
  <q-card-section>
    <div class="text-h6">
      Payment Information
    </div>

    <div class="text-body2">
      Payment Method
    </div>
    <div
      v-if="!!serverErrors.code"
      class="text-negative text-caption"
    >
      {{ serverErrors.code }}
    </div>
    <q-option-group
      :model-value="paymentProcessor"
      :options="cStore.paymentProcessorsAvailableOptions"
      type="radio"
      @update:model-value="$emit('update:processor', $event)"
    />

    <div
      v-if="paymentProcessor === 'trnsx'"
      class="q-pt-sm"
    >
      <div
        style="max-width: 300px"
        class="q-mb-md"
      >
        <q-input
          :model-value="virtualTempCardNumber"
          :loading="oStore.checkoutLoading"
          standout
          :maxlength="19"
          :minlength="16"
          type="text"
          hide-bottom-space
          data-1p-ignore
          label-slot
          :error="!! serverErrors.input?.card"
          :error-message="serverErrors.input?.card"
          @change="setVirtualTempCardNumber"
        >
          <template #label>
            <span>Card Number <strong class="text-red">*</strong></span>
          </template>
        </q-input>
      </div>
      <div style="max-width: 250px">
        <q-input
          :label="$t('balanceInfo')"
          standout
          dense
          hint="Fill to see the calculated remaining balance"
          :model-value="virtualTempBalance"
          @change="setVirtualTempBalance"
        />
      </div>
    </div>

    <div
      v-if="paymentProcessor === 'nationsbenefits'"
      class="q-pt-sm"
    >
      <div
        style="max-width: 300px"
        class="q-mb-md"
      >
        <q-input
          :model-value="virtualTempCardNumber"
          :loading="oStore.checkoutLoading"
          standout
          :maxlength="19"
          :minlength="16"
          type="text"
          hide-bottom-space
          data-1p-ignore
          label-slot
          :error="!! serverErrors.input?.card"
          :error-message="serverErrors.input?.card"
          @change="setVirtualTempCardNumber"
        >
          <template #label>
            <span>Card Number <strong class="text-red">*</strong></span>
          </template>
        </q-input>
      </div>
      <div style="max-width: 250px">
        <q-input
          :label="$t('balanceInfo')"
          standout
          dense
          hint="Fill to see the calculated remaining balance"
          :model-value="virtualTempBalance"
          @change="setVirtualTempBalance"
        />
      </div>
    </div>

    <div
      v-if="paymentProcessor === 'prohealth'"
      class="q-pt-sm"
    >
      <div
        v-if="cardsStore.activeCard"
        class="q-mb-md"
      >
        <div>{{ cardsStore.activeCard.maskedNumber }}</div>
        <div>{{ $helper.formatPrice(cardsStore.activeCard.balance) }}</div>
      </div>
      <q-banner
        v-else
        class="bg-negative"
      >
        The customer has no active insurance card. Please add one to continue.
      </q-banner>
      <div style="max-width: 200px">
        <q-input
          v-model="cardSecCode"
          :loading="oStore.checkoutLoading"
          standout
          :maxlength="5"
          :minlength="0"
          type="password"
          data-1p-ignore
          autocorrect="off"
          spellcheck="false"
          autocomplete="off"
          readonly
          onfocus="this.removeAttribute('readonly');"
          placeholder="****"
          label-slot
        >
          <template #label>
            <span>Card Security code <strong class="text-red">*</strong></span>
          </template>
        </q-input>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
import { ErrorContainer } from 'src/types/classes'
import { useOrderStore } from 'stores/order-store'
import { computed, Ref, ref } from 'vue'
import { PaymentMethodInputInterface, PaymentProcessorCode } from 'src/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import { useInsuranceCardsStore } from 'stores/insurance-cards-store'
import { useCustomerStore } from 'stores/customer-store'
import { ProductInterface } from 'src/models/ProductModel'
import { useI18n } from 'vue-i18n'
import useVirtualTempCard from 'src/composables/useVirtualTempCard'
import useServerErrors2 from 'src/composables/useServerErrors2'
const { t } = useI18n()

const {
  serverErrors,
  catchValidationErrors,
  resetServerErrors
} = useServerErrors2({
  code: '',
  input: {
    card: '',
    cvv: ''
  }
})

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  },
  paymentProcessor: {
    type: String as () => PaymentProcessorCode,
    required: false,
    default: null
  }
})

const emit = defineEmits(['pay:start', 'pay:error', 'pay:rejected-skus', 'success', 'update:processor'])

const {
  setVirtualTempBalance,
  virtualTempBalance,
  setVirtualTempCardNumber,
  virtualTempCardNumber
} = useVirtualTempCard(props.customerId)

const oStore = useOrderStore()
const cStore = useCustomerStore()
cStore.init(props.customerId)
  .then(() => {
    if (cStore.paymentProcessorsAvailableCodes.length === 0) {
      return
    }
    emit('update:processor', cStore.paymentProcessorsAvailableCodes[0])
  })

const cardSecCode = ref('')
const cardsStore = useInsuranceCardsStore()

const paymentAttempt = async () => {
  emit('pay:start')
  resetServerErrors()
  if (!props.paymentProcessor) {
    return
  }

  const input: PaymentMethodInputInterface = {}

  if (props.paymentProcessor === 'prohealth') {
    input.cvv = cardSecCode.value
    if (cardSecCode.value === '    ') {
      // Allow to skip card security code
      input.cvv = ''
    }
  }

  if (props.paymentProcessor === 'trnsx') {
    input.card = virtualTempCardNumber.value
  }
  if (props.paymentProcessor === 'nationsbenefits') {
    input.card = virtualTempCardNumber.value
  }

  try {
    await oStore.pay({
      code: props.paymentProcessor,
      input
    })

    if (props.paymentProcessor === 'trnsx') {
      setVirtualTempBalance(Math.round((virtualTempBalance.value - Number(oStore.order?.price) || 0) * 100) / 100)
    }
    if (props.paymentProcessor === 'nationsbenefits') {
      setVirtualTempBalance(Math.round((virtualTempBalance.value - Number(oStore.order?.price) || 0) * 100) / 100)
    }

    emit('success')
  } catch (e: unknown | AxiosError) {

    catchValidationErrors(e)

    if (axios.isAxiosError(e)) {
      let message = 'Unknown error'
      const serverErrors = helper.getFirstErrors(e.response?.data || {}) as { [key: string]: string }
      if (serverErrors.general) {
        message = serverErrors.general
      } else if (Object.values(serverErrors).length > 0) {
        message = Object.values(serverErrors)[0]
      }
      if (e.response && e.response.data && e.response.status === 422) {
        message = 'Validation error. Please check the form'
        if (serverErrors.general) {
          message = serverErrors.general
        }
        if (e.response.data.rejectedSkus) {
          emit('pay:rejected-skus', e.response.data.rejectedSkus.map((sku: ProductInterface) => {
            return {
              sku: sku.sku,
              id: sku.id,
              name: sku.name
            }
          }))
        }
      }

      if (message.startsWith('errors.')) {
        message = t(message)
      }
      emit('pay:error', message)
    } else {
      emit('pay:error', 'Something went wrong.')
    }
  }
}

const paymentFormValidationError = computed(() => {
  if (props.paymentProcessor === 'prohealth') {
    if (cardSecCode.value.length < 3) {
      return 'Card security code is required'
    }
  }
  return null
})

defineExpose({
  paymentAttempt,
  paymentFormValidationError
})
</script>

<style scoped>

</style>
