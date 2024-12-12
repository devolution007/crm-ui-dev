<script setup lang="ts">
import { PaymentDetailsTRNSXInterface } from 'src/models/Payments'
import { useAuthStore } from 'stores/auth-store'
const authStore = useAuthStore()

const props = defineProps<{
  details: PaymentDetailsTRNSXInterface
}>()
</script>

<template>
  <order-details-line
    :label="$t('receiptNumber')"
    :show-data="true"
    :value="props.details.result?.receiptNumber || 'N/A'"
  />
  <order-details-line
    v-if="authStore.hasAccessFeature('approve_payment')"
    :label="$t('cardNumber')"
    :show-data="true"
    :value="props.details.input?.card || 'N/A'"
  />
</template>

<style scoped>

</style>
