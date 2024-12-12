<template>
  <q-page padding />
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import { useOrderStore } from 'stores/order-store'

const router = useRouter()

const { fetchOrder } = useOrderStore()

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  }
})

const fetchInfoAndNavigate = async (orderId: number) => {
  const order = await fetchOrder(orderId)
    .catch(() => {
      Notify.create({
        message: 'Order not found',
        type: 'negative'
      })
    })
  if (order) {
    await router.push({
      name: 'customer-order-details',
      params: {
        customerId: order.customer?.id,
        orderId: order.id
      }
    })
  }
}

onMounted(() => {
  fetchInfoAndNavigate(props.orderId)
})

watch(() => props.orderId, (orderId) => {
  fetchInfoAndNavigate(orderId)
})
</script>
