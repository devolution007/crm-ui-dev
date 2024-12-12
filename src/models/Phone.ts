
export interface PhoneInterface {
  id?: number
  phone: string
  formattedPhone?: string
  callType?: string | null
  type?: string
  isValid?: boolean
  isAvailableCalls?: boolean
  isAvailableSms?: boolean
}
