import Api from 'src/api/Api'
import { WishlistItemInterface } from 'src/types'

class WishlistApi extends Api {
  async get (customerId: number): Promise<WishlistItemInterface[]> {
    const { items } = (await this.axios.get(`/crm/api/v2/wishlist/${customerId}`, {
      perPage: 1000
    })).data
    return items.map((row: WishlistItemInterface) => row)
  }

  async add (sku: string, customerId: number): Promise<WishlistItemInterface> {
    const row = (await this.axios.post(`/crm/api/v2/wishlist/${customerId}`, {
      sku
    })).data
    return row as WishlistItemInterface
  }

  async remove (sku: string, customerId: number) {
    return await this.axios.delete(`/crm/api/v2/wishlist/${customerId}/${sku}`)
  }
}

export default WishlistApi
