<template>
  <q-list>
    <q-item
      v-for="(email, key) in customer.emails"
      :key="`email_${customer.id}_${email.id}`"
      dense
    >
      <q-item-section side>
        {{ key + 1 }}.
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ email.value }}
        </q-item-label>
      </q-item-section>
      <q-item-section
        v-if="email.reg"
        side
      >
        <q-item-label
          caption
        >
          Reg.
        </q-item-label>
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
