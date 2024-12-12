import { MemberBasicInterface } from 'src/models/MemberModel'

export interface NoteBasic {
  text: string
  id: number
  addedAtEst: string
  authorName: string
  addedBy: MemberBasicInterface
}

export interface CustomerNote extends NoteBasic {
  isShow: boolean
  isForOrder: boolean
}

export type CustomerNoteInput = {
  text: string
}
export type CustomerNotePatch = Partial<CustomerNote>

class NoteModelShort {
  id: number
  text: string
  authorName: string
  addedAtEst: string

  constructor (incomingData: any) {
    this.id = incomingData.id
    this.text = incomingData.text
    this.authorName = incomingData.authorName
    this.addedAtEst = incomingData.addedAtEst
  }
}

export default NoteModelShort
