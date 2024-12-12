import RefundLERowModel from 'src/models/RefundLERowModel'

class RefundListEntryModel {
  readonly id: number
  readonly createdAt: string
  readonly price: string
  readonly reasons: number[]
  readonly rows: RefundLERowModel[]
  readonly attachments: any[]
  readonly refundableRows: boolean
  readonly order: {
    readonly id: number
    readonly customer: {
      readonly id: number
      readonly name: string
    }
  }

  readonly performer: {
    readonly id: number
    readonly name: string
    readonly firstName: string
    readonly lastName: string
  }

  constructor ({ id, createdAt, price, reasons, rows, attachments, order, refundableRows, performer }: any) {
    this.id = id
    this.createdAt = createdAt
    this.price = price
    this.reasons = reasons
    this.rows = rows.map((row: any) => new RefundLERowModel(row))
    this.order = order
    this.refundableRows = refundableRows
    this.performer = performer
    this.attachments = attachments
  }
}

export default RefundListEntryModel
