<template>
  <q-btn
    :icon="props.icon"
    size="md"
    :label="props.label"
  >
    <q-menu auto-close>
      <q-list style="min-width: 100px">
        <q-item
          v-for="(phone) in customer?.phones"
          :key="`phone-choose-entry-${customerId}-${phone.id}`"
          clickable
          @click="$emit('input', phone.phone)"
        >
          <q-item-section>{{ phone.formattedPhone }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  customerId: number
  label?: string | null
  icon?: string
}>(), {
  label: null,
  icon: 'keyboard_return'
})

defineEmits(['input'])

const customerStore = useCustomerStore()
const customer = customerStore.getCustomerLazy(
  computed(() => props.customerId)
)
</script>

<style scoped>

</style>
