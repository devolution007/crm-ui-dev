<template>
  <q-select
    v-model="valueLocal"
    :options="statuses"
    map-options
    emit-value
    :bg-color="getTaskStatus(valueLocal).color"
    standout
    dense
    label-color="dark"
    color="dark"
    hide-dropdown-icon
    @update:model-value="$emit('update:modelValue', valueLocal)"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>
            <q-chip
              :color="scope.opt.color"
              :selected="scope.selected"
              text-color="dark"
            >
              {{ scope.opt.label }}
            </q-chip>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template #selected-item="scope">
      <span class="text-dark">
        {{ scope.opt.label }}
      </span>
    </template>
    <template #append>
      <q-icon
        name="arrow_drop_down"
        color="dark"
      />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import useTaskStatuses from 'src/composables/useTaskStatuses'
import { onMounted, watch, ref, Ref } from 'vue'

const { statuses, getStatusByValue: getTaskStatus } = useTaskStatuses()

const valueLocal: Ref<number> = ref(0)

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  }
})

defineEmits(['update:modelValue'])

watch(() => props.modelValue, (value) => {
  valueLocal.value = value
})

onMounted(() => {
  valueLocal.value = props.modelValue
})
</script>

<style scoped>

</style>
