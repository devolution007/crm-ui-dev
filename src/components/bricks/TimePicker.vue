<template>
  <q-input
    ref="input"
    :model-value="valueLocal"
    :dense="props.dense"
    mask="##:##"
    clearable
    :error="props.error"
    :error-message="props.errorMessage"
    @clear="updated('')"
    @update:model-value="updated($event)"
  >
    <template #prepend>
      <q-icon
        name="schedule"
        class="cursor-pointer"
      >
        <q-popup-proxy
          ref="popup"
          :target="$refs.input"
          :cover="props.cover"
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-time
              :model-value="valueLocal"
              minimal
              mask="HH:mm"
              format24h
              @update:model-value="updated($event)"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  :label="$t('close')"
                  color="primary"
                  flat
                />
              </div>
            </q-time>
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref, watch } from 'vue'
import { QInput, QPopupProxy } from 'quasar'

const popup: Ref<QPopupProxy | null> = ref(null)
const input: Ref<QInput | null> = ref(null)
const valueLocal = ref('')

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  dense: {
    type: Boolean,
    default: false
  },
  cover: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'updated'])
watch(() => props.modelValue, (value) => {
  valueLocal.value = value
})

onMounted(() => {
  valueLocal.value = props.modelValue
})

const updated = (value: string) => {
  emit('update:modelValue', value)
  emit('updated', value)
}
</script>
