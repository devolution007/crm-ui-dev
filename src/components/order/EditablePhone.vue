<template>
  <q-popup-edit
    v-if="oStore.isOrderReady"
    v-slot="scope"
    :model-value="oStore.order?.phone"
    buttons
    persistent
    :cover="false"
    label-set="Save"
    @save="save"
  >
    <q-list>
      <q-item
        v-for="phone in customer.phones"
        :key="`order${orderId}_phone_variant_${phone.phone}`"
        v-ripple
        dense
        tag="label"
      >
        <q-item-section avatar>
          <q-radio
            v-model="scope.value"
            :val="phone.phone"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ phone.formattedPhone }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-popup-edit>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios'
import { Notify } from 'quasar'
import { useCustomerStore } from 'stores/customer-store'
import { computed } from 'vue'
import { useOrderStore } from 'stores/order-store'

const props = defineProps<{
  orderId: number
}>()

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const save = async (value: string) => {
  try {
    await oStore.updateFields({
      phone: value
    })
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    if (axiosError.response && axiosError.response.data && axiosError.response.status === 422) {
      Notify.create('Validation error')
    }
  }
}
</script>
