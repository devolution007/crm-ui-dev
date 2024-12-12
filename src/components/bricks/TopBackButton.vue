<template>
  <q-btn
    flat
    unelevated
    icon="chevron_left"
    class="text-no-wrap q-mb-sm"
    color="primary"
    :to="props.to"
    :label="props.label"
    size="md"
    padding="0"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  to: {
    type: Object,
    required: false,
    default: null
  },
  label: {
    type: String,
    required: false,
    default: 'Return'
  }
})
</script>

<style scoped>

</style>
