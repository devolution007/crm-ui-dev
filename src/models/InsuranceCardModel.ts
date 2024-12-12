export interface InsuranceCardData {
  id: number
  status: number
  type: number
  createdAt: string
  active: boolean
  deleted: boolean
  balance: number
  balanceRenewalPeriod?: string
  balanceRollsOver?: string
  maskedNumber: string
  programCode?: string
  promoName?: string
  promoCode?: string
}

export interface IInsuranceCardPatch {
  active?: boolean
}

export interface insuranceCardInfo {
  balance: number
  programCode: string
  promoCode: string
  promoName: string
  statusCode: number
  statusReason: string
}

export class InsuranceCardInfoModel implements insuranceCardInfo {
  balance: number
  programCode: string
  promoCode: string
  promoName: string
  statusCode: number
  statusReason: string

  constructor (data: insuranceCardInfo) {
    this.balance = data.balance
    this.programCode = data.programCode
    this.promoCode = data.promoCode
    this.promoName = data.promoName
    this.statusCode = data.statusCode
    this.statusReason = data.statusReason
  }
}

export class InsuranceCardModel {
  id: number
  status: number
  type: number
  createdAt: string
  active: boolean
  deleted: boolean
  balance: number
  balanceRenewalPeriod?: string
  balanceRollsOver?: string
  maskedNumber: string
  programCode?: string
  promoName?: string
  promoCode?: string

  constructor (data: InsuranceCardData) {
    this.id = data.id
    this.status = data.status
    this.type = data.type
    this.createdAt = data.createdAt
    this.active = data.active
    this.deleted = data.deleted
    this.balance = data.balance || 0
    this.balanceRenewalPeriod = data.balanceRenewalPeriod
    this.balanceRollsOver = data.balanceRollsOver
    this.maskedNumber = data.maskedNumber
    this.programCode = data.programCode
    this.promoName = data.promoName
    this.promoCode = data.promoCode
  }
}

export class InsuranceCardDto {
  balanceRollsOver?: boolean
  balanceRenewalPeriod?: string
  cardNumber?: string
  cvv?: string
  phcOrganizationId?: string
  benefitName?: string

  constructor (data: InsuranceCardDto = {}) {
    this.balanceRenewalPeriod = data.balanceRenewalPeriod || ''
    this.balanceRollsOver = data.balanceRollsOver || false
    this.cardNumber = data.cardNumber || ''
    this.cvv = data.cvv || ''
    this.phcOrganizationId = data.phcOrganizationId || ''
    this.benefitName = data.benefitName || ''
  }
}
