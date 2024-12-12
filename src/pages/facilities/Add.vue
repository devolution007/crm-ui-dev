<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <bricks-top-back-button
        :label="$t('facilities')"
        :to="{ name: 'facility-list' }"
      />
      <div class="q-table__title q-mb-md">
        {{ formData.name }}
      </div>

      <facility-facility-form
        v-if="!loading"
        :server-errors="serverErrors"
        :form-data="formData"
        :submitting="submitting"
        @submit="submit"
      />
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Notify, useMeta } from 'quasar'
import FacilityApi from 'src/api/FacilityApi'
import { api } from 'boot/axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServerErrors } from 'src/composables/useServerErrors'
import { AxiosError } from 'axios'
import { FacilityForm } from 'src/types'
const facilityRepository: FacilityApi = new FacilityApi(api)
const { t } = useI18n()
const router = useRouter()
const { serverErrors, processErrors } = useServerErrors()
const submitting = ref<boolean>(false)
const loading = ref<boolean>(false)
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
  verified: false
})
useMeta({
  title: 'Add Facility'
})
async function submit (data: FacilityForm) {
  try {
    submitting.value = true
    serverErrors.value = {}
    await facilityRepository.addFacility(data)
    Notify.create({
      message: 'Data has been added',
      type: 'positive'
    })
    await router.push('/facilities')
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    submitting.value = false
  }
}
</script>
