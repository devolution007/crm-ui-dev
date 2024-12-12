import { MemberBasicInterface } from 'src/models/MemberModel'
import { dayjs } from 'boot/dayjs'
import { TaskCommentInterface } from 'src/models/TaskComment'

/*

class TaskStatus {
  value: number
  label: string
  color: string
  icon: string
  constructor (statusId: number) {

    this = constants.TASK_STATUSES.find(t => t.value === statusId) || constants.TASK_STATUSES[0] as TaskStatus

    this.value = status
    this.label = label
    this.color = color
    this.icon = icon
  }
}
*/

export interface TaskBasicInterface {
  readonly id: number
  readonly description: string
  readonly createdAt: string
  readonly updatedAt?: string
  readonly status: number
  readonly member?: MemberBasicInterface
}

export interface TaskLEInterface extends TaskBasicInterface {
  readonly title: string
  readonly priority: number
  readonly category?: number | null
  readonly dateBefore: string
  readonly timeBefore: string
  readonly assignedTo: MemberBasicInterface
}

export interface TaskFullInterface extends TaskLEInterface {
  readonly customer: {
    readonly id: number
    readonly name: string
    readonly email: string
    readonly insuranceId: string
    readonly birthdateStr: string
  } | null
  readonly targetList: {
    readonly id: number
    readonly name: string
  } | null
  readonly facility: {
    readonly id: number
    readonly name: string
  } | null
  readonly order: {
    readonly id: number
    readonly createdAt: string
    readonly price: string
    readonly statusName: string
  } | null
  readonly issue: {
    readonly id: number
    readonly createdAt: string
    readonly category: string
  }
  readonly staff: {
    readonly id: number
    readonly name: string
  }
  readonly comments: TaskCommentInterface[]
}

export class CustomTaskFormModel {
  title: string
  description: string
  status: number
  priority: number
  category: number | null
  dateBefore: string
  timeBefore: string
  assignedTo: number | null
  customer: number | null
  facility: number | null
  order: number | null
  targetList: number | null
  issue: number | null
  staff: number | null

  constructor (task: TaskFullInterface | null = null) {
    this.title = task?.title || ''
    this.description = task?.description || ''
    this.status = task?.status || 0
    this.priority = task?.priority || 0
    this.category = task?.category || null
    this.dateBefore = ''
    if (task?.dateBefore) {
      this.dateBefore = dayjs.utc(task?.dateBefore).format('MM/DD/YYYY')
    }
    this.timeBefore = ''
    if (task?.timeBefore) {
      this.timeBefore = dayjs.utc(task?.timeBefore).format('HH:mm')
    }
    this.assignedTo = task?.assignedTo?.id || null
    this.customer = task?.customer?.id || null
    this.targetList = task?.targetList?.id || null
    this.facility = task?.facility?.id || null
    this.staff = task?.staff?.id || null
    this.order = task?.order?.id || null
    this.issue = task?.issue?.id || null
  }
}

export interface TaskPatchInterface {
  title?: string
  description?: string
  dateBefore?: string
  timeBefore?: string
  priority?: number
  status?: number
  customer?: number
  assignedTo?: number
  facility?: number
  order?: number
  staff?: number
  issue?: number
  targetList?: number
  category?: number | null
}

export interface ActivityChangeInterface {
  field: string
  old: string | null | object
  new: string | null | object
  oldRaw: string | null | number
  newRaw: string | null | number
}
export interface ActivityEntryInterface {
  createdAt: string
  guid: string
  member: MemberBasicInterface
  eventDescription: string
  changes: ActivityChangeInterface[]
}
