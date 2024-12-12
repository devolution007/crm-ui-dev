<template>
  <q-btn
    v-if="props.element === 'btn'"
    :loading="searchDraft"
    :round="props.round"
    :label="props.label"
    :icon="icon"
    :disable="props.disabled"
    :class="props.class"
    @click="placeOrder"
  >
    <slot name="default" />
  </q-btn>
  <q-item
    v-if="props.element === 'item'"
    clickable
    :disable="searchDraft || props.disabled"
    :class="props.class"
    @click="placeOrder"
  >
    <slot name="default" />
    <q-item-section>
      {{ props.label }}
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from 'stores/cart-store'
import { OrderType } from 'src/types'
import { useOrderStore } from 'stores/order-store'

const props = withDefaults(defineProps<{
  customerId: number,
  type: OrderType,
  element?: string,
  label?: string,
  round?: boolean,
  icon?: string,
  disabled?: boolean,
  class?: string
}>(), {
  round: false,
  icon: '',
  label: 'Make new order',
  element: 'btn',
  disabled: false,
  class: ''
})

const router = useRouter()
const cartStore = useCartStore()

const searchDraft = ref(false)
const placeOrder = async () => {
  cartStore.init(props.customerId)

  searchDraft.value = true

  try {
    const draftOrder = await cartStore.findDraftOrder(props.type)

    let orderId = null
    if (draftOrder) {
      orderId = draftOrder.id
      const oStore = useOrderStore()
      await oStore.init(orderId)
    }

    await router.push({
      name: 'place-order',
      params: { orderId, customerId: props.customerId },
      query: { type: props.type }
    })
  } catch (e) {
    console.log(e)
  } finally {
    searchDraft.value = false
  }
}

const getIconByType = (type: OrderType) => {
  switch (type) {
    case 'fax':
      return 'sym_o_fax'
    default:
      return 'sym_o_add_shopping_cart'
  }
}
const icon = computed(() => {
  return props.icon || getIconByType(props.type)
})
</script>

<style scoped>

</style>
