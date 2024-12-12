import { defineStore } from 'pinia'
import { IInsuranceCardPatch, InsuranceCardDto, InsuranceCardModel } from 'src/models/InsuranceCardModel'
import { computed, ref, watch } from 'vue'
import { useCustomerStore } from 'stores/customer-store'
import InsuranceCardsApi from 'src/api/InsuranceCardsApi'
import { api } from 'boot/axios'

export const useInsuranceCardsStore = defineStore('insuranceCards', () => {
  const insuranceCards = ref<InsuranceCardModel[]>([])
  const activeCardId = ref<number | null>(null)
  const loading = ref(false)
  const activeCard = computed(() => {
    return insuranceCards.value.find((item: InsuranceCardModel) => item.active) || null
  })
  const activeCardBalance = computed(() => {
    return activeCard.value?.balance || 0
  })

  const customerStore = useCustomerStore()

  const clearInsuranceCards = () => {
    insuranceCards.value = []
  }

  const loadInsuranceCards = async (customerId: number) => {
    await customerStore.init(customerId)
    insuranceCards.value = customerStore.customer?.insuranceCards || []
    activeCardId.value = insuranceCards.value.find((card) => card.active)?.id || null
  }

  watch(() => customerStore.customer?.id, (customerId) => {
    clearInsuranceCards()
    if (customerId !== null) {
      loadInsuranceCards(customerId)
        .finally()
    }
  })

  if (customerStore.customer.id) {
    loadInsuranceCards(customerStore.customer.id)
      .finally()
  }

  const getCardInfo = async (card: InsuranceCardModel, cvv: string) => {
    const info = await new InsuranceCardsApi(api).checkInsuranceCardById(card.id, cvv)
    const cardIndex = insuranceCards.value.findIndex((item) => item.id === card.id)
    insuranceCards.value[cardIndex].balance = info.balance
    return info
  }

  const addCard = async (cardDto: InsuranceCardDto): Promise<InsuranceCardModel> => {
    const card = await new InsuranceCardsApi(api).addCard(customerStore.customer.id, cardDto)
    insuranceCards.value.push(card)
    return card
  }

  const deleteCard = async (card: InsuranceCardModel) => {
    await new InsuranceCardsApi(api).deleteCard(customerStore.customer.id, card.id)
    insuranceCards.value = insuranceCards.value.filter((item) => item.id !== card.id)
  }

  const updateCard = async (card: InsuranceCardModel, data: IInsuranceCardPatch) => {
    await new InsuranceCardsApi(api).patchCard(customerStore.customer.id, card.id, data)
    /* insuranceCards.value = insuranceCards.value.map((item) => {
      if (item.id === updatedCard.id) {
        return new InsuranceCardModel(updatedCard)
      }
      return item
    }) */

    await customerStore.getCustomer(customerStore.customer.id)
  }

  const activateCard = async (card: InsuranceCardModel) => {
    return await updateCard(card, { active: true })
  }

  const deactivateCard = async (card: InsuranceCardModel) => {
    return await updateCard(card, { active: false })
  }

  return {
    insuranceCards,
    activeCard,
    activeCardBalance,
    loading,
    activateCard,
    deactivateCard,
    loadInsuranceCards,
    getCardInfo,
    addCard,
    deleteCard,
    clearInsuranceCards
  }
})
