import { defineStore } from 'pinia'
import { CartPositionInterface } from 'src/models/CartItem'
import { ProductInterface } from 'src/models/ProductModel'
import { OrderRowInterface } from 'src/models/OrderRowModel'
import OrderApi from 'src/api/OrderApi'
import { api } from 'boot/axios'
import { useAuthStore } from 'stores/auth-store'
import { OrderType } from 'src/types'
import { useOrderStore } from 'stores/order-store'
import { OrderInterface } from 'src/models/OrderModel'
import { useCall } from 'stores/call'

export const useCartStore = defineStore('cart', {
  state: () => ({
    shippingAddressId: null as string | null,
    customerId: null as number | null,
    items: [] as CartPositionInterface[]
  }),

  getters: {
    isEmpty (state) {
      return state.items.length === 0
    },
    isHasItemsNA (state) {
      return state.items.some((position: CartPositionInterface) => position.item.discontinued || !position.item.orderable || position.item.inStockAmount === 0)
    },
    isCanBeOrdered () {
      if (this.isEmpty) {
        return false
      }
      if (this.isHasItemsNA) {
        return false
      }

      return true
    },
    itemsCount (state) {
      return state.items.length
    },
    total (state) {
      return state.items.reduce((total: number, item: CartPositionInterface) => {
        return total + item.amount * parseFloat(item.price)
      }, 0)
    }
  },

  actions: {
    init (customerId: number) {
      this.customerId = customerId
      this.items = []
    },
    removeItem (sku: string) {
      this.items = this.items.filter((item: CartPositionInterface) => item.sku !== sku)
    },
    doesItemExist (sku: string) {
      return this.items.some((item: CartPositionInterface) => item.sku === sku)
    },
    findItem (sku: string) {
      return this.items.find((item: CartPositionInterface) => item.sku === sku)
    },
    increaseItemAmount (sku: string, amount = 1) {
      const item = this.findItem(sku)
      if (item) {
        item.amount += amount
      }
    },
    addSkuItem (sku: ProductInterface, amount = 1) {
      if (this.doesItemExist(sku.sku)) {
        const item = this.findItem(sku.sku)
        const maxAmount = sku.inStockAmount
        if (item && item.amount + amount > maxAmount) {
          item.amount = maxAmount
        } else {
          this.increaseItemAmount(sku.sku, amount)
        }
        return
      }
      this.items.push({
        sku: sku.sku,
        amount,
        price: sku.price,
        item: sku
      })
    },
    async loadFromOrder (orderId: number) {
      const orderStore = useOrderStore()
      const order = await orderStore.fetchOrder(orderId)
      this.items = order.rows.map((orderRow: OrderRowInterface) => ({
        sku: orderRow.sku.sku,
        amount: orderRow.amount,
        price: orderRow.price,
        item: orderRow.sku
      }))
    },
    editShippingAddressId (id: string | null) {
      this.shippingAddressId = id
    },
    async placeOrder (type: OrderType): Promise<number> {
      if (!this.customerId) throw new Error('Customer id is not set')
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) throw new Error('User is not logged in')
      const callStore = useCall()

      const draftOrder = await (new OrderApi(api)).prepareDraftOrder(this.customerId, type)
      if (!draftOrder) throw new Error('Draft order is not created')

      const oStore = useOrderStore()
      await oStore.init(draftOrder.id)
      await oStore.replaceRows(
        this.items.map((item) => ({
          sku_id: item.item.id,
          amount: item.amount
        }))
      )
      if (callStore.isCallActive) {
        await oStore.updateFields({
          call: callStore.call?.id
        })
      }
      return draftOrder.id
    },
    async findDraftOrder (type: OrderType): Promise<OrderInterface|null> {
      if (!this.customerId) throw new Error('Customer id is not set')
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) throw new Error('User is not logged in')

      const draftOrder = await (new OrderApi(api)).prepareDraftOrder(this.customerId, type)
      if (!draftOrder) {
        return null
      }

      return draftOrder
    }
  }
})
