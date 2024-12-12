export interface EmailData {
  id?: number
  value?: string
  reg?: boolean
  isValid?: boolean
  allowMarketing?: boolean
}

export class EmailModel {
  id: number | null
  allowMarketing: boolean
  isValid: boolean
  reg: boolean
  value: string

  constructor ({ id, allowMarketing, isValid, reg, value }: EmailData = {}) {
    this.id = id || null
    this.allowMarketing = (allowMarketing !== undefined) ? allowMarketing : true
    this.isValid = (isValid !== undefined) ? isValid : true
    this.reg = (reg !== undefined) ? reg : false
    this.value = value || ''
  }
}

export default EmailModel
