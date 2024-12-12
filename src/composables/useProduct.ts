import { Dialog, DialogChainObject } from 'quasar'
import { ProductInterface } from 'src/models/ProductModel'
import ImgSliderDialog from 'components/products/ImgSliderDialog.vue'
import ProductsListDialog from 'components/products/ListDialog.vue'

export default function useProduct () {
  return {
    createProductImagesDialog (product: ProductInterface): DialogChainObject {
      return Dialog.create({
        component: ImgSliderDialog,
        componentProps: {
          product
        }
      })
    },
    createProductListDialog (
      productsIds: number[],
      title: string,
      customerId: number | null,
      plan: string | null = null,
      orderId: number | null = null
    ): DialogChainObject {
      return Dialog.create({
        component: ProductsListDialog,
        componentProps: {
          productsIds,
          title,
          customerId,
          plan,
          orderId
        }
      })
    }
  }
}
