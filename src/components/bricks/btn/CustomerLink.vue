<script setup lang="ts">
import { CustomerBasicInterface } from 'src/models/CustomerModel'

const props = defineProps<{
  customer: CustomerBasicInterface | {
    id: number
    name: string
    insuranceId: string
  } | undefined
  showName?: boolean
}>()
</script>

<template>
  <q-btn
    v-if="props.customer"
    dense
    no-caps
    unelevated
    :to="{ name: 'customer-details', params: { customerId: props.customer.id } }"
  >
    <div>
      <q-icon
        name="sym_o_badge"
        size="sm"
        class="q-mr-sm"
      />
      <span v-if="props.customer.insuranceId && !props.showName">{{ props.customer.insuranceId }}</span>
      <span v-else>{{ props.customer.name }}</span>
    </div>
    <q-tooltip
      :delay="300"
      class="text-body2"
    >
      {{ $t('viewProfile') }}
    </q-tooltip>
  </q-btn>
</template>

<style scoped>

</style>
