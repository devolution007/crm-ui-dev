<template>
  <div
    v-if="full"
    class="q-mb-sm"
  >
    {{ entry.firstName }} {{ entry.lastName }}
  </div>
  <div
    v-if="full && entry.type === 'facility'"
    class="q-mb-sm"
  >
    Company: {{ entry.company }}
  </div>
  <div
    v-if="full"
    class="q-mb-sm"
  >
    {{ entry.phone }}
  </div>
  <div class="q-mb-sm">
    {{ props.entry.addressString }}
  </div>
  <div
    v-if="props.entry.addressOptionalString"
    class="q-mb-sm"
  >
    {{ props.entry.addressOptionalString }}
  </div>
  <div>
    {{ props.entry.city }}
    <span v-if="props.entry.county">({{ props.entry.county }})</span>
    {{ props.entry.state }} {{ props.entry.zipCode }}
  </div>
</template>

<script setup lang="ts">
import AddressModel from 'src/models/AddressModel'

const props = withDefaults(defineProps<{
  entry: AddressModel,
  full?: boolean
}>(), {
  full: false
})
</script>
