import ProductModel from 'src/models/ProductModel'
import MemberModel from 'src/models/MemberModel'
import CustomerModel from 'src/models/CustomerModel'

class BackInStockModel {
  id: number
  member: MemberModel
  customer: CustomerModel
  product: ProductModel
  createdAt: string

  constructor ({ id, member, customer, product, createdAt }: any) {
    this.id = id
    this.member = member
    this.customer = customer
    this.product = product
    this.createdAt = createdAt
  }
}

export default BackInStockModel
