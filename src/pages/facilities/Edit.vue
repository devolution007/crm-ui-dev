<template>
  <q-page padding>
    <bricks-top-back-button
      :label="$t('facilities')"
      :to="{ name: 'facility-list' }"
    />
    <bricks-page-title>{{ formData.name }}</bricks-page-title>
    <q-card>
      <q-card-section>
        <q-inner-loading
          :showing="loading"
          :label="$t('pleaseWait')"
        />
        <facility-facility-form
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
import { Notify, useMeta } from 'quasar'
import FacilityApi from 'src/api/FacilityApi'
import { api } from 'boot/axios'
import { onMounted, ref } from 'vue'
import FacilityModel from 'src/models/facility/FacilityModel'
import { useServerErrors } from 'src/composables/useServerErrors'
import { AxiosError } from 'axios'
import { FacilityForm } from 'src/types'
import { helper } from 'boot/helper'
const facilityRepository: FacilityApi = new FacilityApi(api)
const route = useRoute()
const router = useRouter()
const { serverErrors, processErrors } = useServerErrors()
const submitting = ref<boolean>(false)
const loading = ref<boolean>(false)
const facilityId = ref<number|null>(null)
const formData = ref<FacilityForm>({
  address: {
    addressString: null,
    addressOptionalString: null,
    city: null,
    county: null,
    state: null,
    zipCode: null,
    phone: null
  },
  name: null,
  manager: {
    id: null,
    name: null
  },
  verified: null
})

useMeta({
  title: `Edit Facility #${route.params.facilityId}`
})
async function submit (data: FacilityForm) {
  try {
    submitting.value = true
    serverErrors.value = {}
    await facilityRepository.editFacility(data, facilityId.value)
    Notify.create({
      message: 'Data has been edited',
      type: 'positive'
    })
    await router.push('/facilities')
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loading.value = true
  serverErrors.value = {}
  const facility: FacilityModel = await facilityRepository.getFacility(Number(route.params.facilityId))
  facilityId.value = facility.id
  helper.updateObject(formData.value, facility)
  loading.value = false
})
</script>
