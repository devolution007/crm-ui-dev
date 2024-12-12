<template>
  <q-select
    v-model="valueLocal"
    :options="options"
    map-options
    emit-value
    :label="$t('assignedTo')"
    dense
    clearable
    stack-label
    @update:model-value="$emit('update:modelValue', valueLocal)"
  >
    <template #selected-item="scope">
      <div class="q-py-sm flex items-center">
        <tools-member-indicator
          :member="scope.opt.entry"
          class="q-mr-sm"
        />
        <div>
          <q-item-label>
            {{ scope.opt.label }}
          </q-item-label>
          <q-item-label caption class="text-toner">
            {{ scope.opt.description }}
          </q-item-label>
        </div>
      </div>
    </template>
    <template #option="scope">
      <q-item
        dense
        v-bind="scope.itemProps"
      >
        <q-item-section avatar>
          <tools-member-indicator :member="scope.opt.entry" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ scope.opt.label }}
          </q-item-label>
          <q-item-label caption>
            {{ scope.opt.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, Ref, PropType } from 'vue'
import { useMembersStore } from 'stores/members-store'

const { fullListAsOptions: options, fetchFullList: fetchMembersAttempt } = useMembersStore()
fetchMembersAttempt()

const valueLocal: Ref<number|null> = ref(null)

const props = defineProps({
  modelValue: {
    type: Number as PropType<number|null>,
    required: false,
    default: null
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
