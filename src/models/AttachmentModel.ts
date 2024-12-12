export interface AttachmentModelData {
  id: number
  name: string
  faxType?: string
  faxCreatedAt?: string
}

class AttachmentModel {
  id: number
  name: string
  faxType: string | null
  faxCreatedAt: string | null

  constructor ({ id, name, faxType, faxCreatedAt }: AttachmentModelData) {
    this.id = id
    this.name = name
    this.faxType = faxType || null
    this.faxCreatedAt = faxCreatedAt || null
  }
}

export default AttachmentModel
