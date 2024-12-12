import Api from 'src/api/Api'
import {
  ProductRequestCreateInterface, ProductRequestInterface
} from 'src/models/ProductRequest'
import { ProductRequestFilter, SortBy } from 'src/types'

class ProductRequestApi extends Api {
  async getList (page: number, filterBy: ProductRequestFilter, sortBy: SortBy, perPage = 25) {
    const params = {
      page, perPage, filterBy: this.removeEmptyFields(filterBy), sortBy
    }
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/product-request', { params })).data
    return {
      totalPages,
      items: items.map((item: ProductRequestInterface) => item),
      totalItemCount
    }
  }

  async approve (requestId: number, productSku: string, comment?: string) {
    const data = {
      productSku, comment
    }
    return (await this.axios.patch(`/crm/api/v2/product-request/${requestId}/approve`, data)).data as ProductRequestInterface
  }

  async reject (id: number, comment: string) {
    const data = {
      comment
    }
    return (await this.axios.patch(`/crm/api/v2/product-request/${id}/reject`, data)).data as ProductRequestInterface
  }

  async review (id: number) {
    return (await this.axios.patch(`/crm/api/v2/product-request/${id}/review`)).data as ProductRequestInterface
  }

  async create (data: ProductRequestCreateInterface) {
    return (await this.axios.post('/crm/api/v2/product-request', data)).data as ProductRequestInterface
  }
}

export default ProductRequestApi
