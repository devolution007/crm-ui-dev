import IssueModel from '../models/IssueModel'
import Api from 'src/api/Api'
import { IssueList, IssueFilter, SortBy, AttachmentInfo, IssueAddForm } from 'src/types'
import { Grievance, GrievanceInputPatch } from 'src/models/Grievance'

class IssueApi extends Api {
  #formData = new FormData()
  #headers = {
    'Content-Type': 'multipart/form-data'
  }

  async getIssues (page: number, filterBy: IssueFilter, sortBy: SortBy[], perPage = 25): Promise<IssueList> {
    const params = this.purgeParams(page, perPage, filterBy, sortBy)
    const {
      items,
      totalPages,
      totalItemCount
    } = (await this.axios.get('/crm/api/v2/issue', { params })).data
    return {
      totalPages,
      totalItemCount,
      items: items.map((item: any) => new IssueModel(item))
    }
  }

  async createCsvLink (filterBy: IssueFilter): Promise<AttachmentInfo> {
    return (await this.axios.post('/crm/api/v2/issue/create-csv-link', { filterBy })).data
  }

  async getIssue (id: number): Promise<IssueModel> {
    const item = (await this.axios.get(`/crm/api/v2/issue/${id}`)).data
    return new IssueModel(item)
  }

  async getGrievance (id: number): Promise<Grievance> {
    return (await this.axios.get(`/crm/api/v2/issue/${id}`)).data as Grievance
  }

  async saveDescription (issueId: number, description: string, type: string) : Promise<IssueModel> {
    const issue = (await this.axios.post(`/crm/api/v2/issue/${issueId}/save-description/${type}`, { description })).data
    return new IssueModel(issue)
  }

  async add (data: IssueAddForm) {
    return (await this.axios.post('/crm/api/v2/issue', data)).data
  }

  async edit (data: GrievanceInputPatch, id: number) {
    return (await this.axios.patch(`/crm/api/v2/issue/${id}`, data)).data as Grievance
  }
}

export default IssueApi
