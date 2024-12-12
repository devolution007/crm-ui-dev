import { defineStore, DefineStoreOptions, getActivePinia } from 'pinia'

type StoreFactoryReturnType<S> = ReturnType<typeof defineStore<string, DefineStoreOptions<string, S, undefined, undefined>>>
type StoreWithState<S> = ReturnType<StoreFactoryReturnType<S>>

/**
 * Multi-entry store factory
 *
 * @author Arciom Ryżankou
 *
 * @param storeName
 * @param storeSetup
 * @param options
 */
export default function useStoreFactory<NamePrefix extends string, SSetup> (storeName: NamePrefix, storeSetup: () => SSetup, options: {
  maxInstancesCount?: number
  onInit?: (entryIdInput: number, store: StoreWithState<SSetup>) => void
} = {}) {
  const stores = new Map<number, StoreWithState<SSetup>>()
  const storesUseTimestamps = new Map<number, number>()

  function createStoreFactory (entryIdInput: number) {
    const storeId = `${storeName}-${entryIdInput}`

    /**
     * "Setup store" syntax
     * @see https://pinia.vuejs.org/core-concepts/#setup-stores
     */
    const store = defineStore(storeId, storeSetup)()
    if (options.onInit) {
      options.onInit(entryIdInput, store as unknown as StoreWithState<SSetup>)
    }
    return store
  }

  function destroy (entryId: number) {
    const storeId = `${storeName}-${entryId}`
    const store = stores.get(entryId) as StoreWithState<SSetup>
    store.$dispose()
    const pinia = getActivePinia()
    if (pinia) {
      delete pinia.state.value[storeId]
    }
    stores.delete(entryId)
    storesUseTimestamps.delete(entryId)
  }

  /**
   * When you don't need a store anymore, you can destroy it.
   * https://pinia.vuejs.org/api/interfaces/pinia._StoreWithState.html#Methods-$dispose
   */
  const deleteStore = (entryId: number) => {
    if (stores.has(entryId)) {
      destroy(entryId)
    }
  }

  /**
   * Cleanup old stores to prevent memory leaks
   */
  const cleanupOldStores = () => {
    if (options.maxInstancesCount && stores.size > options.maxInstancesCount) {
      const oldestStoreEntryId = Array.from(storesUseTimestamps.entries()).sort((a, b) => a[1] - b[1])[0][0]
      if (!oldestStoreEntryId) {
        return
      }
      if (!stores.has(oldestStoreEntryId)) {
        storesUseTimestamps.delete(oldestStoreEntryId)
        return
      }
      deleteStore(oldestStoreEntryId)
    }
  }

  const useStore = (entryIdInput: number): StoreWithState<SSetup> => {
    if (!stores.has(entryIdInput)) {
      stores.set(entryIdInput, createStoreFactory(entryIdInput) as unknown as StoreWithState<SSetup>)
      storesUseTimestamps.set(entryIdInput, Date.now())
    }
    cleanupOldStores()
    return stores.get(entryIdInput) as StoreWithState<SSetup>
  }

  return {
    useStore,
    deleteStore
  }
}
