import { TaskBasicInterface } from 'src/models/TaskModel'
import { CustomerBasicInterface } from 'src/models/CustomerModel'
import { ProductInterface } from 'src/models/ProductModel'
import { MemberBasicInterface } from 'src/models/MemberModel'

export interface ProductRequestInterface extends TaskBasicInterface {
  readonly productName: string
  readonly customer?: CustomerBasicInterface
  readonly resolution: number
  readonly product?: ProductInterface
  readonly finishedBy?: MemberBasicInterface
  readonly link?: string
  readonly comment?: string
  readonly isRejected: boolean
  readonly isApproved: boolean
}

export interface ProductRequestCreateInterface {
  customerId: number
  productName: string
  description: string
  link: string
}
