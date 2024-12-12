import Api from 'src/api/Api'
import OrderModel, { OrderInputPatch, OrderInterface, OrderPaymentInfoInterface } from 'src/models/OrderModel'
import { OrderRowInputInterface } from 'src/models/OrderRowModel'
import {
  AttachmentInfo,
  OrderList,
  OrdersFilter,
  OrderType,
  PaymentMethodInterface,
  SortBy
} from 'src/types'
import { api } from 'boot/axios'
import { PaymentDetailsInterface } from 'src/models/Payments'

class OrderApi extends Api {
  async getOrders (page: number, filterBy: OrdersFilter, sortBy: SortBy, perPage = 25): Promise<OrderList> {
    const params = this.purgeParams(page, perPage, filterBy, sortBy) as { filterBy: OrdersFilter }
    params.filterBy = this.removeEmptyFields(filterBy)
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/order/list', { params })).data
    return {
      totalPages,
      items: items.map((item: any) => new OrderModel(item)),
      totalItemCount
    }
  }

  async createCsvLink (filterBy: OrdersFilter, sortBy: SortBy): Promise<AttachmentInfo> {
    return (await this.axios.post('/crm/api/v2/order/list/create-csv', { filterBy, sortBy })).data
  }

  async getIds (customerId: number): Promise<number[]> {
    return (await this.axios.get(`/crm/api/v2/order/id-only/customer/${customerId}`)).data
  }

  async updateOrderFields (orderId: number, fields: OrderInputPatch): Promise<OrderInterface> {
    const response = await this.axios.patch(`/crm/api/v2/order/${orderId}`, fields)
    return response.data as OrderInterface
  }

  async deleteDraft (orderId: number): Promise<void> {
    await this.axios.delete(`/crm/api/v2/order/${orderId}`)
  }

  async getOrder (orderId: number): Promise<OrderInterface> {
    return (await this.axios.get(`/crm/api/v2/order/${orderId}`)).data as OrderInterface
  }

  async voidOrder (orderId: number): Promise<OrderInterface> {
    return (await this.axios.patch(`/crm/api/v2/order/${orderId}/void`)).data as OrderInterface
  }

  async createOrder (customer: number, type: OrderType): Promise<OrderInterface> {
    const data = { customer, type }
    return (await this.axios.post('/crm/api/v2/order', data)).data as OrderInterface
  }

  async replaceRows (orderId: number, rows: OrderRowInputInterface[]): Promise<OrderInterface> {
    const data = { rows }
    return (await this.axios.put(`/crm/api/v2/order/${orderId}/items`, data)).data as OrderInterface
  }

  async updateProductAmount (orderId: number, skuId: number, amount: number): Promise<OrderInterface> {
    const data = { amount, sku_id: skuId }
    return (await this.axios.patch(`/crm/api/v2/order/${orderId}/sku-amount`, data)).data as OrderInterface
  }

  async checkoutOrder (orderId: number): Promise<OrderInterface> {
    return (await this.axios.patch(`/crm/api/v2/order/${orderId}/complete`)).data as OrderInterface
  }

  async recalculateOrder (orderId: number): Promise<OrderInterface> {
    return (await this.axios.patch(`/crm/api/v2/order/${orderId}/recalculate`)).data as OrderInterface
  }

  async payOrder (orderId: number, paymentMethod: PaymentMethodInterface) {
    const data = { ...paymentMethod }
    return (await this.axios.post(`/crm/api/v2/order/${orderId}/pay`, data)).data as OrderInterface
  }

  async prepareDraftOrder (customerId: number, type: string | null = null): Promise<OrderInterface | null> {
    const order = (await api.post('/crm/api/v2/order/prepare-draft', {
      customer: customerId,
      type
    })).data
    if (order) {
      return order as OrderInterface
    }
    return null
  }

  async findOnlineDraft (customerId: number): Promise<OrderInterface | null> {
    const order = (await api.post('/crm/api/v2/order/find-draft', {
      customer: customerId,
      type: 'online'
    })).data
    if (order) {
      return order as OrderInterface
    }
    return null
  }

  async fetchPaymentDetails (orderId: number): Promise<{
    order: OrderPaymentInfoInterface,
    paymentDetails: PaymentDetailsInterface | null
  }> {
    const data = (await this.axios.get(`/crm/api/v2/order/${orderId}/payment-details`)).data
    return {
      order: data.order as OrderPaymentInfoInterface,
      paymentDetails: data.paymentDetails as PaymentDetailsInterface | null
    }
  }

  async approvePayment (orderId: number, processor: string, paymentResult: Record<string, unknown>): Promise<OrderInterface> {
    const data = {
      processor,
      paymentResult
    }
    return (await this.axios.post(`/crm/api/v2/order/${orderId}/approve-payment`, data)).data as OrderInterface
  }

  sendOrderConfirmation (orderId: number, customerId: number, noticeType: string, noticeTarget: string) {
    return new Promise<OrderModel>((resolve) => {
      setTimeout(() => resolve({
        orderId,
        customerId,
        noticeType,
        noticeTarget
      } as any), 3000)
    })
  }
}

export default OrderApi
