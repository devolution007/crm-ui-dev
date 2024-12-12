import { Dialog, DialogChainObject, Notify } from 'quasar'
import PaymentApproveDialog from 'components/order/checkout/PaymentApproveDialog.vue'

export default function usePaymentsApprove () {
  const openApproveDialog = async (orderId: number): Promise<DialogChainObject> => {
    return Dialog.create({
      component: PaymentApproveDialog,
      componentProps: {
        orderId
      }
    })
      .onOk(async () => {
        Notify.create({
          type: 'positive',
          message: 'Payment approved'
        })
      })
  }

  return {
    openApproveDialog
  }
}
