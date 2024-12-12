import { Ref, ref } from 'vue'
import { Notify } from 'quasar'

export default function useBackInStock (customerId: number) {
  const backInStockList: Ref<string[]> = ref([])

  const isInBackInStockList = (productSku: string) => {
    return backInStockList.value.includes(productSku)
  }

  const addToBackInStockList = (productSku: string) => {
    // todo: implement addToBackInStockList Dialog call

    backInStockList.value.push(productSku)
    Notify.create({
      message: 'Is not implemented yet'
    })
  }

  return { backInStockList, isInBackInStockList, addToBackInStockList }
}
