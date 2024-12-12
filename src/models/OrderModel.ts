import AttachmentModel, { AttachmentModelData } from 'src/models/AttachmentModel'
import CustomerModel, { CustomerBasicInterface } from 'src/models/CustomerModel'
import AddressModel, { AddressInputInterface, AddressInterface, AddressModelAbstract } from 'src/models/AddressModel'
import OrderRowModel, { OrderRowInterface, OrderRowPaymentInfoInterface } from 'src/models/OrderRowModel'
import MemberModel, { MemberBasicInterface } from 'src/models/MemberModel'
import NoteModel from 'src/models/NoteModel'
import { NoteBasic } from 'src/models/NoteModelShort'
import { CallBasic } from 'src/models/CallModel'
import { OrderType } from 'src/types'
import { OrderActivePaymentInterface, PaymentDetailsInterface } from 'src/models/Payments'
import { StaffBasicInterface } from 'src/models/facility/StaffModel'

export interface OrderPaymentInfoInterface {
  id: number;
  price: string;
  itemsSubtotal: string;
  itemsUnDiscountedSubtotal: string;
  rows: OrderRowPaymentInfoInterface[];
}

export interface OrderBasicInterface {
  id: number
  address?: AddressInterface
  carrierName?: string
  attachments: AttachmentModelData[]
  createdAt: string
  updatedAt: string
  shippedAt?: string
  notes: NoteBasic[]
  call?: CallBasic
  phone: string
  email: string
  noteForPostman?: string
  rows: OrderRowInterface[]
  type: OrderType
  customer: CustomerBasicInterface
  statusName: string
  totalPaid: string
  totalRefundSum: string
  returned: boolean
  refundable: boolean
  partiallyRefundable: boolean
  rejectable: boolean
  deliveryDate?: string
  estimateDeliveryDate: string
  price: string
  deliveryCustomerPrice: string
  status: number
  trackingLink?: string
  trackingNumber?: string
  returnWindow: string
  promoCode: string
  onBehalfOfPOA: boolean
  performer?: MemberBasicInterface
  isOrderDraft: boolean
  isCreated: boolean
}

export interface OrderInterface extends OrderBasicInterface {
  itemsSubtotal: string
  itemsUnDiscountedSubtotal: string
  promosAttached: {
    promoName: string
    type: string
  }[]
  promosAppliedTotal: string
  activePayment: OrderActivePaymentInterface | null
  staff?: StaffBasicInterface
}

export interface OrderModelData {
  id: number
  address: Record<string, string>
  customer: object
  attachments: AttachmentModelData[]
  createdAt: string
  deliveryDate: string
  estimateDeliveryDate: string
  email: string
  price: string
  status: number
  statusName: string
  type: string
  carrierName?: string
  shippedAt?: string
  trackingLink?: string
  trackingNumber?: string
  returned: boolean
  refundable: boolean
  rejectable: boolean
  rows: object[]
  notes: object[]
  onBehalfOfPOA: boolean
  phone: string
  noteForPostman: string
  performer?: MemberModel
  totalPaid: string
  totalRefundSum: string
  isOrderDraft: boolean
  isCreated: boolean
}

class OrderModel {
  id: number
  address: AddressModel | null
  customer: CustomerModel | null
  attachments: AttachmentModel[] = []
  createdAt: string
  deliveryDate?: string
  email: string
  estimateDeliveryDate?: string
  price: string
  status: number
  statusName: string
  type: string
  carrierName?: string
  shippedAt?: string
  trackingLink?: string
  trackingNumber?: string
  returned: boolean
  refundable: boolean
  rejectable: boolean
  rows: OrderRowModel[] = []
  phone: string
  noteForPostman: string
  notes: NoteModel[] = []
  onBehalfOfPOA: boolean
  performer: MemberModel | null = null
  totalPaid: string
  totalRefundSum: string
  isOrderDraft = false
  isCreated = false

  constructor ({
    id,
    address,
    customer,
    attachments,
    createdAt,
    deliveryDate,
    estimateDeliveryDate,
    price,
    status,
    statusName,
    type,
    carrierName,
    shippedAt,
    trackingLink,
    trackingNumber,
    returned,
    refundable,
    rejectable,
    rows,
    notes,
    phone,
    email,
    noteForPostman,
    onBehalfOfPOA,
    performer,
    totalPaid,
    totalRefundSum,
    isOrderDraft,
    isCreated
  }: OrderModelData) {
    this.id = id
    this.customer = customer ? new CustomerModel(customer) : null
    this.address = address ? new AddressModel(address) : null
    this.createdAt = createdAt || ''
    this.deliveryDate = deliveryDate || ''
    this.estimateDeliveryDate = estimateDeliveryDate || ''
    this.price = price || ''
    this.status = status || 0
    this.statusName = statusName || ''
    this.type = type
    this.carrierName = carrierName
    this.shippedAt = shippedAt
    this.trackingLink = trackingLink
    this.trackingNumber = trackingNumber
    this.returned = returned
    this.refundable = refundable
    this.rejectable = rejectable
    this.phone = phone
    this.email = email
    this.noteForPostman = noteForPostman
    this.onBehalfOfPOA = onBehalfOfPOA
    this.totalPaid = totalPaid
    this.totalRefundSum = totalRefundSum
    this.isOrderDraft = isOrderDraft
    this.isCreated = isCreated

    if (attachments) {
      this.attachments = attachments.map((attachment: AttachmentModelData) => new AttachmentModel(attachment))
    }
    if (rows) {
      this.rows = rows.map((row: object) => new OrderRowModel(row))
    }
    if (performer) {
      this.performer = new MemberModel(performer)
    }
    if (notes) {
      this.notes = notes.map((note: any) => new NoteModel(note))
    }
  }
}

export type OrderModelSubset = {
  [P in keyof OrderModelData]?: OrderModelData[P]
}

export function addressInputFromData (data: AddressModel | AddressModelAbstract): AddressInputInterface {
  const subset = (({
    addressOptionalString,
    addressString,
    city,
    county,
    company,
    firstName,
    lastName,
    note,
    phone,
    state,
    zipCode,
    type
  }) => ({
    addressOptionalString,
    addressString,
    city,
    county,
    company,
    firstName,
    lastName,
    note,
    phone,
    state,
    zipCode,
    type
  }))(data)

  if (subset.phone) {
    subset.phone = subset.phone.replace(/\D/g, '')
  }

  return subset
}

export type OrderInput = {
  carrierName: string
  noteForPostman: string
  notes: string
  userNotes: string
  call: number
  email: string
  address: string
  faxAttachments?: string
  onBehalfOfPOA: boolean
  phone: string
  promoCode: string
}
export type OrderInputPatch = {
  [P in keyof OrderInput]?: OrderInput[P]
}

export default OrderModel
