import Api from 'src/api/Api'
import {
  BrokerAgenciesFilters, BrokerAgencyData, BrokerAgencies, BrokersFilters, BrokersSortBy
} from 'src/types'

export default class BrokersApi extends Api {
  async getBrokerAgenciesList (filters: BrokerAgenciesFilters, sortBy: { name: string, direction: 'desc' | 'asc' }[], offset: number, limit: number): Promise<{
    data: BrokerAgencies[],
    meta: {
      totalItemCount: number,
    }
  }> {
    const data = this.removeEmptyFields({ filters, sortBy, offset, limit })
    return (await this.axios.post('/crm/api/v2/broker-agency/list', data)).data
  }

  async addBrokerAgency (data: BrokerAgencyData) {
    const noEmptyFieldsData = this.removeEmptyFields(data)
    return (await this.axios.post('/crm/api/v2/broker-agency', noEmptyFieldsData)).data
  }

  async editBrokerAgency (id: number, data: BrokerAgencyData) {
    const noEmptyFieldsData = this.removeEmptyFields(data)
    return (await this.axios.patch(`/crm/api/v2/broker-agency/${id}`, noEmptyFieldsData)).data
  }

  async getBrokersList (filters: BrokersFilters[], sortBy: BrokersSortBy[], offset: number, limit: number) {
    const data = this.removeEmptyFields({ filters, sortBy, offset, limit })
    return (await this.axios.post('/crm/api/v2/broker/list', data)).data
  }
}
