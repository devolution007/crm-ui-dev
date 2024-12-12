import { OrderBasicInterface } from 'src/models/OrderModel'
import { AttachmentModelData } from 'src/models/AttachmentModel'
import { MemberBasicInterface } from 'src/models/MemberModel'
import { CustomerBasicInterface } from 'src/models/CustomerModel'

export interface GrievanceBasic {
  id: number
  category: string
  status: string
  priority: string
}

export interface Grievance extends GrievanceBasic {
  todo: string
  order?: OrderBasicInterface
  member?: MemberBasicInterface
  customer?: CustomerBasicInterface
  isCallWithRepresentative: boolean
  isMemberInformed: boolean
  attachments: AttachmentModelData[]
  resolvedBy?: string
  createdAt: string
  complaintDescriptionJson: unknown[]
  actionsDescriptionJson: unknown[]
}

export type GrievanceInput = {
  todo: string
  category: string
  priority: string
  status: string
  copyTo: string
  isMemberInformed: boolean
  isCallWithRepresentative: boolean
  attachments: number[]
}
export type GrievanceInputPatch = {
  [P in keyof GrievanceInput]?: GrievanceInput[P]
}
