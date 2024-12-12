import { computed, Ref, ref } from 'vue'
import { api } from 'boot/axios'
import InsurancePlanApi from 'src/api/InsurancePlanApi'
import { InsurancePlanBasic } from 'src/models/InsurancePlanModel'

const plansAll: Ref<Record<string, InsurancePlanBasic[]>> = ref({})

export default function useInsurancePlansList (domain: string) {
  const loading = ref(false)

  const reload = () => {
    const insurancePlansApi = new InsurancePlanApi(api)
    loading.value = true
    insurancePlansApi.getPlans(domain)
      .then((resp) => {
        plansAll.value[domain] = resp.items
      })
      .finally(() => {
        loading.value = false
      })
  }

  if (!plansAll.value[domain] || !plansAll.value[domain].length) {
    reload()
  }

  const plans = computed(() => {
    return plansAll.value[domain] || []
  })

  return {
    plans,
    loading,
    reload
  }
}
