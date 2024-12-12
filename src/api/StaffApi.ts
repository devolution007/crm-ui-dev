import Api from 'src/api/Api'
import { StaffInterface } from 'src/models/facility/StaffModel'
import { SortBy, StaffFilter, StaffForm, StaffList } from 'src/types'

export default class StaffApi extends Api {
  async getStaffList (page: number, filterBy: StaffFilter, sortBy: SortBy, perPage = 25): Promise<StaffList> {
    const params = {
      page, perPage, filterBy: this.removeEmptyFields(filterBy), sortBy
    }
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/staff', { params })).data
    return {
      items: items.map((item: StaffInterface) => item),
      totalPages,
      totalItemCount
    }
  }

  async getStaff (id: number) {
    return (await this.axios.get(`/crm/api/v2/staff/${id}`)).data as StaffInterface
  }

  async editStaff (data: StaffForm, staffId: number) {
    return (await this.axios.patch(`/crm/api/v2/staff/${staffId}`, data)).data
  }

  async addStaff (data: StaffForm) {
    return (await this.axios.post('/crm/api/v2/staff', data)).data
  }

  async toggleActivation (id: number) {
    await this.axios.patch(`/crm/api/v2/staff/${id}/toggle-activation`)
  }
}
