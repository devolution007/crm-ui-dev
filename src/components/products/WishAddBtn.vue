<template>
  <q-btn
    :size="componentProps.size"
    flat
    :dense="componentProps.dense"
    round
    icon="sym_o_heart_plus"
    :loading="addLoading"
    @click="addToWishlist(componentProps.sku)"
  />
</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { useWishlistStore } from 'stores/wishlist-store-multi'

const componentProps = withDefaults(defineProps<{
  customerId: number
  sku: string,
  size?: string,
  dense?: boolean
}>(), {
  size: 'md',
  dense: true
})

const addLoading = ref(false)

const wlStore = computed(() => useWishlistStore(componentProps.customerId))

const addToWishlist = (sku: string) => {
  addLoading.value = true
  wlStore.value.addSkuToWishlist(sku)
    .finally(() => {
      addLoading.value = false
    })
}
</script>

<style scoped>

</style>
