import Api from 'src/api/Api'
import { AttachmentInfo, CustomersFilter, FacilityCustomerList } from 'src/types'
import { FacilityCustomer } from 'src/models/facility/FacilityCustomer'

export default class ReportApi extends Api {
  async getActiveCustomersByFacility (page: number, filterBy: CustomersFilter, perPage = 25): Promise<FacilityCustomerList> {
    const params = this.purgeParams(page, perPage, filterBy)
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/facility-customers', { params })).data
    return {
      items: items.map((item: FacilityCustomer) => item),
      totalPages,
      totalItemCount
    }
  }

  async createActiveCustomersByFacilityCsv (filterBy: CustomersFilter): Promise<AttachmentInfo> {
    return (await this.axios.post('/crm/api/v2/facility-customers/create-csv', { filterBy })).data
  }
}
