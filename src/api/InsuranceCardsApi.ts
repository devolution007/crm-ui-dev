import Api from 'src/api/Api'
import {
  IInsuranceCardPatch,
  InsuranceCardData, InsuranceCardDto,
  insuranceCardInfo,
  InsuranceCardInfoModel,
  InsuranceCardModel
} from 'src/models/InsuranceCardModel'

class InsuranceCardsApi extends Api {
  async checkInsuranceCardById (cardId: number, cvv: string): Promise<insuranceCardInfo> {
    return (await this.axios.post(`/crm/api/v2/insurance-card/card-id-info/${cardId}`, {
      cvv
    })).data
  }

  async addCard (customerId: number, card: InsuranceCardDto): Promise<InsuranceCardModel> {
    const cardNew = (await this.axios.post(`/crm/api/v2/customer/${customerId}/insurance-cards`, card)).data
    return new InsuranceCardModel(cardNew)
  }

  async deleteCard (customerId: number, cardId: number): Promise<void> {
    await this.axios.delete(`/crm/api/v2/customer/${customerId}/insurance-cards/${cardId}`)
  }

  async patchCard (customerId: number, cardId: number, data: IInsuranceCardPatch): Promise<InsuranceCardData> {
    return (
      await this.axios.patch(`/crm/api/v2/customer/${customerId}/insurance-cards/${cardId}`, data)
    ).data as InsuranceCardData
  }

  async checkRequisites (cardNumber: string, cvv: string): Promise<insuranceCardInfo> {
    const cardData: insuranceCardInfo = (await this.axios.post('/crm/api/v2/insurance-card/card-info-phc', {
      cardNumber,
      cvv
    })).data
    return new InsuranceCardInfoModel(cardData)
  }
}

export default InsuranceCardsApi
