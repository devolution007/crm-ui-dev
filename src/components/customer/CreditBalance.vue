<template>
  <q-item dense>
    <q-item-section class="section-label">
      <q-item-label caption>
        Balance
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="props.loading"
          type="text"
        />
        <span v-else>
          $ {{ customer.balance }}
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
