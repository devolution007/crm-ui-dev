import { Ref, ref } from 'vue'
import { api } from 'boot/axios'
import FacilityModel from 'src/models/facility/FacilityModel'
import FacilityApi from 'src/api/FacilityApi'

const facilities: Ref<FacilityModel[]> = ref([])

export default function useReusableFacilitiesList () {
  const loading = ref(false)

  const reload = () => {
    const facilityApi = new FacilityApi(api)
    loading.value = true
    facilityApi.getFacilities(1, {}, [{ name: 'asc' }], 1000)
      .then((resp) => {
        facilities.value = resp.items
      }).finally(() => {
        loading.value = false
      })
  }

  if (!facilities.value.length) {
    reload()
  }

  return {
    facilities,
    loading,
    reload
  }
}
