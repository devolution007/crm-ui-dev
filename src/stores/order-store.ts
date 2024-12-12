import { defineStore } from 'pinia'
import { computed, ComputedRef, ref, Ref, watch } from 'vue'
import { Notify, runSequentialPromises } from 'quasar'
import OrderApi from 'src/api/OrderApi'
import { api } from 'boot/axios'
import { OrderInputPatch, OrderInterface } from 'src/models/OrderModel'
import { constants } from 'boot/constants'
import { PaymentMethodInterface } from 'src/types'
import { OrderRowInputInterface } from 'src/models/OrderRowModel'
import FileApi from 'src/api/FileApi'
import { useCustomerStore } from 'stores/customer-store'

export const useOrderStore = defineStore('order', () => {
  const orderId: Ref<number | undefined> = ref(undefined)
  const loading = ref(false)
  const checkoutLoading = ref(false)
  const payLoading = ref(false)
  const order: Ref<OrderInterface | undefined> = ref(undefined)

  const fetchOrder = async (id: number) => {
    return await (new OrderApi(api)).getOrder(id)
      .finally()
  }

  const loadOrder = async (id: number | undefined = undefined) => {
    if (!id) {
      if (!orderId.value) return
      id = orderId.value
    }
    loading.value = true
    order.value = await fetchOrder(id)
      .finally(() => {
        loading.value = false
      })
  }

  const isOrderReady = computed(() => {
    return !!orderId.value && !loading.value && order.value !== undefined && order.value.id === orderId.value
  })

  const isAddressSelected = computed(() => {
    if (!order.value) return false
    if (!order.value.address) return false
    if (order.value?.address?.addressString === '' && order.value?.address?.type === '') return false
    return true
  })

  const isOrderHasEditableStatus = computed(() => {
    if (!order.value) return false
    return [constants.ORDER_STATUS_CREATED].includes(order.value.status)
  })

  const faxAttachmentType = computed(() => {
    if (!isOrderReady.value || !order.value || order.value.attachments.length === 0) return null

    const attachments = order.value.attachments
    const faxAttachment = attachments.find(attachment => !!attachment.faxType)
    if (!faxAttachment) return null
    return faxAttachment.faxType
  })

  const whenOrderReady = (callback: () => void) => {
    if (isOrderReady.value) {
      callback()
      return
    }

    const watcherStop = watch(isOrderReady, (val) => {
      if (val) {
        callback()
        watcherStop()
      }
    }, { immediate: true })
  }

  /**
   * todo: refactor, simplify and remove callback in favor of promise
   */
  const init = (id: number, callback?: () => void): Promise<Ref<OrderInterface>> => {
    if (orderId.value === id) {
      return new Promise((resolve) => {
        whenOrderReady(() => {
          resolve(order as Ref<OrderInterface>)
        })
      })
    }
    orderId.value = id
    if (callback) {
      whenOrderReady(callback)
      loadOrder()
        .finally()
      return new Promise((resolve) => {
        whenOrderReady(() => {
          resolve(order as Ref<OrderInterface>)
        })
      })
    } else {
      loadOrder()
        .finally()

      return new Promise((resolve) => {
        whenOrderReady(() => {
          resolve(order as Ref<OrderInterface>)
        })
      })
    }
  }

  const initWatch = (id: ComputedRef<number>) => {
    watch(id, (val) => {
      if (orderId.value === val) return
      orderId.value = id.value
      loadOrder()
        .finally()
    }, { immediate: true })
  }

  const cancelOrder = async (id: number) => {
    return await (new OrderApi(api)).voidOrder(id)
      .finally()
  }

  const cancel = async () => {
    if (!orderId.value) return
    loading.value = true
    const updatedOrder = await cancelOrder(orderId.value)
      .finally(() => {
        loading.value = false
      })
    order.value = Object.assign({}, updatedOrder)
  }

  const deleteDraftOrder = async (id: number) => {
    return await (new OrderApi(api)).deleteDraft(id)
      .finally()
  }

  const deleteFaxAttachments = async () => {
    if (!orderId.value) return
    loading.value = true
    const fileApi = (new FileApi(api))

    const attachments = order.value?.attachments || []
    const faxAttachments = attachments.filter(attachment => !!attachment.faxType)

    const sequentialMap = []
    for (const attachment of faxAttachments) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sequentialMap.push((resultAggregator: {[p: string]: string}) => fileApi.attachmentDelete(attachment.id))
    }
    runSequentialPromises(
      sequentialMap
    )
      .then(() => {
        loadOrder()
          .finally()
      })
      .catch(errResult => {
        console.error(errResult)
        console.error(`Error encountered on job #${errResult.key}:`)
        console.error(errResult.reason)
        console.log('Managed to get these results before this error:')
        console.log(errResult.resultAggregator)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const deleteDraft = async () => {
    if (!orderId.value) return
    loading.value = true
    await deleteDraftOrder(orderId.value)
      .finally(() => {
        loading.value = false
      })
  }

  const updateOrderFields = async (id: number, fields: OrderInputPatch) => {
    return await (new OrderApi(api)).updateOrderFields(id, fields)
      .finally()
  }

  const updateFields = async (fields: OrderInputPatch, silent = true) => {
    if (!orderId.value) return
    if (!silent) {
      loading.value = true
    }

    const updatedOrder = await updateOrderFields(orderId.value, fields)
      .finally(() => {
        if (!silent) {
          loading.value = false
        }
      })
    order.value = Object.assign({}, updatedOrder)
  }

  const replaceRows = async (rows: OrderRowInputInterface[]) => {
    if (!orderId.value) return
    loading.value = true
    const updatedOrder = await (new OrderApi(api)).replaceRows(orderId.value, rows)
      .finally(() => {
        loading.value = false
      })
    order.value = Object.assign({}, updatedOrder)
  }

  const checkout = async () => {
    if (!orderId.value) return
    checkoutLoading.value = true
    const updatedOrder = await (new OrderApi(api)).checkoutOrder(orderId.value)
      .finally(() => {
        checkoutLoading.value = false
      })
    order.value = Object.assign({}, updatedOrder)
  }

  const recalculateOrder = async (id: number) => {
    const updatedOrder = await (new OrderApi(api)).recalculateOrder(id)
      .finally()
    return updatedOrder
  }

  const recalculate = async () => {
    if (!orderId.value) return
    const updatedOrder = await (new OrderApi(api)).recalculateOrder(orderId.value)
      .finally()
    order.value = Object.assign({}, updatedOrder)
  }

  const pay = async (paymentMethod: PaymentMethodInterface) => {
    if (!orderId.value) return
    payLoading.value = true
    const updatedOrder = await (new OrderApi(api)).payOrder(orderId.value, paymentMethod)
      .finally(() => {
        payLoading.value = false
      })
    const cStore = useCustomerStore()
    if (cStore.customer.id === updatedOrder?.customer?.id) {
      cStore.getCustomer(cStore.customer.id)
        .finally()
    }
    order.value = Object.assign({}, updatedOrder)
  }

  const approvePayment = async (processor: string, paymentResult: Record<string, unknown>) => {
    if (!orderId.value) return
    payLoading.value = true
    const updatedOrder = await (new OrderApi(api)).approvePayment(orderId.value, processor, paymentResult)
      .finally(() => {
        payLoading.value = false
      })
    order.value = Object.assign({}, updatedOrder)
  }

  const updateOrderProductAmount = async (id: number, productId: number, amount: number) => {
    const updatedOrder = await (new OrderApi(api)).updateProductAmount(id, productId, amount)
      .finally()
    if (updatedOrder.id === orderId.value) {
      order.value = Object.assign({}, updatedOrder)
    }
    return updatedOrder
  }

  const repeatOrder = async (oldOrderId: number, newOrderId: number) => {
    const oldOrderData = await fetchOrder(oldOrderId)

    try {
      await updateOrderFields(newOrderId, {
        address: oldOrderData?.address?.id
      })
    } catch (e) {
      Notify.create({
        message: 'Cannot use previous order address. Please select address manually.',
        color: 'negative'
      })
    }

    const updatedOrder = await updateOrderFields(newOrderId, {
      notes: `Reorder of #${oldOrderId}`
    })

    if (updatedOrder.id === orderId.value) {
      order.value = Object.assign({}, updatedOrder)
    }
  }

  return {
    init,
    initWatch,
    orderId,
    order,
    loading,
    checkoutLoading,
    payLoading,
    isAddressSelected,
    isOrderReady,
    isOrderHasEditableStatus,
    faxAttachmentType,
    fetchOrder,
    loadOrder,
    cancelOrder,
    cancel,
    deleteDraft,
    deleteDraftOrder,
    deleteFaxAttachments,
    updateOrderFields,
    updateFields,
    updateOrderProductAmount,
    checkout,
    pay,
    approvePayment,
    recalculateOrder,
    recalculate,
    replaceRows,
    repeatOrder
  }
})
