<template>
  <div>
    <q-page padding>
      <bricks-page-title>
        {{ $t('editBrokerAgency') }}
      </bricks-page-title>
      <q-card class="">
        <q-card-section>
          <brokers-broker-agency-form
            v-if="!loading"
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
import BrokersApi from 'src/api/BrokersApi'
import { api } from 'boot/axios'
import { ref, onMounted } from 'vue'
import { BrokerAgencyData } from 'src/types'
import { Notify } from 'quasar'
import useServerErrors2 from 'src/composables/useServerErrors2'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  brokerAgency: number
}>()

const brokersRepo = new BrokersApi(api)
const loading = ref<boolean>(false)
const submitting = ref<boolean>(false)

const {
  serverErrors,
  catchValidationErrors,
  resetServerErrors
} = useServerErrors2({
  name: ''
})

const formData = ref<BrokerAgencyData>({
  name: ''
})

onMounted(async () => {
  loading.value = true
  try {
    const response = await brokersRepo.getBrokerAgenciesList([{ name: 'id', value: props.brokerAgency }], [], 0, 1)
    formData.value.name = response.data[0].name
  } catch (err: unknown) {
    console.error(err)
    Notify.create({
      message: 'Error',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
})

async function submit (data: BrokerAgencyData) {
  resetServerErrors()
  submitting.value = true
  try {
    const response = await brokersRepo.editBrokerAgency(props.brokerAgency, data)
    Notify.create({
      message: `Broker Agency №${props.brokerAgency} edited`,
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
