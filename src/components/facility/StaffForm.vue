<template>
  <q-form
    ref="form"
    @submit.prevent="submit"
  >
    <bricks-phone-input
      :model-value="mutableFormData.phone"
      :error-message="serverErrors?.phone"
      :error="!!serverErrors?.phone"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.phone=$event.replace(/\D/g, '')"
      @clear="mutableFormData.phone=''"
    />
    <q-select
      v-model="mutableFormData.facilities"
      :error-message="serverErrors?.facilities"
      :error="!!serverErrors?.facilities"
      outlined
      clearable
      multiple
      :loading="facilitiesLoading"
      :options="facilityOptions"
      :label="$t('facilities')"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      use-input
      class="q-mb-lg"
      input-debounce="0"
      @filter="facilityFilter"
    >
      <template #selected-item="{ opt, index, removeAtIndex }">
        <q-chip
          :key="index"
          :label="opt?.name"
          :color="(opt?.isDeleted ? 'negative' : 'primary')"
          text-color="white"
          removable
          @remove="removeAtIndex(index)"
        >
          <span v-if="opt?.isDeleted">&nbsp;(deleted)</span>
        </q-chip>
      </template>
      <template #after>
        <q-btn
          :loading="facilitiesLoading"
          icon="sym_o_refresh"
          round
          @click="facilitiesReload"
        />
      </template>
    </q-select>
    <q-input
      :model-value="mutableFormData.name"
      :error-message="serverErrors?.name"
      :error="!!serverErrors?.name"
      :label="$t('name')"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.name=$event"
      @clear="mutableFormData.name=null"
    />
    <q-input
      :model-value="mutableFormData.title"
      :error-message="serverErrors?.title"
      :error="!!serverErrors?.title"
      :label="$t('title')"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.title=$event"
      @clear="mutableFormData.title=null"
    />
    <q-input
      :model-value="mutableFormData.email"
      :error-message="serverErrors?.email"
      :error="!!serverErrors?.email"
      :label="$t('email')"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.email=$event"
      @clear="mutableFormData.email=null"
    />
    <q-select
      v-model="mutableFormData.preferredWayOfCommunication"
      outlined
      clearable
      :error-message="serverErrors?.preferredWayOfCommunication"
      :error="!!serverErrors?.preferredWayOfCommunication"
      :options="helper.parseObjectFromConstant(constants.STAFF_PREFERRED_COMMUNICATION_WAY)"
      :label="$t('preferred')"
      option-value="value"
      option-label="text"
      emit-value
      map-options
      class="q-mb-lg"
    />
    <q-input
      v-model="mutableFormData.note"
      :model-value="mutableFormData.note"
      :error-message="serverErrors?.note"
      :label="$t('note')"
      type="textarea"
      class="q-mb-lg"
      outlined
      clearable
      rows="3"
      @change="mutableFormData.note=$event"
      @clear="mutableFormData.note=null"
    />
    <q-select
      v-model="mutableFormData.type"
      outlined
      clearable
      option-value="value"
      option-label="text"
      :options="helper.parseObjectFromConstant(constants.STAFF_MEMBER_TYPES)"
      :label="$t('staffMemberType')"
      emit-value
      map-options
      class="q-mb-lg"
    />
    <div class="row">
      <div class="col">
        <q-checkbox
          v-model="mutableFormData.primaryContact"
          :error-message="serverErrors?.primaryContact"
          :error="!!serverErrors?.primaryContact"
          :label="$t('primaryContact')"
        />
      </div>
      <div class="col">
        <q-btn
          type="submit"
          color="primary"
          :loading="submitting"
          :label="$t('save')"
          class="col float-right"
        />
      </div>
    </div>
  </q-form>
</template>
<script setup lang="ts">
import { StaffForm } from 'src/types'
import { onMounted, ref, watch } from 'vue'
import { helper } from 'boot/helper'
import { constants } from 'boot/constants'
import useReusableFacilitiesList from 'src/composables/useReusableFacilitiesList'
import useOptionsFilter from 'src/composables/useOptionsFilter'
const { facilities, loading: facilitiesLoading, reload: facilitiesReload } = useReusableFacilitiesList()
const { options: facilityOptions, filterFn: facilityFilter } = useOptionsFilter(facilities, 'name')

const props = defineProps<{
  formData: StaffForm,
  serverErrors: any,
  submitting: boolean
}>()

const mutableFormData = ref<StaffForm>({ ...props.formData })

const emit = defineEmits(['submit'])

onMounted(() => {
  mutableFormData.value = { ...props.formData }
})

watch(() => props.formData.facilities, () => {
  mutableFormData.value.facilities = props.formData.facilities
})

function submit () {
  emit('submit', mutableFormData.value)
}
</script>
