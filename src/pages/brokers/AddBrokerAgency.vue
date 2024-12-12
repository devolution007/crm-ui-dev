<template>
  <div>
    <q-page padding>
      <bricks-page-title>
        {{ $t('addBrokerAgency') }}
      </bricks-page-title>
      <q-card class="">
        <q-card-section>
          <brokers-broker-agency-form
            :submitting="submitting"
            :server-errors="serverErrors"
            :form-data="formData"
            @submit="submit"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BrokerAgencyData } from 'src/types'
import useServerErrors2 from 'src/composables/useServerErrors2'
import BrokersApi from 'src/api/BrokersApi'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
const router = useRouter()

const formData = ref<BrokerAgencyData>({
  name: ''
})
const submitting = ref<boolean>(false)

const brokersRepo = new BrokersApi(api)

const {
  serverErrors,
  catchValidationErrors,
  resetServerErrors
} = useServerErrors2({
  name: ''
})

async function submit (data: BrokerAgencyData) {
  resetServerErrors()
  submitting.value = true
  try {
    const response = await brokersRepo.addBrokerAgency(data)
    Notify.create({
      message: 'New Broker Agency Added',
      type: 'positive'
    })
    if (response) {
      await router.push({
        name: 'broker-agencies'
      })
    }
  } catch (e) {
    catchValidationErrors(e)
  }
  submitting.value = false
}
</script>

<style scoped>

</style>
