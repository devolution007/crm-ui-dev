import Api from 'src/api/Api'
import { CustomerNote, CustomerNoteInput, CustomerNotePatch } from 'src/models/NoteModelShort'

class NoteApi extends Api {
  async addNote (noteInput: CustomerNoteInput, customerId: number): Promise<CustomerNote> {
    return (
      await this.axios.post(`/crm/api/v2/customer/${customerId}/note`, noteInput)
    ).data as CustomerNote
  }

  async patchNote (noteId: number, notePatch: CustomerNotePatch, customerId: number): Promise<CustomerNote> {
    return (
      await this.axios.patch(`/crm/api/v2/customer/${customerId}/note/${noteId}`, notePatch)
    ).data as CustomerNote
  }
}

export default NoteApi
