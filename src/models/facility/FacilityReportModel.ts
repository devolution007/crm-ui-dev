import FacilityModel from 'src/models/facility/FacilityModel'

class FacilityReportModel extends FacilityModel {
  activeCustomers: number
  servedMembers: number
  servedMembersPrevMonth: number
  managerName: string
  managerId: number

  constructor (facility: any) {
    super(facility)
    // eslint-disable-next-line camelcase
    const { activeCustomers, servedMembers, servedMembersPrevMonth, managerName, managerId } = facility
    // eslint-disable-next-line camelcase
    this.activeCustomers = activeCustomers
    // eslint-disable-next-line camelcase
    this.servedMembers = servedMembers
    // eslint-disable-next-line camelcase
    this.servedMembersPrevMonth = servedMembersPrevMonth
    // eslint-disable-next-line camelcase
    this.managerName = managerName
    this.managerId = managerId
  }
}

export default FacilityReportModel
