<template>
  <div class="hover-able">
    <q-select
      v-model="valueLocal"
      :options="optionsCompiled"
      map-options
      emit-value
      :label="$t('facility')"
      clearable
      stack-label
      option-label="name"
      option-value="id"
      @update:model-value="$emit('update:modelValue', valueLocal)"
    >
      <template #selected-item="scope">
        <div
          class="q-py-sm inline items-center"
        >
          <div>
            <q-item-label>
              {{ scope.opt.name }}
            </q-item-label>
          </div>
        </div>
      </template>
    </q-select>
    <tasks-link-related
      v-if="valueLocal"
      :label="$t('openDetailsPage')"
      :to="{name: 'facility-edit', params: {facilityId: valueLocal}}"
    />
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, Ref, watch } from 'vue'
import useReusableFacilitiesList from 'src/composables/useReusableFacilitiesList'

interface FacilityOption {
  id: number
  name: string
}

const { facilities: options } = useReusableFacilitiesList() as { facilities: Ref<FacilityOption[]> }

const props = withDefaults(defineProps<{
  modelValue?: number|null
  selectedDetails?: FacilityOption|null
}>(), {
  modelValue: null,
  selectedDetails: null
})

const valueLocal: Ref<number|null> = ref(null)

const optionsCompiled = computed(() => {
  if (props.selectedDetails && !options.value.find((option) => option.id === props.selectedDetails?.id)) {
    return options.value.concat([props.selectedDetails])
  }
  return options.value
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
