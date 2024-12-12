<template>
  <div class="row">
    <q-input
      dense
      :model-value="internalValue"
      type="text"
      outlined
      readonly
      square
      style="max-width: 110px;min-width: 100px"
    >
      <template #before>
        <q-btn
          dense
          icon="remove"
          color="secondary"
          text-color="primary"
          size="md"
          class="self-stretch"
          :disable="internalValue <= 1"
          :loading="internalValue < props.modelValue"
          @click="decrement"
        />
      </template>
      <template #after>
        <q-btn
          dense
          icon="add"
          color="secondary"
          text-color="primary"
          size="md"
          class="self-stretch"
          :disable="(props.max !== null) && (internalValue >= props.max)"
          :loading="props.enableLoading && internalValue > props.modelValue"
          @click="increment"
        />
      </template>
    </q-input>
    <slot
      name="after"
      :value="internalValue"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: false,
    default: null
  },
  enableLoading: {
    type: Boolean,
    required: false,
    default: false
  }
})

const internalValue = ref(0)

const emit = defineEmits(['update:modelValue'])

const increment = () => {
  internalValue.value++
  emit('update:modelValue', internalValue.value)
}

const decrement = () => {
  internalValue.value--
  emit('update:modelValue', internalValue.value)
}

watch(() => props.modelValue, (value) => {
  internalValue.value = value
})
onMounted(() => {
  internalValue.value = props.modelValue
})

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style scoped lang="scss">
.q-field--outlined.q-field--readonly :deep(.q-field__control:before) {
  border-style: solid;
  border-color: $secondary;
}
.q-field :deep(.q-field__native) {
  text-align: center;
}
.q-field :deep(.q-field__before) {
  padding: 0;
}
.q-field :deep(.q-field__after) {
  padding: 0;
}
.q-field :deep(.q-field__before .q-btn) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.q-field :deep(.q-field__after .q-btn) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
