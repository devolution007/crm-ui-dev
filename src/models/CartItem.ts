import { ProductInterface } from 'src/models/ProductModel'

export interface CartItemInterface {
  amount: number
  sku: string
}

export default CartItemInterface

export interface CartPositionInterface {
  sku: string
  amount: number
  price: string
  item: ProductInterface
}
