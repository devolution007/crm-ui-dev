import qs from 'qs'
import Api from 'src/api/Api'
import CallModel, { CallBasic } from 'src/models/CallModel'
import { CallList, CallsFilter, SortBy } from 'src/types'

class CallApi extends Api {
  async startCall(type: string): Promise<CallModel> {
    const data = qs.stringify({ type })

    const call = (await this.axios.post('/crm/api/v2/call/start', data)).data
    return new CallModel(call)
  }

  async getCall(): Promise<CallModel | null> {
    const data = (await this.axios.get('/crm/api/v2/call/get-current')).data
    if (data.call === null) return null
    return new CallModel(data)
  }

  async endCall(category: string, note: string): Promise<CallModel> {
    const data = qs.stringify({
      category,
      resolution: note
    })
    return (await this.axios.post('/crm/api/v2/call/finish-current', data)).data
  }

  async identify(customerId: number): Promise<CallModel> {
    const data = qs.stringify({ customerId })
    const call = (await this.axios.post('/crm/api/v2/call/identify-customer', data)).data
    return new CallModel(call)
  }

  async getCalls(page: number, filterBy: CallsFilter, sortBy: SortBy, perPage = 25): Promise<CallList> {
    const params = {
      page, perPage, filterBy: this.removeEmptyFields(filterBy), sortBy
    }
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/call', { params })).data
    return {
      items: items.map((item: CallBasic) => item),
      totalPages,
      totalItemCount
    }
  }
}

export default CallApi
