<template>
  <q-input
    ref="input"
    unmasked-value
    :rules="reactiveRules"
    mask="+#(###)###-####"
    aria-autocomplete="none"
    :label="$t('phone')"
    placeholder="1(555)555-5555"
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import { QInput } from 'quasar'

const input: Ref<QInput | null> = ref(null)

const props = withDefaults(defineProps<{
  required?: boolean
  modelValue?: string | null
}>(), {
  required: false,
  modelValue: ''
})

defineEmits(['update:modelValue'])

const reactiveRules = computed(() => {
  if (!props.required && !input.value?.modelValue) {
    return []
  }

  const rules: ((v: string) => true | string)[] = [
    (v: string) => v.substring(0, 1) === '1' || 'The country code must be +1',
    (v: string) => /^\d{11}$/.test(v) || 'Phone must be valid'
  ]

  if (props.required) {
    rules.unshift((v: string) => !!v || 'The field is required')
  }

  return rules
})

</script>
