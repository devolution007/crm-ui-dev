<template>
  <q-tr :props="props">
    <q-td
      auto-width
      class="vertical-top"
    >
      <q-img
        v-if="props.row.mainImage"
        fit="contain"
        :src="props.row.mainImage"
        :alt="props.row.name"
        :title="props.row.name"
        width="70px"
        height="120px"
        class="cursor-pointer q-mt-sm q-pa-md bg-white border-radius"
        spinner-color="primary"
        position="top center"
        @click="createProductImagesDialog(props.row)"
      />
    </q-td>
    <q-td>
      <div class="row q-py-sm q-col-gutter-md">
        <div class="col-8">
          <p class="white-space-normal text-weight-bold q-mb-sm">
            {{ props.row.name }}
          </p>
          <div
            v-if="props.row.tags"
            class="q-mb-sm"
          >
            <q-chip
              v-for="tag in props.row.tags"
              :key="tag"
              :label="tag"
              square
            />
          </div>
          <slot
            name="under-name"
            :row="props.row"
          />
          <products-detail-row
            label="Active ingr"
            :value="props.row.activeIngredients"
          />
        </div>
        <div class="col-2 text-body2">
          <div class="info-side">
            <div class="text-caption text-toner">
              SKU
            </div>
            <div class="q-pl-sm">
              {{ props.row.sku }}
            </div>
            <div
              v-if="props.row.form"
              class="text-caption text-toner"
            >
              Form
            </div>
            <div
              v-if="props.row.form"
              class="q-pl-sm"
            >
              {{ props.row.form }}
            </div>
            <div
              v-if="props.row.strength"
              class="text-caption text-toner"
            >
              Strength
            </div>
            <div
              v-if="props.row.strength"
              class="q-pl-sm"
            >
              {{ props.row.strength }}
            </div>
          </div>
        </div>
        <div class="col-2 text-right">
          <div>
            <slot
              name="top-right"
              :row="props.row"
            />
          </div>
          <div
            v-if="! props.row.discontinued && props.row.inStockAmount > 0"
            class="text-h6"
          >
            <div v-if="props.row.gift">
              <q-icon name="sym_o_redeem" />
              Gift
            </div>
            <div v-if="props.row.catalog">
              Catalog
            </div>
            <div v-else>
              {{ $helper.formatPrice(props.row.price) }}
            </div>
          </div>
          <products-one-status-badge
            :product="props.row"
          >
            <template #status-ok>
              <div class="text-caption">
                {{ props.row.inStockAmount }} items left
              </div>
            </template>
          </products-one-status-badge>
        </div>
      </div>
      <div class="flex justify-end q-pb-sm q-gutter-sm">
        <q-btn
          v-if="!props.expand"
          size="md"
          color="secondary"
          text-color="primary"
          label="More info"
          class="q-ml-sm"
          @click="$emit('toggleExpand', true)"
        />
        <q-btn
          v-if="props.expand"
          size="md"
          color="primary"
          text-color="secondary"
          label="Hide info"
          class="q-ml-sm"
          @click="$emit('toggleExpand', false)"
        />
        <slot
          name="actions"
          :row="props.row"
        />
        <products-count-picker
          v-if="props.row.inStockAmount && props.row.orderable"
          :key="`product-list-row-counter-${props.row.id}`"
          :model-value="1"
          :max="props.row.inStockAmount"
          class="q-ml-sm"
        >
          <template #after="picker">
            <q-btn
              v-if="!componentProps.orderId"
              size="md"
              color="primary"
              label="Add to cart"
              class="q-ml-sm"
              :disable="! props.row.orderable"
              @click="cartStore.addSkuItem(props.row, picker.value)"
            />
            <q-btn
              v-if="componentProps.orderId && oStore.isOrderReady"
              size="md"
              color="primary"
              label="Add to order"
              class="q-ml-sm"
              :disable="! props.row.orderable"
              :loading="addOrderProductLoading"
              @click="addOrderAmount(props.row, picker.value)"
            />
          </template>
        </products-count-picker>
        <products-back-in-stock-btn
          v-if="(! props.row.orderable || props.row.inStockAmount === 0) && ! props.row.discontinued"
          :sku="props.row.sku"
          :customer-id="componentProps.customerId"
        />
      </div>
    </q-td>
  </q-tr>
</template>

<script setup lang="ts">
import { Notify, QTrProps } from 'quasar'
import useProduct from 'src/composables/useProduct'
import { ProductInterface } from 'src/models/ProductModel'
import { useCartStore } from 'stores/cart-store'
import { useOrderStore } from 'stores/order-store'
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'
const { createProductImagesDialog } = useProduct()

interface ProductTrProps extends QTrProps {
  row: ProductInterface
  expand: boolean
}

const componentProps = defineProps<{
  props: ProductTrProps,
  customerId: number
  orderId?: number
}>()

defineEmits(['toggleExpand'])

const cartStore = useCartStore()

const oStore = useOrderStore()

const addOrderProductLoading = ref(false)
const addOrderAmount = (product: ProductInterface, amount: number) => {
  if (!componentProps.orderId) return
  addOrderProductLoading.value = true
  if (oStore.isOrderReady && oStore.orderId === componentProps.orderId) {
    const exists = oStore.order?.rows.find(op => op.sku.id === product.id) || false
    if (exists) {
      amount += exists.amount
    }
  }
  oStore.updateOrderProductAmount(componentProps.orderId, product.id, amount)
    .then(() => {
      Notify.create({
        message: `Product ${product.name} added to order`,
        color: 'positive'
      })
    })
    .catch((e: unknown | AxiosError) => {
      if (axios.isAxiosError(e)) {
        const serverErrors = helper.getFirstErrors(e.response?.data || {}) as { [key: string]: string }
        if (serverErrors.general) {
          Notify.create({
            message: serverErrors.general,
            color: 'negative'
          })
        } else {
          Notify.create({
            message: Object.values(serverErrors).join('<br>'),
            color: 'negative'
          })
        }
      }
    })
    .finally(() => {
      addOrderProductLoading.value = false
    })
}
</script>

<style scoped lang="scss">
.info-side {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
