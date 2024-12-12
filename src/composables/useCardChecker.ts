import { ref, Ref } from 'vue'
import InsuranceCardsApi from 'src/api/InsuranceCardsApi'
import { api } from 'boot/axios'
import { insuranceCardInfo } from 'src/models/InsuranceCardModel'
// Singleton

const cardNumber: Ref<string> = ref('')
const cvv: Ref<string> = ref('')
const lastResult: Ref<insuranceCardInfo | null> = ref(null)
const check = async () => {
  lastResult.value = null
  const result = await (new InsuranceCardsApi(api)).checkRequisites(cardNumber.value, cvv.value)
  lastResult.value = result
  return result
}
const reset = () => {
  cardNumber.value = ''
  cvv.value = ''
  lastResult.value = null
}
export default function useCardChecker () {
  return {
    cardNumber,
    cvv,
    lastResult,
    check,
    reset
  }
}
