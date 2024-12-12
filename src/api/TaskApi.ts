import Api from 'src/api/Api'
import {
  SortBy,
  TaskList,
  TasksFilter, ContactRequestFilter, ContactRequestList,
  AttachmentInfo
} from 'src/types'
import {
  ActivityEntryInterface,
  CustomTaskFormModel, TaskFullInterface,
  TaskLEInterface,
  TaskPatchInterface
} from 'src/models/TaskModel'
import { axios } from 'boot/axios'
import { dayjs } from 'boot/dayjs'
import { TaskCommentInterface } from 'src/models/TaskComment'
import ContactRequestModel from 'src/models/ContactRequestModel'

class TaskApi extends Api {
  async getList (page: number, filterBy: TasksFilter, sortBy: SortBy, perPage = 25): Promise<TaskList> {
    const params = {
      page, perPage, filterBy, sortBy
    }
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/task', { params })).data
    return {
      totalPages,
      items: items.map((item: TaskLEInterface) => item),
      totalItemCount
    }
  }

  async getEntry (id: number): Promise<TaskFullInterface> {
    const item = (await this.axios.get(`/crm/api/v2/task/${id}`)).data
    return item
    // new TaskFullModel(item)
  }

  async patch (id: number, update: TaskPatchInterface) {
    return (await this.axios.patch(`crm/api/v2/task/${id}`, this.normalizeTaskFields(update))).data
  }

  async create (task: CustomTaskFormModel) {
    return (await this.axios.post('crm/api/v2/task', this.normalizeTaskFields(task))).data
  }

  protected normalizeTaskFields (task: Partial<CustomTaskFormModel>) {
    if (task.dateBefore) task.dateBefore = dayjs(task.dateBefore).format('YYYY-MM-DD')
    return this.nullToZero(task)
  }

  async massUpdate (ids: number[], update: TaskPatchInterface) {
    await axios.all(ids.map(id => this.patch(id, update)))
      .then(axios.spread(({ ...responses }) => {
        console.log('mu', 'massUpdate Completed (in TaskApi)', responses)
        return responses
      }))
  }

  async getActivity (id: number) {
    const items = (await this.axios.get(`/crm/api/v2/task/${id}/activity`)).data
    return items.map((item: ActivityEntryInterface) => item)
  }

  async getContactRequestItems (page: number, filterBy: ContactRequestFilter, sortBy: SortBy[], perPage = 25): Promise<ContactRequestList> {
    const params = this.purgeParams(page, perPage, filterBy, sortBy)
    const {
      items,
      totalPages,
      totalItemCount
    } = (await this.axios.get('/crm/api/v2/task/request-contact', { params })).data
    return {
      items: items.map((item: any) => new ContactRequestModel(item)),
      totalPages,
      totalItemCount
    }
  }

  async delete (taskId: number): Promise<void> {
    await this.axios.delete(`/crm/api/v2/task/${taskId}`)
  }

  async getComments (taskId: number): Promise<{ items: TaskCommentInterface[] }> {
    const { items } = (await this.axios.get(`/crm/api/v2/task/${taskId}/comments`)).data
    return { items: items.map((item: TaskCommentInterface) => item) }
  }

  async createComment (taskId: number, comment: { description: string }): Promise<TaskCommentInterface> {
    return (await this.axios.post(`/crm/api/v2/task/${taskId}/comment`, comment)).data
  }

  async deleteComment (commentId: number): Promise<void> {
    await this.axios.delete(`/crm/api/v2/task/comment/${commentId}`)
  }

  async createTaskCsv (): Promise<AttachmentInfo> {
    const params = {
      filterBy: {
        status: [
         0,
         20
      ]} 
    }
    return (await this.axios.post('/crm/api/v2/task/download', params)).data
  }

  // createFromCustomerRequest (type, customerId, task) {
  //   return this.axios.post(`/csr/api/ajax/tasks/create-customer-request/${type}/${customerId}`, task)
  // }
  //
  // create (type, task) {
  //   return this.axios.post(`/csr/api/ajax/tasks/create/${type}`, task)
  // }
  //
  // get (id) {
  //   return this.axios.post(`/some-get-url${id}`)
  // }
}

export default TaskApi
