<template>
  <q-select
    v-model="valueLocal"
    :options="priorities"
    map-options
    emit-value
    :label="$t('priority')"
    dense
    @update:model-value="$emit('update:modelValue', valueLocal)"
  >
    <template #option="scope">
      <q-item
        dense
        v-bind="scope.itemProps"
      >
        <q-item-section avatar>
          <q-avatar
            :color="scope.opt.color"
            size="sm"
          >
            <q-icon :name="scope.opt.icon" class="text-black" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ scope.opt.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template #selected-item="scope">
      <div class="q-py-sm flex items-center">
        <q-avatar
          :color="scope.opt.color"
          size="sm"
          class="q-mr-sm"
        >
          <q-icon :name="scope.opt.icon" class="text-black" />
        </q-avatar>
        <q-item-label>
          {{ scope.opt.label }}
        </q-item-label>
      </div>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import useTaskPriorities from 'src/composables/useTaskPriorities'
import { onMounted, watch, ref, Ref } from 'vue'

const { priorities } = useTaskPriorities()

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
