<script setup lang="ts">

import useServerErrors2 from 'src/composables/useServerErrors2'
import { useRouter } from 'vue-router'
import { ref, Ref } from 'vue'
import { QForm } from 'quasar'
import CustomerApi from 'src/api/CustomerApi'
import { api } from 'boot/axios'
import useAbstractCustomerRegFormData from 'src/composables/useAbstractCustomerRegFormData'

const props = withDefaults(defineProps<{
  submitEnabled: boolean
}>(), {
  submitEnabled: true
})

const regForm: Ref<QForm | null> = ref(null)
const loading = ref(false)

const { combinedFormData, basicFormDataHandler } = useAbstractCustomerRegFormData({})

const {
  serverErrors,
  catchValidationErrors,
  resetServerErrors
} = useServerErrors2({
  state: '',
  firstName: '',
  lastName: '',
  gender: '',
  phone: '',
  email: '',
  birthdate: '',
  language: ''
})

const router = useRouter()

const submit = async () => {
  if (!props.submitEnabled) {
    return
  }
  if (!await regForm.value?.validate()) {
    return
  }
  loading.value = true
  resetServerErrors()

  try {
    const created = await (new CustomerApi(api)).createPhcCustomer(combinedFormData.value)

    await router.push({
      name: 'customer-details',
      params: { customerId: created.id },
      query: {
        registered: 1
      }
    })
  } catch (e) {
    catchValidationErrors(e)
  }
  loading.value = false
}
</script>

<template>
  <q-form
    ref="regForm"
    autocomplete="off"
    @submit.prevent="submit"
  >
    <customer-registration-abstract-form
      :server-errors="serverErrors"
      :submit-enabled="props.submitEnabled"
      :loading="loading"
      @change="basicFormDataHandler"
    />
  </q-form>
</template>

<style scoped>

</style>
