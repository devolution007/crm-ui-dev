<template>
  <app-dialog
    v-model="dialog"
    :title="`${$t('logNewCommunicationInFacility')} ${props.facility.name}`"
    min-width="800"
  >
    <q-form
      ref="form"
      @submit.prevent="submit"
    >
      <app-date-time-picker
        v-model="log.dateTime"
        style="max-width: 300px"
        class="q-mb-md"
        :error-message="serverErrors?.dateTime"
        :error="!!serverErrors?.dateTime"
        :label="$t('dateAndTime')"
      />
      <q-select
        v-model="log.staff"
        :error-message="serverErrors?.staff"
        :error="!!serverErrors?.staff"
        outlined
        dense
        clearable
        :options="staffInFacility"
        :label="$t('staff')"
        :loading="loading"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        class="q-mb-sm"
        input-debounce="0"
      />
      <q-select
        v-model="log.channel"
        :error-message="serverErrors?.channel"
        :error="!!serverErrors?.channel"
        outlined
        dense
        clearable
        :options="['phone', 'email']"
        :label="$t('channel')"
        map-options
        class="q-mb-sm"
        input-debounce="0"
      />
      <q-input
        :model-value="log.reason"
        :error-message="serverErrors?.reason"
        :error="!!serverErrors?.reason"
        outlined
        dense
        :label="$t('reason')"
        rows="2"
        class="q-mb-sm"
        type="textarea"
        @change="log.reason=$event"
        @clear="log.reason=null"
      />
      <q-input
        :model-value="log.result"
        :error-message="serverErrors?.result"
        :error="!!serverErrors?.result"
        outlined
        dense
        :label="$t('result')"
        rows="2"
        class="q-mb-sm"
        type="textarea"
        @change="log.result=$event"
        @clear="log.result=null"
      />
      <q-input
        v-model="log.link"
        :error-message="serverErrors?.link"
        :error="!!serverErrors?.link"
        :label="$t('link')"
        outlined
        dense
        clearable
        class="q-mb-sm"
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
    color="secondary"
    text-color="primary"
    icon="add"
    :label="$t('add')"
    size="md"
    @click="open"
  />
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useServerErrors } from 'src/composables/useServerErrors'
import { FacilityLogForm, SortBy, StaffFilter } from 'src/types'
import { AxiosError } from 'axios'
import FacilityModel from 'src/models/facility/FacilityModel'
import FacilityApi from 'src/api/FacilityApi'
import StaffModel from 'src/models/facility/StaffModel'
import StaffApi from 'src/api/StaffApi'
import { api } from 'boot/axios'
import moment from 'moment'

const staffRepository: StaffApi = new StaffApi(api)
const facilityRepository: FacilityApi = new FacilityApi(api)
const props = defineProps<{
  facility: FacilityModel
}>()

const { serverErrors, processErrors } = useServerErrors()
const dialog = ref<boolean>(false)
const submitting = ref<boolean>(false)
const loading = ref<boolean>(false)
const emit = defineEmits(['saved'])
const form = ref(null)
const staffInFacility = ref<StaffModel[]>([])
const logDefault = {
  staff: undefined,
  channel: undefined,
  reason: undefined,
  link: '',
  result: undefined,
  dateTime: moment().format('YYYY-MM-DD HH:mm'),
  facilityId: props.facility.id
}

const log = ref<FacilityLogForm>({
  ...logDefault
})
function open () {
  dialog.value = true
  form.value?.resetValidation()
  serverErrors.value = {}
}

const sortBy = ref<SortBy[]>([
  { id: 'desc' }
])
const filterBy = ref<StaffFilter>({
  facilityIds: [props.facility.id],
  isActive: true
})
async function submit () {
  try {
    submitting.value = true
    serverErrors.value = {}
    log.value.dateTime = moment(log.value.dateTime).format('YYYY-MM-DD HH:mm:ss')
    await facilityRepository.addCommunicationLog(log.value)
    dialog.value = false
    emit('saved')
    log.value = { ...logDefault }
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  const { items } = await staffRepository.getStaffList(1, filterBy.value, sortBy.value, 1000)
  staffInFacility.value = items
  loading.value = false
})
</script>
