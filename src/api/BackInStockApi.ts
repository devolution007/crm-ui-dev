import Api from 'src/api/Api'
import { BackInStockItemInterface, AttachmentInfo, BackInStockFilter, BackInStockList, SortBy } from 'src/types'
import BackInStockModel from 'src/models/BackInStockModel'

class BackInStockApi extends Api {
  async get (customerId: number): Promise<BackInStockItemInterface[]> {
    const { items } = (await this.axios.get(`/crm/api/v2/back-in-stock/${customerId}`, {
      perPage: 1000
    })).data
    return items.map((row: BackInStockItemInterface) => row)
  }

  async list (page: number, filterBy: BackInStockFilter, sortBy: SortBy[], perPage = 25): Promise<BackInStockList> {
    const params = {
      page,
      perPage,
      filterBy: this.removeEmptyFields(filterBy),
      sortBy: sortBy.find((item: SortBy) => item.field !== null)
    }
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/back-in-stock', { params })).data
    return {
      items: items.map((item: any) => new BackInStockModel(item)),
      totalPages,
      totalItemCount
    }
  }

  async add (sku: string, customerId: number, noticeType: string, noticeTarget: string): Promise<BackInStockItemInterface> {
    const item = (await this.axios.post(`/crm/api/v2/back-in-stock/${customerId}`, {
      sku,
      noticeTarget,
      noticeType
    })).data
    return item as BackInStockItemInterface
  }

  async remove (sku: string, customerId: number) {
    return await this.axios.delete(`/crm/api/v2/back-in-stock/${customerId}/${sku}`)
  }

  async createCsvLink (filterBy: BackInStockFilter): Promise<AttachmentInfo> {
    return (await this.axios.post('/crm/api/v2/back-in-stock/create-csv-link', { filterBy })).data
  }
}

export default BackInStockApi
