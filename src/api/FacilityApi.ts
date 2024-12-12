import Api from 'src/api/Api'
import {
  FacilityFilter,
  FacilityReportList,
  FacilityForm,
  FacilityOrdersScheduleFilter,
  FacilityList,
  SortBy,
  FacilityAssociationForm,
  FacilityCommunicationLogFilter,
  FacilityCommunicationLogList,
  FacilityLogForm
} from 'src/types'
import FacilityModel from 'src/models/facility/FacilityModel'
import FacilityReportModel from 'src/models/facility/FacilityReportModel'
import CommunicationModel, { CommunicationLog } from 'src/models/facility/CommunicationModel'
import { FacilityReport } from 'src/models/facility/FacilityReport'

export default class FacilityApi extends Api {
  // getUnverifiedProfileFacility (id: number) {
  //   return this.axios.get(`/csr/api/ajax/facility-profile/${id}`)
  // }
  //
  // getStaffFullList () {
  //   return this.axios.get('/csr/api/ajax/facility/staff-list')
  // }

  async getFacility (id: number) {
    const item = (await this.axios.get(`/crm/api/v2/facility/${id}`)).data
    return new FacilityModel(item)
  }

  async getFacilities (page: number, filterBy: FacilityFilter, sortBy: SortBy[], perPage = 25): Promise<FacilityList> {
    const params = this.purgeParams(page, perPage, filterBy, sortBy)
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/facility', { params })).data
    return {
      items: items.map((item: any) => new FacilityModel(item)),
      totalPages,
      totalItemCount
    }
  }

  async getFacilitiesReport (page: number, filterBy: FacilityFilter, perPage = 25): Promise<FacilityReportList> {
    const params = this.purgeParams(page, perPage, filterBy)
    const { items, totalPages, totalItemCount, meta } = (await this.axios.get('/crm/api/v2/facility-report', { params })).data
    return {
      items: items.map((item: any) => new FacilityReportModel(item)),
      totalPages,
      totalItemCount,
      meta
    }
  }

  async getFacilityReport (id: number) {
    return (await this.axios.get(`/crm/api/v2/facility-report/${id}`)).data as FacilityReport
  }

  async editFacility (data: FacilityForm, facilityId: number) {
    return (await this.axios.patch(`/crm/api/v2/facility/${facilityId}`, data)).data
  }

  async addFacility (data: FacilityForm) {
    return (await this.axios.post('/crm/api/v2/facility-profile', data)).data
  }

  async ordersSchedule (page: number, filterBy: FacilityOrdersScheduleFilter) {
    const params = this.purgeParams(page, 25, filterBy)
    const {
      items,
      monthsNames,
      totalPages,
      totalItemCount,
      schedules,
      months
    } = (await this.axios.get('/crm/api/v2/facility-report/orders-schedule', { params })).data
    return {
      items: items.map((item: any) => new FacilityReportModel(item)),
      totalPages,
      totalItemCount,
      monthsNames,
      schedules,
      months
    }
  }

  // allegedly, so far, cannot be big number of items
  async getProfileFacilities (filterBy: FacilityFilter, sortBy: SortBy[]): Promise<FacilityList> {
    const params = this.purgeParams(1, 1000, filterBy, sortBy)
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/facility-profile', { params })).data
    return {
      items: items.map((item: any) => new FacilityModel(item)),
      totalPages,
      totalItemCount
    }
  }

  async associateProfileFacility (profileFacilityId: number, data: FacilityAssociationForm) {
    return (await this.axios.patch(`/crm/api/v2/facility-profile/${profileFacilityId}/associate`, data)).data
  }

  async getCommunicationLog (page: number, filterBy: FacilityCommunicationLogFilter, sortBy: SortBy[]): Promise<FacilityCommunicationLogList> {
    const params = this.purgeParams(page, 25, filterBy, sortBy)
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/facility-communication-log', { params })).data
    return {
      items: items.map((item: any) => new CommunicationModel(item)),
      totalPages,
      totalItemCount
    }
  }

  async patchCommunicationLog (id: number, data: Partial<CommunicationLog>): Promise<CommunicationLog> {
    return (await this.axios.patch(`/crm/api/v2/facility-communication-log/${id}`, data)).data as CommunicationLog
  }

  async addCommunicationLog (data: FacilityLogForm) {
    return (await this.axios.post('/crm/api/v2/facility-communication-log', data)).data
  }
}
