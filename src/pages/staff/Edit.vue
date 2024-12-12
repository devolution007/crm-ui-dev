<template>
  <q-page padding>
    <bricks-top-back-button
      label="Back to staff list"
      :to="{ name: 'staff-list' }"
    />
    <bricks-page-title>Edit Staff</bricks-page-title>
    <div class="q-mb-xl">
      <q-inner-loading
        :showing="loading"
        label="Please wait..."
      />
      <q-card>
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
    </div>
    <q-page-sticky
      position="bottom-left"
      :offset="[18, 18]"
    >
      <app-back-button
        label="Back to staff list"
        :to="{ name: 'staff-list' }"
      />
    </q-page-sticky>
  </q-page>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import StaffApi from 'src/api/StaffApi'
import { useServerErrors } from 'src/composables/useServerErrors'
import { StaffForm } from 'src/types'
import { helper } from 'boot/helper'
import { Notify, useMeta } from 'quasar'

const staffRepository: StaffApi = new StaffApi(api)
const submitting = ref<boolean>(false)
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()
const { serverErrors, processErrors } = useServerErrors()
const staffId = ref<number|null>(null)
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
  staffId?: number
  facilityId?: number // May be defined: from what facility we are going to edit staff
}>()

useMeta({
  title: `Staff #${props.staffId}`
})

async function submit (data: StaffForm) {
  try {
    submitting.value = true
    serverErrors.value = {}
    await staffRepository.editStaff(data, staffId.value)
    Notify.create({
      message: 'Data has changed',
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
    processErrors(err as AxiosError)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  const staff = await staffRepository.getStaff(Number(route.params.staffId))
  staffId.value = staff.id
  helper.updateObject(formData.value, staff)
  loading.value = false
})
</script>
