import TargetListModel, { TargetListData } from '../models/TargetListModel'
import Api from 'src/api/Api'
import { Expression } from 'components/target-list/constants'
import CustomerModel from 'src/models/CustomerModel'
import { AttachmentInfo, CustomerList } from 'src/types'

const URL = '/crm/api/v2/target-list'

class TargetListApi extends Api {
  async getCustomers (query: any): Promise<CustomerList> {
    const { items, totalPages, totalItemCount } = (await this.axios.post(`${URL}/customers?page=${query.page}`, { ...query })).data
    return {
      items: items.map((item: any) => new CustomerModel(item)),
      totalPages,
      totalItemCount
    }
  }

  async add (queryBody: Expression[], queryName: string) {
    return (await this.axios.post(URL, { queryBody, queryName })).data
  }

  async edit (id: number, queryBody: Expression[], queryName: string) {
    return (await this.axios.patch(`${URL}/${id}`, { queryBody, queryName })).data
  }

  async list (): Promise<TargetListModel[]> {
    const items = (await this.axios.get(URL)).data
    return items.map((item: TargetListData) => new TargetListModel(item))
  }

  async remove (id: number) {
    return (await this.axios.delete(`${URL}/${id}`)).data
  }

  async createCsvLink (query: any): Promise<AttachmentInfo> {
    return (await this.axios.post(`${URL}/customers/create-csv-link`, { ...query })).data
  }
}

export default TargetListApi
