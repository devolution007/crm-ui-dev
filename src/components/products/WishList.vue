<template>
  <q-table
    :loading="wlStore.isLoading"
    :rows="rows"
    separator="horizontal"
    :hide-header="true"
  >
    <template #body="props">
      <products-list-row
        :props="props"
        :customer-id="componentProps.customerId"
        @toggle-expand="props.expand = $event"
      >
        <template #top-right="item">
          <products-wish-remove-btn
            :sku="item.row.sku"
            :customer-id="componentProps.customerId"
          />
        </template>
      </products-list-row>
      <products-details-list-tr
        v-show="props.expand"
        :props="props"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { useWishlistStore } from 'stores/wishlist-store-multi'

const componentProps = defineProps<{
  customerId: number
}>()

const wlStore = computed(() => useWishlistStore(componentProps.customerId))

const rows = computed(() => {
  return wlStore.value.items.map((item) => {
    return item.product
  })
})

</script>

<style scoped>

</style>
