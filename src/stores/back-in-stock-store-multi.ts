import useStoreFactory from 'src/composables/useStoreFactory'
import { computed, Ref, ref, watch } from 'vue'
import { BackInStockItemInterface, NotifyType } from 'src/types'
import BackInStockApi from 'src/api/BackInStockApi'
import { api } from 'boot/axios'

const { useStore } = useStoreFactory('back-in-stock', () => {
  const customerId: Ref<number> = ref(0)

  const items: Ref<BackInStockItemInterface[]> = ref<BackInStockItemInterface[]>([])
  const loading = ref(false)
  const isLoaded = ref(false)
  const isSkuInList = (sku: string) => {
    return items.value.some(item => item.product.sku === sku)
  }
  let firstLoadCallback: null | (() => void) = null

  const reload = async () => {
    loading.value = true
    items.value = await (new BackInStockApi(api)).get(customerId.value)
      .finally(() => {
        loading.value = false
      })
  }

  const removeSku = async (sku: string) => {
    await (new BackInStockApi(api)).remove(sku, customerId.value)
    reload()
      .finally()
  }

  const addSku = async (sku: string, noticeType: NotifyType, noticeTarget: string) => {
    await (new BackInStockApi(api)).add(sku, customerId.value, noticeType, noticeTarget)
    reload()
      .finally()
  }

  const inStockItems = computed(() => {
    return items.value.filter(item => item.product.inStockAmount > 0)
  })

  const inStockItemsCount = computed(() => {
    return inStockItems.value.length
  })

  const onFirstLoad = (callback?: () => void) => {
    if (!callback) return
    firstLoadCallback = callback
  }
  const onFirstLoadCall = () => {
    if (!firstLoadCallback) return

    if (isLoaded.value) {
      firstLoadCallback()
    } else {
      const unwatch = watch(isLoaded, (value) => {
        if (value) {
          if (firstLoadCallback) {
            firstLoadCallback()
          }
          unwatch()
        }
      })
    }
  }

  return {
    customerId,
    items,
    loading,
    isLoaded,
    inStockItems,
    inStockItemsCount,
    isSkuInList,
    removeSku,
    addSku,
    reload,
    onFirstLoad,
    onFirstLoadCall
  }
}, {
  maxInstancesCount: 10,
  onInit: async (entryId, store) => {
    store.customerId = entryId

    store.items = await (new BackInStockApi(api)).get(entryId)
      .finally(() => {
        store.loading = false
        store.isLoaded = true
      })

    store.onFirstLoadCall()
  }
})

export const useBackInStockStore = useStore
