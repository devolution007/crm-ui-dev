import StaffModel, { StaffBasicInterface } from 'src/models/facility/StaffModel'
import MemberModel, { MemberBasicInterface } from 'src/models/MemberModel'
import FacilityModel, { FacilityBasicInterface } from 'src/models/facility/FacilityModel'

export interface CommunicationLog {
  id: number
  staff: StaffBasicInterface
  member: MemberBasicInterface
  facility: FacilityBasicInterface
  channel: string
  reason: string
  link: string
  result: string
}

class CommunicationModel {
  id: number
  datetime: string
  staff: StaffModel
  member: MemberModel
  facility: FacilityModel
  channel: string
  reason: string
  link: string
  result: string

  constructor ({ id, datetime, staff, member, facility, channel, reason, link, result }: any) {
    this.id = id
    this.datetime = datetime
    this.staff = staff
    this.member = member
    this.facility = facility
    this.channel = channel
    this.reason = reason
    this.link = link
    this.result = result
  }
}

export default CommunicationModel
