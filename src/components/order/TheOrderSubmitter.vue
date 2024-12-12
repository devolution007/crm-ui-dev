<template>
  <q-card
    square
    class="border-top-left-radius "
  >
    <q-card-section>
      <div class="flex q-gutter-lg">
        <div>
          <div>Remaining balance</div>

          <div
            class="text-weight-bold text-h6"
            :class="{ 'text-red': uniBalancePredictedAfterCheckout < 0 }"
          >
            {{ $helper.formatPrice(uniBalancePredictedAfterCheckout) }}
          </div>
        </div>
        <div v-if="false">
          <div>Card Security code</div>
          <div class="text-weight-bold text-h6">
            <q-input
              v-model="cardSecCode"
              :loading="oStore.checkoutLoading"
              dense
              :maxlength="5"
              :minlength="0"
              type="password"
              hide-bottom-space
              data-1p-ignore
              placeholder="****"
            />
          </div>
        </div>
        <div>
          <div>Total</div>

          <div
            class="text-weight-bold text-h6"
          >
            {{ $helper.formatPrice(oStore.order?.price) }}
          </div>
        </div>
        <div class="flex items-center q-pl-lg">
          <q-btn
            label="Checkout"
            color="primary"
            :loading="oStore.checkoutLoading || oStore.payLoading"
            :disabled="disabled"
            @click="checkout"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { PaymentProcessorCode } from 'src/types'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
    required: false,
    default: null
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['checkout:start', 'checkout:success', 'checkout:error', 'checkout:end'])

import { computed, ref } from 'vue'
import { useCustomerStore } from 'stores/customer-store'
import { useOrderStore } from 'stores/order-store'
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'
const customerStore = useCustomerStore()

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)

const uniBalancePredictedAfterCheckout = computed(() => {
  return customerStore.unifiedBalance - parseFloat(oStore.order?.price as string) || 0
})

const cardSecCode = ref('')

const checkout = async () => {
  emit('checkout:start')
  try {
    await oStore.checkout()
      .finally()
    emit('checkout:success')
  } catch (e: unknown | AxiosError) {
    if (axios.isAxiosError(e)) {
      let message = 'Unknown error'
      const serverErrors = helper.getFirstErrors(e.response?.data || {}) as { [key: string]: string }
      if (serverErrors.general) {
        message = serverErrors.general
      } else if (Object.values(serverErrors).length > 0) {
        message = Object.values(serverErrors)[0]
      }
      emit('checkout:error', message)
    } else {
      emit('checkout:error', 'Something went wrong.')
    }
  }
  emit('checkout:end')
}
</script>

<style scoped>

</style>
