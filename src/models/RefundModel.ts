import RefundListEntryModel from 'src/models/RefundListEntryModel'
import RefundRowModel from 'src/models/RefundRowModel'
import NoteModelShort from 'src/models/NoteModelShort'

export interface RefundBasic {
  readonly id: number
}

class RefundModel extends RefundListEntryModel {
  readonly rows: RefundRowModel[]
  readonly notes: NoteModelShort[]
  readonly deletable: boolean = false

  readonly order: {
    readonly id: number
    readonly issues: {id: number}[]
    readonly customer: {
      readonly id: number
      readonly name: string
    }
  }

  constructor (incomingData: any) {
    super(incomingData)

    this.rows = incomingData.rows.map((row: any) => new RefundRowModel(row))
    this.notes = incomingData.notes.map((note: any) => new NoteModelShort(note))
    this.deletable = incomingData.deletable

    this.order = {
      id: incomingData.order.id,
      customer: incomingData.order.customer,
      issues: incomingData.order.grievances
    }
  }
}

export default RefundModel
