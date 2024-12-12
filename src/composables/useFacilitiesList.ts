import { ref, onMounted } from 'vue'
import FacilityModel from 'src/models/facility/FacilityModel'
import { api } from 'boot/axios'
import FacilityApi from 'src/api/FacilityApi'

/**
 * @deprecated use useReusableFacilitiesList instead
 */
export function useFacilitiesList () {
  const facilities = ref<FacilityModel[]>([])
  const facilitiesForFilter = ref<FacilityModel[]>([])
  const facilitiesLoading = ref<boolean>(false)
  const facilityRepository: FacilityApi = new FacilityApi(api)
  function facilityFilter (val: string, update: any) {
    update(() => {
      facilities.value = facilitiesForFilter.value.filter((v: any) => v.name.indexOf(val) > -1)
    })
  }

  onMounted(async () => {
    facilitiesLoading.value = true
    const { items } = await facilityRepository.getFacilities(1, { verified: true }, [{ name: 'asc' }], 1000)
    facilities.value = items
    facilitiesForFilter.value = items.map(a => ({ ...a }))
    facilitiesLoading.value = false
  })

  return { facilities, facilityFilter, facilitiesLoading }
}
