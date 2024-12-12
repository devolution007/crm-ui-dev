<template>
  <q-btn
    :size="componentProps.size"
    flat
    :dense="componentProps.dense"
    round
    icon="sym_o_heart_minus"
    color="negative"
    :loading="deleteLoading"
    @click="removeItemDialog(componentProps.sku)"
  />
</template>

<script setup lang="ts">

import { Dialog } from 'quasar'
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

const deleteLoading = ref(false)

const wlStore = computed(() => useWishlistStore(componentProps.customerId))

const removeItemDialog = (sku: string) => {
  Dialog.create({
    title: 'Please confirm',
    message: 'Are you sure you want to delete this item from the customer\'s wishlist?',
    cancel: true
  }).onOk(async () => {
    deleteLoading.value = true
    await wlStore.value.removeSkuFromWishlist(sku)
      .finally(() => {
        deleteLoading.value = false
      })
  })
}

</script>

<style scoped>

</style>
