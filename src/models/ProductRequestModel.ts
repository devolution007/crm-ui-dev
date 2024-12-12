import CustomerModel from 'src/models/CustomerModel'
import MemberModel from 'src/models/MemberModel'
import ProductModel from 'src/models/ProductModel'

/**
 * @deprecated
 */
class ProductRequestModel {
  readonly id: number
  readonly customer: CustomerModel
  readonly member: MemberModel
  readonly createdAt: string
  readonly priority: number
  readonly resolution: number
  readonly processedAt: string
  readonly status: number
  readonly link: number
  readonly product: ProductModel
  readonly comment: string

  constructor ({ customer, comment, member, createdAt, priority, processedAt, status, link, product, resolution, id }: any) {
    this.customer = new CustomerModel(customer)
    this.member = new MemberModel(member)
    this.createdAt = createdAt
    this.priority = priority
    this.resolution = resolution
    this.processedAt = processedAt
    this.status = status
    this.link = link
    this.comment = comment
    this.id = id
    this.product = product && new ProductModel(product)
  }
}

export default ProductRequestModel
