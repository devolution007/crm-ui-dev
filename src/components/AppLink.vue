<template>
  <a
    v-if="!!props.targetBlank"
    :href="props.link"
    :title="props.title"
    target="_blank"
  >
    {{ props.label }}
  </a>
  <router-link
    v-else
    :to="props.link"
    :title="props.title"
  >
    {{ props.label }}
  </router-link>
</template>
<script setup lang="ts">
/**
 * TODO: Do review this component usage. It's not clear why we need to use
 */
const props = defineProps<{
  label: string|null|number,
  title?: string|null|number,
  link: string,
  targetBlank?: boolean
}>()
</script>
<style scoped>
a{
  color: #2979ff
}
</style>
