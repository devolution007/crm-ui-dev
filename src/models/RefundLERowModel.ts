class RefundLERowModel {
  readonly reason: number
  readonly id: number
  readonly price: string
  readonly status: number
  readonly rejected: boolean
  readonly hasInactiveStatus: boolean

  constructor ({
    reason,
    id,
    price,
    status,
    rejected,
    hasInactiveStatus
  }: { reason: number, id: number, price: string, status: number, rejected: boolean, hasInactiveStatus: boolean }) {
    this.reason = reason
    this.id = id
    this.price = price
    this.status = status
    this.rejected = rejected
    this.hasInactiveStatus = hasInactiveStatus
  }
}

export default RefundLERowModel
