import { computed, Ref, ref } from 'vue'
const virtualTempBalances: Ref<Record<string, number>> = ref({})
const virtualTempCard: Ref<Record<string, string>> = ref({})

export default function useVirtualTempCard (customerId: number) {
  const virtualTempBalance = computed(() => {
    return virtualTempBalances.value[customerId.toString()] || 0
  })

  const setVirtualTempBalance = (balance: number | string) => {
    virtualTempBalances.value[customerId.toString()] = Number(balance)
  }

  const virtualTempCardNumber = computed(() => {
    return virtualTempCard.value[customerId.toString()] || ''
  })

  const setVirtualTempCardNumber = (cardNumber: string) => {
    virtualTempCard.value[customerId.toString()] = cardNumber
  }

  return {
    virtualTempBalance,
    setVirtualTempBalance,
    virtualTempCardNumber,
    setVirtualTempCardNumber
  }
}
