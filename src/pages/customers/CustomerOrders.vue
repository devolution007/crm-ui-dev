<template>
  <q-page>
    <!-- content -->
    <customer-orders-table
      :customer-id="props.customerId"
    />
  </q-page>
</template>
<script setup lang="ts">
const props = defineProps<{
  customerId: number
}>()

</script>
