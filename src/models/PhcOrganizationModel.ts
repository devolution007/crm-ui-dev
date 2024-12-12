export interface PhcOrganizationModelData {
  id: number
  name: string
  domainPrefix: string
}

export class PhcOrganizationModel {
  id: number
  name: string
  domainPrefix: string

  constructor (data: PhcOrganizationModelData) {
    this.id = data.id
    this.name = data.name
    this.domainPrefix = data.domainPrefix
  }
}
