import Api from 'src/api/Api'
import { RefundFormRow, RefundList, RefundsFilter, SortBy } from 'src/types'
import RefundListEntryModel from 'src/models/RefundListEntryModel'
import RefundModel from 'src/models/RefundModel'

class RefundApi extends Api {
  // todo needs interface
  async create (refund: any): Promise<void> {
    const data = {
      notes: refund.note,
      rows: refund.rows.map((row: RefundFormRow) =>
        ({
          row_id: row.order_row_id,
          reason: row.reason,
          amount: row.amount,
          notes: ''
        })
      ),
      attachments: refund.attachments
    }

    await this.axios.post(`/crm/api/v2/order/${refund.order_id}/refund`, data)
  }

  async getList (page: number, filterBy: RefundsFilter, sortBy: SortBy[], perPage = 25): Promise<RefundList> {
    const params = this.purgeParams(page, perPage, filterBy, sortBy)
    const { items, totalPages, totalItemCount } = (await this.axios.get('/crm/api/v2/refund', { params })).data
    return {
      totalPages,
      items: items.map((item: any) => new RefundListEntryModel(item)),
      totalItemCount
    }
  }

  async getEntry (refundId: number): Promise<RefundModel> {
    const refund = (await this.axios.get(`/crm/api/v2/refund/${refundId}`)).data
    return new RefundModel(refund)
  }

  async delete (refundId: number): Promise<void> {
    await this.axios.delete(`/crm/api/v2/refund/${refundId}`)
  }

  async rejectRows (refundId: number, rowsIds: number[], reason: number): Promise<void> {
    await this.axios.patch(`/crm/api/v2/refund/${refundId}/reject-rows`, { rows: rowsIds, reason })
  }

  async acceptRows (refundId: number, rowsIds: number[]): Promise<void> {
    await this.axios.patch(`/crm/api/v2/refund/${refundId}/refund-rows`, { rows: rowsIds })
  }

  async reverseRows (refundId: number, rowsIds: number[], reason: number): Promise<void> {
    await this.axios.patch(`/crm/api/v2/refund/${refundId}/reverse-rows`, { rows: rowsIds, reason })
  }
}

export default RefundApi
