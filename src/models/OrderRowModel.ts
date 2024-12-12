import ProductModel, { ProductInterface } from 'src/models/ProductModel'
import RefundLERowModel from 'src/models/RefundLERowModel'

export interface OrderRowInputInterface {
  sku_id: number
  amount: number
}

export interface OrderRowPaymentInfoInterface {
  id: number;
  amount: number;
  name: string;
  price: string;
  unDiscountedPrice: string;
  rowPrice: string;
  unDiscountedRowPrice: string;
  upc: string;
}

export interface OrderRowInterface {
  id: number
  price: string
  rowPrice: string
  unDiscountedPrice: string
  unDiscountedRowPrice: string
  amount: number
  refundRows: object[]
  refundableAmount: number
  refundedSum: string
  sku: ProductInterface
}

export interface RejectedRowInterface {
  id: number
  sku: string
  name: string
}

class OrderRowModel {
  readonly id: number
  readonly price: string
  readonly rowPrice: string
  readonly amount: number
  readonly sku: ProductInterface
  readonly refundRows: RefundLERowModel[]

  constructor ({ price, amount, sku, rowPrice, id, refundRows = [] }: any) {
    this.id = id
    this.price = price
    this.rowPrice = rowPrice
    this.amount = amount
    this.sku = sku
    this.refundRows = refundRows.map((item: any) => new RefundLERowModel(item))
  }
}

export default OrderRowModel
