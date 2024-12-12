<template>
  <div class="hover-able">
    <q-select
      v-model="valueLocal"
      :options="optionsCompiled"
      map-options
      emit-value
      :label="$t('targetList')"
      clearable
      stack-label
      option-label="name"
      option-value="id"
      readonly
      :hide-dropdown-icon="true"
    />
    <tasks-link-related
      v-if="valueLocal"
      :label="$t('openTargetList')"
      @click="$q.notify('Not implemented yet')"
    />
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, Ref, watch } from 'vue'

interface TLOption {
  id: number
  name: string
}

const props = withDefaults(defineProps<{
  modelValue?: number|null
  selectedDetails?: TLOption|null
}>(), {
  modelValue: null,
  selectedDetails: null
})

const valueLocal: Ref<number|null> = ref(null)
const options: Ref<TLOption[]> = ref([])

const optionsCompiled = computed(() => {
  if (props.selectedDetails) {
    return options.value.concat([props.selectedDetails])
  }
  return options.value
})

watch(() => props.modelValue, (value) => {
  valueLocal.value = value
})

onMounted(() => {
  valueLocal.value = props.modelValue
})

</script>

<style scoped>

</style>
