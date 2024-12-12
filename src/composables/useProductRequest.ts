import { ref } from 'vue'
import { Dialog, DialogChainObject, Notify } from 'quasar'
import ApproveDialog from 'components/product-request/ApproveDialog.vue'
import RejectDialog from 'components/product-request/RejectDialog.vue'
import CreateDialog from 'components/product-request/CreateDialog.vue'
import ProductRequestApi from 'src/api/ProductRequestApi'
import { api } from 'boot/axios'

export default function useProductRequest () {
  const loading = ref(false)

  const markToReview = async (id: number) => {
    loading.value = true
    try {
      await (new ProductRequestApi(api)).review(id)
    } catch (e) {
      Notify.create({
        type: 'negative',
        message: 'Error making request'
      })
    } finally {
      loading.value = false
    }
  }

  const openApproveDialog = async (id: number): Promise<DialogChainObject> => {
    return Dialog.create({
      component: ApproveDialog,
      componentProps: {
        requestId: id
      }
    })
  }

  const openRejectDialog = async (id: number): Promise<DialogChainObject> => {
    return Dialog.create({
      component: RejectDialog,
      componentProps: {
        requestId: id
      }
    })
  }

  const openCreateDialog = async (customerId: number): Promise<DialogChainObject> => {
    return Dialog.create({
      component: CreateDialog,
      componentProps: {
        customerId
      }
    })
  }

  return {
    loading,
    markToReview,
    openCreateDialog,
    openApproveDialog,
    openRejectDialog
  }
}
