<template>
  <q-item dense>
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('insuranceCompany') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="loading"
          type="text"
        />
        <span v-else>
          {{ props.customer.insuranceCompany?.name }}
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import CustomerModel from 'src/models/CustomerModel'

const props = withDefaults(defineProps<{
  customer: CustomerModel
  loading: boolean
}>(), {
  loading: false
})
</script>
