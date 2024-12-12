<template>
  <q-page>
    <!-- content -->
    <customer-history-show
      :customer-id="props.customerId"
    />
  </q-page>
</template>
<script setup lang="ts">
const props = defineProps<{
  customerId: number
}>()
</script>
