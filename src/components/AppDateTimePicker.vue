<template>
  <q-input
    :model-value="modelValue"
    outlined
    :error-message="errorMessage"
    :error="!!errorMessage"
    :label="label"
    mask="####-##-## ##:##"
    hint="YYYY-MM-DD HH:mm"
    :rules="[v => !(v && isNaN(Date.parse(v))) || 'Date is not correct']"
    @change="mutatedModelValue=$event"
    @clear="mutatedModelValue=null"
  >
    <template #prepend>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="mutatedModelValue"
            mask="YYYY-MM-DD HH:mm"
            today-btn
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                :label="$t('close')"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template #append>
      <q-icon
        name="access_time"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-time
            v-model="mutatedModelValue"
            mask="YYYY-MM-DD HH:mm"
            format24h
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                :label="$t('close')"
              />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{
  modelValue?: string|null
  errorMessage?: string
  label: string
}>()
const mutatedModelValue = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, value => {
  mutatedModelValue.value = value
})
watch(() => mutatedModelValue.value, value => {
  emit('update:modelValue', value)
})
</script>
