import Api from 'src/api/Api'
import { PhcOrganizationModel, PhcOrganizationModelData } from 'src/models/PhcOrganizationModel'
import { InsuranceOrganizationData, InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import { InsurancePlanData, InsurancePlanModel } from 'src/models/InsurancePlanModel'

export default class OrganizationApi extends Api {
  async getOrganizations (): Promise<InsuranceOrganizationModel[]> {
    const items = (await this.axios.get('/crm/api/v2/organization')).data
    return items.map((item: InsuranceOrganizationData) => new InsuranceOrganizationModel(item))
  }

  async getPhcOrganizations (): Promise<PhcOrganizationModel[]> {
    const items = (await this.axios.get('/crm/api/v2/phc-organization')).data
    return items.map((item: PhcOrganizationModelData) => new PhcOrganizationModel(item))
  }

  async getInsurancePlans () {
    const items = (await this.axios.get('/crm/api/v2/insurance-plan')).data
    return items.map((item: InsurancePlanData) => new InsurancePlanModel(item))
  }
}
