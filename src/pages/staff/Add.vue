<template>
  <q-page padding>
    <bricks-page-title>{{ $t('addStaff') }}</bricks-page-title>
    <q-card class="">
      <q-card-section>
        <facility-staff-form
          v-if="!loading"
          :server-errors="serverErrors"
          :form-data="formData"
          :submitting="submitting"
          @submit="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'

import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import StaffApi from 'src/api/StaffApi'
import { useServerErrors } from 'src/composables/useServerErrors'
import { StaffForm } from 'src/types'
import { Notify, useMeta } from 'quasar'

const staffRepository: StaffApi = new StaffApi(api)
const submitting = ref<boolean>(false)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()
const { serverErrors, processErrors } = useServerErrors()

const formData = ref<StaffForm>({
  phone: null,
  name: null,
  title: null,
  email: null,
  note: null,
  preferredWayOfCommunication: null,
  primaryContact: false,
  type: null,
  facilities: []
})

const props = defineProps<{
  facilityId?: number // May be defined: from what facility we are going to add staff
}>()

useMeta({
  title: `Staff #${route.params.staffId}`
})

async function submit (data: StaffForm) {
  try {
    submitting.value = true
    serverErrors.value = {}
    await staffRepository.addStaff(data)
    Notify.create({
      message: 'Data has been changed',
      type: 'positive'
    })

    if (props.facilityId){
      await router.push({
        name: 'facility-view',
        params: {
          facilityId: props.facilityId
        },
        query: {
          tab: 'staff'
        }
      })
    } else {
      await router.push({
        name: 'staff-list'
      })
    }
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if(props.facilityId) {
    formData.value.facilities = [props.facilityId]
  }
})
</script>
