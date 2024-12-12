<template>
  <q-card
    flat
    class="flex no-wrap column full-height"
  >
    <q-card-section>
      <div class="row items-center">
        <div class="text-h6">
          Shopping cart
        </div>
        <q-space />
        <q-btn
          v-close-popup
          icon="close"
          flat
          round
          dense
          @click="closeCart"
        />
      </div>
      <div class="q-pt-sm">
        <q-btn
          label="Get from e-commerce"
          size="md"
          rounded
          color="secondary"
          text-color="primary"
          icon="system_update_alt"
          :loading="fetchingFromEC"
          :disable="! isFetchingFromECAvailable"
          @click="fetchFromEC"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-none scroll-y">
      <q-list
        v-if="! cartStore.isEmpty"
        separator
      >
        <q-item
          v-for="position in cartStore.items"
          :key="`cart-item-${position.sku}`"
        >
          <q-item-section>
            <div class="flex no-wrap">
              <q-item-label>{{ position.item.name }}</q-item-label>

              <div class="flex no-wrap items-start q-pl-sm">
                <products-wish-add-btn
                  v-if="! wlStore.isSkuInWishlist(position.sku)"
                  :sku="position.sku"
                  :customer-id="props.customerId"
                  size="12px"
                />

                <products-wish-remove-btn
                  v-if="wlStore.isSkuInWishlist(position.sku)"
                  :sku="position.sku"
                  :customer-id="props.customerId"
                  size="12px"
                />
                <q-btn
                  class="q-ml-xs"
                  size="12px"
                  flat
                  dense
                  round
                  icon="sym_o_delete"
                  @click="cartStore.removeItem(position.sku)"
                />
              </div>
            </div>

            <div class="row q-gutter-sm items-end">
              <div class="col q-pb-sm">
                <q-item-label caption>
                  SKU: <strong>{{ position.sku }}</strong>
                </q-item-label>
                <q-item-label caption>
                  Unit price: {{ $helper.formatPrice(position.price) }}
                </q-item-label>
              </div>
              <div class="col-auto">
                <q-avatar rounded>
                  <q-img
                    :src="position.item.mainImage"
                    fit="contain"
                    position="top center"
                    width="48px"
                    height="48px"
                  />
                </q-avatar>
              </div>
            </div>

            <div>
              <products-one-status-badge
                :product="position.item"
              >
                <template #status-ok>
                  <div class="row q-gutter-sm items-end">
                    <div class="col">
                      <products-count-picker
                        v-model="position.amount"
                        :max="position.item.inStockAmount"
                      />
                    </div>

                    <div class="col text-h6 text-right">
                      {{ $helper.formatPrice($helper.getTotalForItem(position.price, position.amount)) }}
                    </div>
                  </div>
                </template>
              </products-one-status-badge>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div
        v-else
        class="q-pa-md"
      >
        <div>There is no product in cart</div>
      </div>
    </q-card-section>
    <q-separator class="q-mt-auto" />
    <q-card-section class="">
      <div class="text-h6">
        Summary

        <q-icon
          name="info"
        >
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="text-body2"
            max-width="300px"
            :delay="150"
          >
            The total price is not final. <br>
            It will be calculated on the Checkout page after applying discounts and selecting delivery method.
          </q-tooltip>
        </q-icon>
      </div>
      <div class="q-mb-md">
        <div>Subtotal: {{ $helper.formatPrice(cartStore.total) }}</div>
      </div>
      <div class="q-mb-md">
        <div>({{ $helper.formatPrice(uniBalancePredictedAfterCheckout) }} left)</div>
      </div>

      <q-banner
        v-if="cartStore.isHasItemsNA"
        rounded
        class="bg-amber-10 text-white q-mb-md"
      >
        Some products from the cart are not available. Please remove them.
      </q-banner>

      <q-btn
        label="Proceed to Checkout"
        color="primary"
        class="full-width"
        :disable="! cartStore.isCanBeOrdered"
        :loading="loadingNewOrder"
        @click="proceedToCheckout"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import useCart from 'src/composables/useCart'
import { useCartStore } from 'stores/cart-store'
import { computed, onMounted, Ref, ref, watch } from 'vue'
import OrderApi from 'src/api/OrderApi'
import { api } from 'boot/axios'
import { useCustomerStore } from 'stores/customer-store'
import { useWishlistStore } from 'stores/wishlist-store-multi'
import { Dialog } from 'quasar'
import { constants } from 'boot/constants'
import { useRouter } from 'vue-router'
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import { useOrderStore } from 'stores/order-store'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
    required: false,
    default: null
  },
  type: {
    type: String,
    required: true
  },
  repeat: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['cart:error'])
const { closeCart } = useCart()

const cartStore = useCartStore()
const customerStore = useCustomerStore()

const allowedOrderTypes = ['cc_in', 'cc_out', 'fax']

onMounted(() => {
  cartStore.init(props.customerId)

  if (props.orderId) {
    cartStore.loadFromOrder(props.orderId)
  }
  searchECDraft()
  orderTypeCheck()
})

const ecDraftId: Ref<number|null> = ref(null)
const fetchingFromEC = ref(false)
const isFetchingFromECAvailable = computed(() => {
  return ecDraftId.value !== null
})
const loadingNewOrder = ref(false)

const searchECDraft = async () => {
  fetchingFromEC.value = true

  try {
    const draftOrder = await (new OrderApi(api)).findOnlineDraft(props.customerId)

    if (draftOrder && draftOrder.id) {
      ecDraftId.value = draftOrder.id
    }
  } catch (e) {
    console.log(e)
  } finally {
    fetchingFromEC.value = false
  }
}
const fetchFromEC = async () => {
  if (ecDraftId.value === null) {
    return
  }

  fetchingFromEC.value = true

  try {
    await cartStore.loadFromOrder(ecDraftId.value)
  } catch (e) {
    console.log(e)
  } finally {
    fetchingFromEC.value = false
  }
}

const uniBalancePredictedAfterCheckout = computed(() => {
  return customerStore.unifiedBalance - cartStore.total
})

const wlStore = computed(() => useWishlistStore(props.customerId))

const createWrongOrderTypeDialog = (message: string) => {
  Dialog.create({
    title: 'Error',
    message,
    persistent: true,
    ok: {
      label: 'Return to customer orders',
      to: { name: 'customer-orders', params: { customerId: props.customerId } }
    }
  })
}

const orderTypeCheck = () => {
  if (props.type !== 'none' && !allowedOrderTypes.includes(props.type)) {
    createWrongOrderTypeDialog(`Wrong order type: ${props.type}`)
  }
}

customerStore.init(props.customerId)
  .then(() => {
    if (props.type === constants.ORDER_TYPE_FAX && !customerStore.hasFeature('faxOrders')) {
      createWrongOrderTypeDialog('This customer does not have fax orders feature')
    }
  })

const router = useRouter()
const proceedToCheckout = async () => {
  loadingNewOrder.value = true

  cartStore.placeOrder(props.type)
    .then(async newOrderId => {

      if (props.orderId && props.repeat) {
        const oStore = useOrderStore()
        await oStore.repeatOrder(props.orderId, newOrderId)
      }

      await router.push({
        name: 'checkout',
        params: {
          customerId: props.customerId,
          orderId: newOrderId
        }
      })
    })
    .catch(e => {
      if (axios.isAxiosError(e)) {
        let message = 'Unknown error'
        const serverErrors = helper.getFirstErrors(e.response?.data || {}) as { [key: string]: string }
        if (serverErrors.general) {
          message = serverErrors.general
        }
        emit('cart:error', message)
      } else {
        emit('cart:error', 'Something went wrong.')
      }
    })
    .finally(() => {
      loadingNewOrder.value = false
    })
}
</script>

<style scoped>

</style>
