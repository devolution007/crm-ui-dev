import { InsuranceOrganizationData } from 'src/models/InsuranceOrganizationModel'

export interface MemberBasicInterface {
  readonly id: number
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly name: string
  readonly allowedOrganizations: InsuranceOrganizationData[]
}

class MemberModel implements MemberBasicInterface {
  readonly email: string
  readonly name: string
  readonly firstName: string
  readonly lastName: string
  readonly id: number
  readonly role: number
  readonly allowedOrganizations: InsuranceOrganizationData[]

  constructor ({ email, name, id, firstName, lastName, role, allowedOrganizations = [] }: any) {
    this.email = email
    this.name = name
    this.firstName = firstName
    this.lastName = lastName
    this.id = id
    this.role = role
    this.allowedOrganizations = allowedOrganizations
  }

}

export default MemberModel
