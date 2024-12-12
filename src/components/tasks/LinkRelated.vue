<template>
  <div class="relative-position">
    <div class="flex justify-end absolute-bottom-right shown-on-hover-distinct">
      <q-btn
        size="sm"
        color="secondary"
        text-color="primary"
        :label="props.label"
        no-caps
        square
        icon-right="launch"
        target="_blank"
        :to="to"
        @click="$emit('click')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  to?: string|object|null
}>(), {
  to: null
})

defineEmits(['click'])
</script>
