<template>
  <div v-if="normalizedValue">
    <div class="text-caption text-toner">
      {{ props.label }}
    </div>
    <div class="">
      {{ normalizedValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string | string[]
}>()

const normalizedValue = computed(() => {
  if (Array.isArray(props.value)) {
    return props.value.join(', ')
  }
  return props.value
})
</script>

<style scoped>

</style>
