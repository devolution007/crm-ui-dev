<template>
  <q-page>
    <q-card>
      <q-card-section class="q-pa-none">
        <q-tabs
          v-model="tab"
          align="left"
        >
          <q-tab
            name="items"
            :label="$t('items')"
            active-class="text-primary"
          />
          <q-tab
            name="backInStock"
            :label="$t('backInStock')"
            active-class="text-primary"
          >
            <q-badge
              v-if="bisStore.inStockItemsCount"
              floating
              :label="bisStore.inStockItemsCount"
            />
          </q-tab>
          <q-tab
            name="wishlist"
            :label="$t('wishlist')"
            active-class="text-primary"
          >
            <q-badge
              v-if="wlStore.items.length"
              floating
              :label="wlStore.items.length"
            />
          </q-tab>
          <q-tab
            name="gifts"
            :label="$t('gifts')"
            active-class="text-primary"
          />
          <q-tab
            name="catalogs"
            :label="$t('catalogs')"
            active-class="text-primary"
          />
        </q-tabs>
      </q-card-section>
      <q-card-section>
        <q-tab-panels
          v-model="tab"
          animated
          keep-alive
          class="bg-transparent"
        >
          <q-tab-panel
            name="items"
            class="q-pa-none"
          >
            <products-list-table
              :customer-id="props.customerId"
            />
          </q-tab-panel>
          <q-tab-panel
            class="q-pa-none"
            name="backInStock"
          >
            <div class="text-h6">
              {{ $t('backInStock') }}
            </div>
            <products-back-in-stock-list
              :customer-id="props.customerId"
            />
          </q-tab-panel>
          <q-tab-panel
            class="q-pa-none"
            name="wishlist"
          >
            <div class="text-h6">
              {{ $t('wishlist') }}
            </div>
            <products-wish-list :customer-id="props.customerId" />
          </q-tab-panel>
          <q-tab-panel
            class="q-pa-none"
            name="gifts"
          >
            <div class="text-h6">
              {{ $t('gifts') }}
            </div>
            <products-list-table
              :customer-id="props.customerId"
              type="gift"
            />
          </q-tab-panel>
          <q-tab-panel
            class="q-pa-none"
            name="catalogs"
          >
            <div class="text-h6">
              {{ $t('catalogs') }}
            </div>
            <products-list-table
              :customer-id="props.customerId"
              type="catalog"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
    <div
      v-if="oStore.isOrderReady && oStore.order?.isOrderDraft"
      class="text-center q-mt-md q-mb-md"
    >
      <q-btn
        size="sm"
        label="Discard order"
        color="secondary"
        text-color="primary"
        @click="cancelAndBack"
      />
    </div>

    <q-drawer
      v-model="rightCartOpen"
      side="right"
      bordered
    >
      <!-- drawer content -->
      <order-cart
        :customer-id="props.customerId"
        :order-id="props.orderId"
        :type="props.type"
        :repeat="props.repeat"
        @cart:error="$q.notify({ message: $event, color: 'negative' })"
      />
    </q-drawer>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        v-show="! rightCartOpen"
        fab
        icon="sym_o_shopping_cart"
        color="accent"
        :label="cartStore.itemsCount"
        @click="showCart"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { Dialog, useMeta } from 'quasar'
import { computed, ComputedRef, onMounted, ref, watch } from 'vue'
import useCart from 'src/composables/useCart'
import { useCustomerStore } from 'stores/customer-store'
import { useBackInStockStore } from 'stores/back-in-stock-store-multi'
import { useWishlistStore } from 'stores/wishlist-store-multi'
import { useRouter } from 'vue-router'
import { useOrderStore } from 'stores/order-store'
import { useCartStore } from 'stores/cart-store'

useMeta({
  title: 'Order placement'
})

const props = withDefaults(defineProps<{
  customerId: number
  orderId?: number | null
  type: string
  repeat: boolean
}>(), {
  orderId: null
})

const tab = ref('items')
const { rightCartOpen, showCart } = useCart()

const customerStore = useCustomerStore()
const customer = customerStore.getCustomerLazy(computed(() => props.customerId))

const wlStore = computed(() => useWishlistStore(props.customerId))

const bisStore = computed(() => useBackInStockStore(props.customerId))
const cartStore = useCartStore()
onMounted(() => {
  if (bisStore.value.isLoaded) {
    createBackInStockDialog(bisStore.value.inStockItemsCount)
  } else {
    bisStore.value.onFirstLoad(() => {
      createBackInStockDialog(bisStore.value.inStockItemsCount)
    })
  }
})

const createBackInStockDialog = (inStockItemsCount: number) => {
  if (!inStockItemsCount) {
    return
  }

  Dialog.create({
    title: 'Products back in stock',
    message: `Products from your list (${inStockItemsCount}) are available now. Would you like to review them now?`,
    ok: {
      label: 'Yes',
      color: 'primary'
    },
    cancel: {
      label: 'Later',
      color: 'secondary',
      flat: true
    }
  })
    .onOk(() => {
      tab.value = 'backInStock'
    })
}

const router = useRouter()
const oStore = useOrderStore()
const cancelAndBack = async () => {

  Dialog.create({
    title: 'Discard order?',
    message: `Order draft will be deleted and all unsaved changes will be lost. <br /> This action cannot be undone.`,
    html: true,
    ok: {
      label: 'Yes, discard order',
      color: 'danger'
    },
    cancel: {
      label: 'Cancel',
      color: 'secondary',
      flat: true
    }
  })
    .onOk(async () => {

      if (oStore.isOrderReady && oStore.order?.isOrderDraft) {
        try {
          await oStore.deleteDraftOrder(oStore.order?.id)
        } catch (e) {
          console.error(e)
        }
      }

      await router.push({
        name: 'customer-details',
        params: {
          customerId: props.customerId
        }
      })
    })
}

</script>
