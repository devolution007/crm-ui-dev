<template>
  <q-card
    :class="classes"
    :color="color"
    flat
    bordered
  >
    <slot />
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})
const isNewType = computed(() => props.type === 'new')
const classes = computed(() => ({
  'q-pa-sm': true,
  'text-strike': !isNewType.value
}))
const color = computed(() => isNewType.value ? '#c9e0ed' : '#e0e0e0')

</script>

<style scoped>

</style>
