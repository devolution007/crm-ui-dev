<script setup lang="ts">
import { OrderInterface } from 'src/models/OrderModel'
import { computed } from 'vue'
import { constants } from 'boot/constants'
import { useCall } from 'stores/call'
import { useCustomerStore } from 'stores/customer-store'

const props = defineProps<{
  order: OrderInterface,
  component: 'QBtn' | 'QItem',
}>()

const callStore = useCall()
const customerStore = useCustomerStore()

const compiledTo = computed(() => ({
  name: 'place-order',
  params: { orderId: props.order.id },
  query: { type: (props.order.type === constants.ORDER_TYPE_FAX) ? constants.ORDER_TYPE_FAX : (callStore.call?.type === 'inbound' ? 'cc_in' : 'cc_out'), repeat: 1 }
}))

const canBeRepeated = computed(() => {
  if (props.order.type === constants.ORDER_TYPE_FAX) {
    return customerStore.hasFeature('faxOrders')
  }

  return callStore.isCallActive && callStore.call?.customer?.id === props.order?.customer?.id
})

const isFax = computed(() => props.order.type === constants.ORDER_TYPE_FAX)
</script>

<template>
  <q-item
    v-if="props.component === 'QItem'"
    clickable
    :disable="! canBeRepeated"
    :to="compiledTo"
  >
    <q-item-section>
      Repeat order
    </q-item-section>
    <q-item-section
      v-if="!isFax && !callStore.isCallActive"
      side
    >
      (no active call)
    </q-item-section>
    <q-item-section
      v-if="!isFax && callStore.isCallActive && callStore.call?.customer?.id !== props.order?.customer?.id"
      side
    >
      (⚠️ wrong call)
    </q-item-section>
  </q-item>
  <q-btn
    v-if="props.component === 'QBtn'"
    :label="$t('repeat')"
    size="md"
    :disable="! canBeRepeated"
    :to="compiledTo"
  />
</template>

<style scoped>

</style>
