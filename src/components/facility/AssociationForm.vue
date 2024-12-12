<template>
  <app-dialog
    v-model="dialog"
    :title="props.name"
    min-width="500"
  >
    <q-form
      ref="form"
      @submit.prevent="submit"
    >
      <q-select
        v-model="facility"
        :error-message="serverErrors?.facilityId"
        :error="!!serverErrors?.facilityId"
        outlined
        clearable
        :loading="facilitiesLoading"
        :options="facilities"
        :label="$t('facilities')"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        use-input
        :rules="[(v) => !!v || 'Field is required']"
        input-debounce="0"
        @filter="facilityFilter"
      />
      <q-btn
        color="primary"
        type="submit"
        class="float-right"
        :loading="submitting"
        :label="$t('save')"
      />
    </q-form>
  </app-dialog>
  <q-btn
    color="positive"
    size="12px"
    icon-right="link"
    :label="$t('associateWith')"
    @click="open"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import FacilityApi from 'src/api/FacilityApi'
const facilityRepository: FacilityApi = new FacilityApi(api)
import { useI18n } from 'vue-i18n'
import { useServerErrors } from 'src/composables/useServerErrors'
import { AxiosError } from 'axios'
import FacilityModel from 'src/models/facility/FacilityModel'
const { t } = useI18n()
const { serverErrors, processErrors } = useServerErrors()
const dialog = ref<boolean>(false)
const submitting = ref<boolean>(false)
const facility = ref<FacilityModel|null>(null)

const props = defineProps<{
  profileFacilityId: number,
  name: string,
  facilities: FacilityModel[],
  facilitiesLoading: boolean,
  facilityFilter: void
}>()
const emit = defineEmits(['saved'])
const form = ref(null)

async function open () {
  dialog.value = true
  form.value?.resetValidation()
  serverErrors.value = {}
}
async function submit () {
  try {
    submitting.value = true
    serverErrors.value = {}
    await facilityRepository.associateProfileFacility(props.profileFacilityId, {
      facilityId: Number(facility.value)
    })
    emit('saved')
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    submitting.value = false
  }
}
</script>
