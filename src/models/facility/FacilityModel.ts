import AddressModel from 'src/models/AddressModel'
import MemberModel from 'src/models/MemberModel'

export interface FacilityBasicInterface {
  id: number
  name: string
  isDeleted: boolean
}

/**
 * todo: use interfaces instead of dummy models
 */
class FacilityModel {
  id: number
  name: string
  verified: boolean
  address: AddressModel
  manager: MemberModel

  constructor ({ id, name, verified, address, manager }: any) {
    this.id = id
    this.name = name
    this.verified = verified
    this.address = address
    this.manager = manager
  }
}

export default FacilityModel
