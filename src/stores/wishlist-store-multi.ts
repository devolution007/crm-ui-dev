import useStoreFactory from 'src/composables/useStoreFactory'
import { computed, Ref, ref, watch } from 'vue'
import { WishlistItemInterface } from 'src/types'
import WishlistApi from 'src/api/WishlistApi'
import { api } from 'boot/axios'

const { useStore } = useStoreFactory('wishlist', () => {
  const customerId: Ref<number> = ref(0)

  const items = ref<WishlistItemInterface[]>([])
  const loading = ref(false)
  const isSkuInWishlist = (sku: string) => {
    return items.value.some(item => item.product.sku === sku)
  }
  const fetchWishlist = async (customerId: number) => {
    loading.value = true
    let wishlist: WishlistItemInterface[] = []
    try {
      wishlist = await (new WishlistApi(api)).get(customerId)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
    return wishlist
  }

  watch(customerId, async (customerId) => {
    items.value = await fetchWishlist(customerId)
  })

  const reload = async () => {
    items.value = await fetchWishlist(customerId.value)
  }

  const isLoading = computed(() => {
    return loading.value
  })

  const addSkuToWishlist = async (sku: string) => {
    if (!customerId.value) {
      return
    }

    const newRow = await (new WishlistApi(api)).add(sku, customerId.value)
    reload().finally()
    return newRow
  }

  const removeSkuFromWishlist = async (sku: string) => {
    if (!customerId.value) {
      return
    }

    await (new WishlistApi(api)).remove(sku, customerId.value)
    reload().finally()
  }

  return {
    customerId,
    items,
    isLoading,
    isSkuInWishlist,
    reload,
    addSkuToWishlist,
    removeSkuFromWishlist
  }
}, {
  maxInstancesCount: 10,
  onInit: (entryId, store) => {
    store.customerId = entryId
  }
})

export const useWishlistStore = useStore
