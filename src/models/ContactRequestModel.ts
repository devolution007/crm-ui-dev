import OrderModel from 'src/models/OrderModel'
import CustomerModel from 'src/models/CustomerModel'

class ContactRequestModel {
  readonly id: number
  readonly customer?: CustomerModel
  readonly createdAt: string
  readonly description: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly formattedPhone: string
  readonly order: OrderModel

  constructor ({ customer, createdAt, id, formattedPhone, description, name, email, phone, order }: any) {
    this.customer = customer && new CustomerModel(customer)
    this.createdAt = createdAt
    this.id = id
    this.name = name
    this.email = email
    this.phone = phone
    this.formattedPhone = formattedPhone
    this.order = order
    this.description = description
  }
}

export default ContactRequestModel
