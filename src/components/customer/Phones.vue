<template>
  <q-list v-if="! customerStore.isFetching">
    <q-item
      v-for="(entry, key) in customer.phones"
      :key="`phone_${customer.id}_${entry.id}`"
      dense
    >
      <q-item-section
        side
        top
      >
        {{ key + 1 }}.
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ entry.formattedPhone }}
        </q-item-label>
        <q-item-label caption>
          {{ entry.type }}
        </q-item-label>
      </q-item-section>
      <q-item-section
        side
        top
      >
        <div class="row q-gutter-sm">
          <span v-if="entry.isValid">
            <q-icon
              name="sym_o_check"
            />
            <q-tooltip class="text-body2">Phone valid</q-tooltip>
          </span>
          <span v-if="entry.isAvailableCalls">
            <q-icon
              name="sym_o_phone_enabled"
            />
            <q-tooltip class="text-body2">Calls available</q-tooltip>
          </span>
          <span v-if="entry.isAvailableSms">
            <q-icon
              name="sym_o_sms"
            />
            <q-tooltip class="text-body2">Sms available</q-tooltip>
          </span>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed } from 'vue'

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

</script>
