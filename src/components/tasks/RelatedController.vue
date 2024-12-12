<template>
  <q-btn-dropdown
    :label="$t('add')"
    size="md"
    flat
    padding="xs"
  >
    <q-list>
      <q-item
        v-close-popup
        :disable="!!props.task?.customer || props.modelValue.customer"
        clickable
        @click="updateValue('customer', true)"
      >
        <q-item-section>
          <q-item-label>{{ $t('customer') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-close-popup
        :disable="!!props.task?.facility || props.modelValue.facility"
        clickable
        @click="updateValue('facility', true)"
      >
        <q-item-section>
          <q-item-label>{{ $t('facility') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-close-popup
        :disable="!!props.task?.order || props.modelValue.order"
        clickable
        @click="updateValue('order', true)"
      >
        <q-item-section>
          <q-item-label>{{ $t('order') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-close-popup
        :disable="!!props.task?.issue || props.modelValue.issue"
        clickable
        @click="updateValue('issue', true)"
      >
        <q-item-section>
          <q-item-label>{{ $t('issue') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { CustomTaskFormModel } from 'src/models/TaskModel'
import { ref, Ref } from 'vue'

const props = defineProps<{
  task: Partial<CustomTaskFormModel>,
  modelValue: Record<string, boolean>
}>()

const emit = defineEmits(['update:modelValue'])

const valueLocal: Ref<Record<string, boolean>> = ref({})
const updateValue = (key: string, value: boolean) => {
  valueLocal.value[key] = value
  emit('update:modelValue', valueLocal.value)
}
</script>

<style scoped>

</style>
