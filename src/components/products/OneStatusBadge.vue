<template>
  <q-badge
    v-if="product.discontinued"
    color="red"
    label="Discontinued"
    outline
  />
  <q-badge
    v-else-if="product.inStockAmount === 0 || ! product.orderable"
    color="info"
    label="Out of stock"
    outline
  />
  <template v-else>
    <slot name="status-ok" />
  </template>
</template>

<script setup lang="ts">
import { ProductInterface } from 'src/models/ProductModel'

defineProps<{
  product: ProductInterface
}>()
</script>

<style scoped>

</style>
