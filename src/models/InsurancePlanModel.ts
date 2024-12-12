export interface InsurancePlanData {
  id: number
  frequency: string
  amount: string
  name: string
  organizationPlanId: string
}

export interface InsurancePlanBasic {
  id: number
  name: string
  code: string
}

export class InsurancePlanModel {
  id: number
  frequency: string
  amount: string
  name: string

  organizationPlanId?: string
  constructor (data: InsurancePlanData) {
    this.id = data.id
    this.frequency = data.frequency
    this.amount = data.amount
    this.name = data.name
    this.organizationPlanId = data.organizationPlanId
  }
}
