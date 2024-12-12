import FacilityModel, { FacilityBasicInterface } from 'src/models/facility/FacilityModel'

export interface StaffBasicInterface {
  id: number
  name: string
  email: string
}

export interface StaffInterface extends StaffBasicInterface {
  active: boolean
  phone: null
  preferredWayOfCommunication: string
  title: null
  facilities: FacilityBasicInterface[]
  note: null
  type: string
  primaryContact: boolean
}

/**
 * todo: use interface instead of dummy models
 */
export default class StaffModel {
  id: number
  title: string
  name: string
  email: string
  phone: string
  note: string
  preferredWayOfCommunication: string
  primaryContact: boolean
  active: boolean
  type: string
  facilities: FacilityModel[]

  constructor ({ id, title, name, email, phone, note, preferredWayOfCommunication, primaryContact, active, type, facilities = [] }: any) {
    this.id = id
    this.title = title
    this.name = name
    this.email = email
    this.phone = phone
    this.note = note
    this.preferredWayOfCommunication = preferredWayOfCommunication
    this.primaryContact = primaryContact
    this.active = active
    this.facilities = facilities
    this.type = type
  }
}
