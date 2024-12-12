<template>
  <q-item dense>
    <q-item-section class="section-label">
      <q-item-label caption>
        Insurance company
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="loading"
          type="text"
        />
        <span v-else>
          {{ props.customer.phcOrganization?.name }}
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item dense>
    <q-item-section class="section-label">
      <q-item-label caption>
        Benefit name
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="loading"
          type="text"
        />
        <span v-else>
          {{ props.customer.phcPlan }}
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
