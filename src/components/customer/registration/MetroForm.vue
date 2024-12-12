<script setup lang="ts">
import { constants } from 'boot/constants'
import { Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { QForm } from 'quasar'
import { api } from 'boot/axios'
import useInsuranceCompaniesList from 'src/composables/useInsuranceCompaniesList'
import useServerErrors2 from 'src/composables/useServerErrors2'
import useAbstractCustomerRegFormData from 'src/composables/useAbstractCustomerRegFormData'
import CustomerApi from 'src/api/CustomerApi'
import useInsurancePlansList from 'src/composables/useInsurancePlansList'

const props = withDefaults(defineProps<{
  submitEnabled: boolean
}>(), {
  submitEnabled: true
})

const {
  companies,
  loading: companiesLoading
} = useInsuranceCompaniesList(constants.PROJECT_DOMAIN_METRO)

const {
  plans,
  loading: plansLoading
} = useInsurancePlansList(constants.PROJECT_DOMAIN_METRO)

const { combinedFormData, additionalFieldsData, basicFormDataHandler } = useAbstractCustomerRegFormData({
//  insuranceCompany: 0,
  insurancePlan: 0
})

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
  language: '',
  insuranceCompany: '',
  insurancePlan: ''
})

const regForm: Ref<QForm | null> = ref(null)
const loading = ref(false)

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
    const created = await (new CustomerApi(api)).createMetroCustomer(combinedFormData.value)

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
    >
      <div class="row">
        <div class="col-12 col-lg-6">
          <q-select
            v-model="additionalFieldsData.insurancePlan"
            :options="plans"
            map-options
            emit-value
            :label="$t('insurancePlan')"
            stack-label
            option-label="name"
            option-value="id"
            :loading="plansLoading"
            :error-message="serverErrors.insurancePlan"
            :error="!!serverErrors.insurancePlan"
          >
            <template #selected-item="scope">
              <div
                class="q-py-sm inline items-center"
              >
                <div>
                  <q-item-label>
                    {{ scope.opt.name }}
                  </q-item-label>
                </div>
              </div>
            </template>
          </q-select>
        </div>
        <div class="col-12 col-lg-6" v-if="false">
          <q-select
            v-model="additionalFieldsData.insuranceCompany"
            :options="companies"
            map-options
            emit-value
            :label="$t('insuranceCompany')"
            stack-label
            option-label="name"
            option-value="id"
            :loading="companiesLoading"
            :error-message="serverErrors.insuranceCompany"
            :error="!!serverErrors.insuranceCompany"
          >
            <template #selected-item="scope">
              <div
                class="q-py-sm inline items-center"
              >
                <div>
                  <q-item-label>
                    {{ scope.opt.name }}
                  </q-item-label>
                </div>
              </div>
            </template>
          </q-select>
        </div>
      </div>
    </customer-registration-abstract-form>
  </q-form>
</template>

<style scoped>

</style>
