import RefundLERowModel from 'src/models/RefundLERowModel'

class RefundRowModel extends RefundLERowModel {
  readonly sku: {
    readonly id: number
    readonly name: string
    readonly price: string
    readonly mainImage: string
  }

  readonly statusText: string
  readonly isPending: boolean = false
  readonly isRejected: boolean = false
  readonly isRefunded: boolean = false
  readonly isReversed: boolean = false
  readonly isReversible: boolean = false
  readonly rejectReason: number|null = null
  readonly reverseReason: number|null = null

  constructor (incomingData: any) {
    super(incomingData)

    this.sku = incomingData.sku
    this.statusText = incomingData.statusText

    if (incomingData.refundable && incomingData.rejectable) {
      this.isPending = true
    }

    if (incomingData.rejected) {
      this.isRejected = true
      this.rejectReason = incomingData.rejectReason
    }
    if (incomingData.refunded) {
      this.isRefunded = true
      if (incomingData.reversable) {
        this.isReversible = true
      }
    }
    if (incomingData.reversed) {
      this.isReversed = true
      this.reverseReason = incomingData.reverseReason
    }
  }
}

export default RefundRowModel
