<template>
  <q-page>
    <!-- content -->
    <bricks-top-back-button
      :label="$t('backToCustomerOrders')"
      :to="{ name: 'customer-details' }"
    />
    <OrderDetails
      :order-id="props.orderId"
    />
  </q-page>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Dialog, useMeta } from 'quasar'
import { computed } from 'vue'
import { useOrderStore } from 'stores/order-store'

const route = useRoute()
useMeta({
  title: `Order #${route.params.orderId}`
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
  showConfirmationDialog: {
    type: Boolean,
    required: false,
    default: false
  }
})
const router = useRouter()

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.init(props.orderId).then(() => {
  if (props.showConfirmationDialog && oStore.order?.isCreated) {
    Dialog.create({
      title: 'Your order has been received',
      message: `<p>Your order # is: ${oStore.orderId}</p>` +
        'You will receive an order confirmation with details of your order and a link to track its progress.',
      html: true
    })
      .onOk(() => {
        router.push({
          name: 'customer-order-details',
          params: {
            customerId: props.customerId,
            orderId: oStore.orderId
          }
        })
      })
  }
})

</script>
