<template>
  <div class="row justify-center q-mt-md">
    <q-pagination
      :model-value="props.modelValue"
      :max="props.totalPages"
      max-pages="10"
      color="secondary"
      active-text-color="primary"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <div class="q-ml-md">
      {{ $t('results') }}
      <q-spinner
        v-if="props.loading"
        size="12"
        class="q-mb-sm"
        color="green"
      />
      <q-badge
        v-if="helper.filterApplied && props.totalItemCount && !props.loading"
        align="top"
        color="green"
      >
        {{ props.totalItemCount }}
      </q-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { helper } from 'boot/helper'
const props = defineProps<{
  modelValue: number
  loading: boolean,
  totalPages: number,
  totalItemCount: number
}>()

defineEmits(['update:modelValue'])
</script>
