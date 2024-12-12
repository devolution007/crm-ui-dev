import CustomerModel, { CustomerBasicInterface, CustomerInCall } from 'src/models/CustomerModel'
import MemberModel, { MemberBasicInterface } from 'src/models/MemberModel'
import OrderModel, { OrderBasicInterface } from 'src/models/OrderModel'
import IssueModel from 'src/models/IssueModel'
import { GrievanceBasic } from 'src/models/Grievance'

export interface CallBasic {
  type: string
  id: number
}

export interface CallDetailed extends CallBasic {
  operator: MemberBasicInterface
  user: CustomerInCall
  category: string
  resolution: string
  startedAt: string
  orders: OrderBasicInterface[]
  grievances: GrievanceBasic[]
  categoryText: string
  currentDuration: number
}

/**
 * @deprecated Use Call Interfaces instead
 */
class CallModel {
  readonly id: number
  readonly type: 'outbound' | 'inbound' | 'order'
  readonly startedAt: string
  readonly currentDuration: number
  member?: MemberModel
  customer?: CustomerModel
  readonly category?: string
  readonly orders?: OrderModel[]
  readonly resolution?: string
  readonly issues?: IssueModel[]

  constructor({ id, type, startedAt, currentDuration, user, operator, category, orders, resolution, grievances }: any) {
    this.id = id
    this.type = type
    this.startedAt = startedAt
    this.currentDuration = currentDuration
    this.customer = user && new CustomerModel(user)
    this.member = operator && new MemberModel(operator)
    this.category = category
    this.orders = orders?.map((item: any) => new OrderModel(item))
    this.resolution = resolution
    this.issues = grievances?.map((item: any) => new IssueModel(item)) ?? []
  }
}

export default CallModel
