import Api from 'src/api/Api'
import { ProductInterface } from 'src/models/ProductModel'
import { CatalogList, ElementaryEntity, ProductsFilter } from 'src/types'

class ProductApi extends Api {
  async getItems (page: number, filterBy: ProductsFilter, perPage = 25): Promise<CatalogList> {
    const params = {
      page,
      perPage,
      filterBy: this.removeEmptyFields(filterBy)
    }

    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/catalog/list', { params })).data
    return {
      totalItemCount,
      items: items.map((item: ProductInterface) => item), // new ProductModel(item)),
      totalPages
    }
  }

  async getProductsByIds (ids: number[], customerId: number, plan: string | undefined): Promise<CatalogList> {
    const params = {
      filterBy: {
        customerId,
        skus: ids.join(','),
        plan
      }
    }
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/catalog/list', { params })).data
    return {
      totalItemCount,
      items: items.map((item: ProductInterface) => item),
      totalPages
    }
  }

  async getCategories (customerId: number): Promise<ElementaryEntity[]> {
    return (await this.axios.get('/crm/api/v2/catalog/categories', { params: { customerId } })).data
  }

  async getSyncInfo (): Promise<{ lastSync: string, inProgress: boolean }> {
    return (await this.axios.get('/crm/api/v2/catalog/sync')).data
  }

  async syncCatalog (): Promise<{ status: string }> {
    return (await this.axios.post('/crm/api/v2/catalog/sync')).data
  }
}

export default ProductApi
