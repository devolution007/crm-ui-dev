<template>
  <div
    class="flex justify-between items-center"
    :class="{ 'q-mb-md': props.padding }"
  >
    <div class="q-table__title">
      <slot />
    </div>
    <slot name="actions" />
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{
  padding?: boolean
}>(), {
  padding: true
})
</script>
