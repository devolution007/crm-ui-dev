<template>
  <q-list v-if="! customerStore.isFetching">
    <q-item
      v-for="(entry) in activeAddresses"
      :key="`address_${customer.id}_${entry.id}`"
    >
      <q-item-section
        side
        top
      >
        <span
          v-if="entry.type === 'customer'"
        >
          <q-icon
            name="sym_o_person"
          />
          <q-tooltip class="text-body2">Customer's address</q-tooltip>
        </span>
        <span
          v-if="entry.type === 'facility'"
        >
          <q-icon
            name="sym_o_monitor_heart"
          />
          <q-tooltip class="text-body2">Address from Facility</q-tooltip>
        </span>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <address-output
            :entry="entry"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed } from 'vue'
import AddressModel from 'src/models/AddressModel'

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const activeAddresses = computed(() => {
  return customer.value.addresses.filter((address: AddressModel) => address.valid && !address.deleted)
})

</script>
