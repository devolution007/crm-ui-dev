<template>
  <q-dialog v-model="innerValue">
    <q-card :style="innerCardStyles">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ title }}
        </div>
        <q-space />
        <q-btn
          v-if="closeButton"
          v-close-popup
          icon="sym_o_close"
          flat
          round
          dense
        />
      </q-card-section>

      <q-card-section>
        <slot />
      </q-card-section>
      <q-card-section
        v-if="showActions"
        class="q-pa-md row justify-between"
      >
        <slot name="actions">
          <q-btn
            v-close-popup
            flat
            :label="$t('cancel')"
          />

          <slot name="primary-action" />
        </slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  minWidth: {
    type: String,
    required: false,
    default: null
  },
  maxWidth: {
    type: String,
    required: false,
    default: null
  },
  closeButton: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emits = defineEmits(['update:modelValue'])

const innerValue = <Ref<boolean>> ref(props.modelValue)

watch(() => props.modelValue, (value) => {
  innerValue.value = value
})

watch(() => innerValue.value, (value) => {
  emits('update:modelValue', value)
})

const innerCardStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.minWidth) {
    styles['min-width'] = (/^-?\d+$/.test(props.minWidth)) ? `${props.minWidth}px` : props.minWidth
  }
  if (props.maxWidth) {
    styles['max-width'] = (/^-?\d+$/.test(props.maxWidth)) ? `${props.maxWidth}px` : props.maxWidth
  }
  return styles
})
</script>
