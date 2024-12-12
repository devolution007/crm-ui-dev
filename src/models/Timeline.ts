import { MemberBasicInterface } from 'src/models/MemberModel'
import { CallBasic } from 'src/models/CallModel'
import { RefundBasic } from 'src/models/RefundModel'
import { TaskLEInterface } from 'src/models/TaskModel'
import { List } from 'src/types'
import { OrderInterface } from 'src/models/OrderModel'

export interface TimelineEntry {
  guid: string
  eventCode: string
  eventDescription: string
  member: null | MemberBasicInterface
  call: null | CallBasic
  refund: null | RefundBasic
  task: null | TaskLEInterface
  order: null | OrderInterface
  createdAt: string
  attributes: {
    [key: string]: unknown
  }
}

export interface TimelineList extends List {
  readonly items: TimelineEntry[]
}

export interface TimelineFilter {
  readonly member: number | null
}
