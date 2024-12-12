<template>
  <q-input
    v-model="todo"
    type="textarea"
    :label="$t('shortDescription')"
    :placeholder="$t('beBrief')"
    :error-message="errorMessages"
    :error="!!errorMessages"
    outlined
    autofocus
    counter
    maxlength="160"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue'

const props = defineProps<{
  errorMessages?: string,
  modelValue?: string
}>()

const todo = ref<string|undefined>(undefined)
const emit = defineEmits(['update:modelValue'])

onMounted(async () => {
  todo.value = props.modelValue
})
</script>
