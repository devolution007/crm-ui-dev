<script setup lang="ts">
/**
 * @deprecated in preference of src/components/bricks/DetailsListLine.vue
 */
import { defineProps } from 'vue'

interface Props {
  label: string
  value?: string
  showData?: boolean
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showData: true,
  editable: false,
  value: undefined
})

defineEmits(['editAttempt'])
</script>
<template>
  <q-item
    class="q-px-none"
    :clickable="editable"
    @click="$emit('editAttempt')"
  >
    <q-item-section>
      <q-item-label
        caption
      >
        {{ props.label }}
        <q-icon
          v-if="editable"
          name="edit"
        />
      </q-item-label>
      <q-item-label v-if="props.showData">
        <span v-if="!! value">{{ props.value }}</span>
        <slot name="default" />
      </q-item-label>
      <q-item-label v-else>
        <q-skeleton
          type="QChip"
          height="22px"
        />
      </q-item-label>
    </q-item-section>
    <slot name="item-section" />
  </q-item>
</template>
