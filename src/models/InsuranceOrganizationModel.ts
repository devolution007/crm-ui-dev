export interface InsuranceOrganizationData {
  id: number
  name: string
  domainPrefix: string
}

export class InsuranceOrganizationModel {
  id: number
  name: string
  domainPrefix: string

  constructor (data: InsuranceOrganizationData) {
    this.id = data.id
    this.name = data.name
    this.domainPrefix = data.domainPrefix
  }
}
