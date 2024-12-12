<template>
  <div class="hover-able">
    <q-select
      v-model="valueLocal"
      :options="optionsCompiled"
      map-options
      emit-value
      :label="$t('staff')"
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
              <q-icon
                v-if="scope.opt.primaryContact"
                name="sym_o_stars"
              />
            </q-item-label>
            <q-item-label
              class="text-toner"
              caption
            >
              <div>
                {{ scope.opt.email }}
              </div>
              <div>
                {{ scope.opt.phone }}
              </div>
              <div>{{ $t('preferredWoc') }} {{ scope.opt.preferredWayOfCommunication }}</div>
            </q-item-label>
          </div>
        </div>
      </template>
      <template #option="scope">
        <q-item
          dense
          v-bind="scope.itemProps"
        >
          <q-item-section>
            <q-item-label>
              {{ scope.opt.name }}
              <q-icon
                v-if="scope.opt.primaryContact"
                name="sym_o_stars"
              />
            </q-item-label>
            <q-item-label caption>
              <div>
                {{ scope.opt.email }}
              </div>
              <div>
                {{ scope.opt.phone }}
              </div>
              <div>{{ $t('preferredWoc') }} <br> {{ scope.opt.preferredWayOfCommunication }}</div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <tasks-link-related
      v-if="valueLocal"
      :label="$t('openDetailsPage')"
      @click="$q.notify('Not implemented yet')"
    />
  </div>
</template>

<script setup lang="ts">

import { computed, ComputedRef, onMounted, PropType, ref, Ref, watch } from 'vue'

import useFacilityStaffList from 'src/composables/useFacilityStaffList'

interface StaffOption {
  id: number
  name: string
}

const { getStaffByFacilityId } = useFacilityStaffList()

const props = withDefaults(defineProps<{
  modelValue?: number|null
  selectedDetails?: StaffOption|null
  facilityId?: number|null
}>(), {
  modelValue: null,
  selectedDetails: null,
  facilityId: null
})

const facilityId: ComputedRef<number | null> = computed(() => props.facilityId || null)
const options = getStaffByFacilityId(facilityId) as Ref<StaffOption[]>

const valueLocal: Ref<number|null> = ref(null)

const optionsCompiled = computed(() => {
  if (props.selectedDetails && !options.value.find((item) => item.id === props.selectedDetails?.id) && valueLocal.value === props.selectedDetails.id) {
    return options.value.concat([props.selectedDetails])
  }
  return options.value
})

defineEmits(['update:modelValue'])

watch(() => facilityId.value, (value) => {
  if (value) {
    if (!options.value.find((item) => item.id === valueLocal.value)) {
      valueLocal.value = null
    }
  } else {
    valueLocal.value = null
  }
})

watch(() => props.modelValue, (value) => {
  valueLocal.value = value || null
})

onMounted(() => {
  valueLocal.value = props.modelValue || null
})

</script>
