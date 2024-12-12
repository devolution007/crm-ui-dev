import OrderModel from './OrderModel'
import MemberModel from './MemberModel'
import AttachmentModel from './AttachmentModel'
import CustomerModel from 'src/models/CustomerModel'

/**
 * @deprecated use Grievance interface instead
 */
class IssueModel {
  /**
   * @param {array} actionsDescriptionJson
   * @param {array} attachments
   * @param {string} category
   * @param {array} complaintDescriptionJson
   * @param {array} createdAt
   * @param {number} id
   * @param {boolean} isCallWithRepresentative
   * @param {boolean} isMemberInformed
   * @param {array} items
   * @param {string} lastUpdatedAt
   * @param {object} member
   * @param {object} order
   * @param {string} priority
   * @param {string} resolvedBy
   * @param {string} status
   * @param {string} todo
   * @param {object} customer
   */
  constructor ({
    actionsDescriptionJson,
    attachments,
    category,
    complaintDescriptionJson,
    createdAt,
    id,
    isCallWithRepresentative,
    isMemberInformed,
    items,
    lastUpdatedAt,
    member,
    order,
    priority,
    resolvedBy,
    status,
    todo,
    customer
  }) {
    this.actionsDescriptionJson = actionsDescriptionJson
    this.attachments = attachments?.map(item => new AttachmentModel(item)) ?? []
    this.category = category
    this.complaintDescriptionJson = complaintDescriptionJson
    this.createdAt = createdAt
    this.id = id
    this.isCallWithRepresentative = isCallWithRepresentative
    this.isMemberInformed = isMemberInformed
    // Grievance Items
    this.items = items
    this.lastUpdatedAt = lastUpdatedAt
    this.member = member && new MemberModel(member)
    this.order = order && new OrderModel(order)
    this.priority = priority
    this.resolvedBy = resolvedBy
    this.status = status
    this.todo = todo
    this.customer = customer && new CustomerModel(customer)
  }
}

export default IssueModel
