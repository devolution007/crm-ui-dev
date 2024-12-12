import { ref, Ref } from 'vue'
import BrokersApi from 'src/api/BrokersApi'
import { api } from 'boot/axios'
import { BrokerAgencies } from 'src/types'

const brokerAgencies: Ref<BrokerAgencies[]> = ref([])
export function useBrokerAgenciesList () {
  const loading = ref(false)
  const brokersRepo = new BrokersApi(api)

  async function reload () {
    loading.value = true
    const response = await brokersRepo.getBrokerAgenciesList([], [], 0, 10000)
    brokerAgencies.value = response.data
    loading.value = false
  }

  if (!brokerAgencies.value.length) {
    reload().catch(e => console.error(e))
  }

  return {
    list: brokerAgencies,
    loading
  }
}
