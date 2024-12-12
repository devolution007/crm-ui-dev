import Api from 'src/api/Api'
import { InsurancePlanBasic } from 'src/models/InsurancePlanModel'

class InsurancePlanApi extends Api {
  async getPlans (domainPrefix: string) {
    return (await this.axios.get(`/crm/api/v2/customer/plans/${domainPrefix}`)).data as {
      items: InsurancePlanBasic[]
      status: string
      meta: {
        items_count: number
      }
    }
  }
}

export default InsurancePlanApi
