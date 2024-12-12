import StaffModel from 'src/models/facility/StaffModel'
import { computed, ComputedRef, ref } from 'vue'
import { api } from 'boot/axios'
import StaffApi from 'src/api/StaffApi'
import { StaffFilter } from 'src/types'

const staff = ref<StaffModel[]>([])
export default function useFacilityStaffList () {
  const loading = ref(false)

  const fetchStaffFullList = async () => {
    const facilityApi = new StaffApi(api)

    loading.value = true
    const { items } = await facilityApi.getStaffList(1, {} as StaffFilter, [{ id: 'asc' }], 25)
    staff.value = items as StaffModel[]
    loading.value = false
  }

  if (!staff.value.length) {
    fetchStaffFullList()
      .finally()
  }

  const getStaffByFacilityId = (facilityId: ComputedRef<number | null>) => {
    return computed(() => {
      if (!facilityId.value) return staff.value
      return staff.value.filter((item) => item.facilities.some((facility) => facility.id === facilityId.value)
      )
    })
  }

  return {
    staff,
    loading,
    fetchStaffFullList,
    getStaffByFacilityId
  }
}
