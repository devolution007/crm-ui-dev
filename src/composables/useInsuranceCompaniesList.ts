import { computed, Ref, ref } from 'vue'
import { api } from 'boot/axios'
import { InsuranceCompany } from 'src/models/InsuranceCompany'
import InsuranceCompaniesApi from 'src/api/InsuranceCompaniesApi'

const companiesAll: Ref<Record<string, InsuranceCompany[]>> = ref({})

export default function useInsuranceCompaniesList (domain: string) {
  const loading = ref(false)

  const reload = () => {
    const insuranceCompaniesApi = new InsuranceCompaniesApi(api)
    loading.value = true
    insuranceCompaniesApi.getInsuranceCompanies(domain)
      .then((resp) => {
        companiesAll.value[domain] = resp
      })
      .finally(() => {
        loading.value = false
      })
  }

  if (!companiesAll.value[domain] || !companiesAll.value[domain].length) {
    reload()
  }

  const companies = computed(() => {
    return companiesAll.value[domain] || []
  })

  return {
    companies,
    loading,
    reload
  }
}
