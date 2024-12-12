<template>
  <q-page padding>
    <!-- content -->
    <bricks-top-back-button
      :label="$t('refunds')"
      :to="{ name: 'refunds-list' }"
    />
    <refund-details
      v-if="props.refundId"
      :refund-id="props.refundId"
      @on-deleted="() => $router.push({ name: 'refunds-list' })"
    />
  </q-page>
</template>

<script setup lang="ts">
const props = defineProps<{
  refundId: number
}>()
</script>
