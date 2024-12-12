import Api from 'src/api/Api'
import { InsuranceCompany } from 'src/models/InsuranceCompany'

class InsuranceCompaniesApi extends Api {
  async getInsuranceCompanies (domainPrefix: string) {
    return (await this.axios.get(`/crm/api/v2/insurance-company/${domainPrefix}/list`)).data as InsuranceCompany[]
  }
}

export default InsuranceCompaniesApi
