<template>
  <q-table
    v-model:pagination="pagination"
    flat
    :columns="columns"
    :rows="rows"
    row-key="id"
    hide-pagination
    :rows-per-page-options="[0]"
    :loading="!oStore.isOrderReady"
  >
    <template #body="scope">
      <q-tr
        :props="scope"
        :class="{ 'bg-red-4': inRejectedRows(scope.row) }"
      >
        <q-td
          key="sku"
          :props="scope"
        >
          {{ scope.row.sku.sku }}
        </q-td>
        <q-td
          key="name"
          :props="scope"
        >
          {{ scope.row.sku.name }}
        </q-td>
        <q-td
          key="amount"
          :props="scope"
        >
          <products-count-picker
            v-if="oStore.isOrderReady"
            :model-value="scope.row.amount"
            :max="scope.row.sku.inStockAmount"
            :enable-loading="true"
            @update:model-value="oStore.updateOrderProductAmount(props.orderId, scope.row.sku.id, $event)"
          />
        </q-td>
        <q-td
          key="price"
          :props="scope"
        >
          <span
            v-if="scope.row.unDiscountedPrice !== scope.row.price"
            class="text-caption text-toner text-strike"
          >{{ $helper.formatPrice(scope.row.unDiscountedPrice) }}</span>
          {{ $helper.formatPrice(scope.row.price) }}
        </q-td>
        <q-td
          key="subtotal"
          :props="scope"
        >
          {{ $helper.formatPrice(scope.row.rowPrice) }}
        </q-td>
        <q-td
          key="actions"
          :props="scope"
        >
          <q-btn
            v-if="scope.row.sku.analogs && scope.row.sku.analogs?.length > 0"
            size="sm"
            round
            icon="sym_o_alt_route"
            class="q-mr-sm"
            @click="createProductListDialog(scope.row.sku.analogs, 'Analogs', props.customerId, null, props.orderId)"
          >
            <q-tooltip
              class="text-body2"
            >
              Analogs
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="scope.row.sku.additional && scope.row.sku.additional?.length > 0"
            size="sm"
            round
            icon="sym_o_link"
            class="q-mr-sm"
            @click="createProductListDialog(scope.row.sku.additional, 'Complementary products', props.customerId, null, props.orderId)"
          >
            <q-tooltip
              class="text-body2"
            >
              Complementary products
            </q-tooltip>
          </q-btn>
          <products-wish-add-btn
            v-if="! wlStore.isSkuInWishlist(scope.row.sku.sku)"
            :sku="scope.row.sku.sku"
            :customer-id="props.customerId"
            :dense="false"
            size="sm"
          />
          <products-wish-remove-btn
            v-if="wlStore.isSkuInWishlist(scope.row.sku.sku)"
            :sku="scope.row.sku.sku"
            :customer-id="props.customerId"
            :dense="false"
            size="sm"
          />
          <q-btn
            :loading="deleteRowLoadings.includes(scope.row.id)"
            class="q-ml-sm"
            size="sm"
            round
            icon="sym_o_delete"
            @click="removeRow(scope.row)"
          />
        </q-td>
        <q-tooltip
          v-if="inRejectedRows(scope.row)"
          class="text-body2"
        >
          This item is not eligible with customer's health plan
        </q-tooltip>
      </q-tr>
    </template>
  </q-table>

  <div
    v-if="bisStore.isLoaded && bisStore.inStockItemsCount > 0"
    class="q-pt-md"
  >
    <div class="text-h6">
      Notify when in stock
    </div>
    <back-in-stock-list
      :flat="true"
      :customer-id="props.customerId"
      :order-id="props.orderId"
    />
  </div>

  <div v-if="rowsGifts.length">
    <div class="text-h6">
      Gifts
    </div>

    <q-table
      flat
      :columns="columnsGifts"
      :rows="rowsGifts"
      hide-pagination
      :pagination="paginationGifts"
    >
      <template #body="scope">
        <q-tr :props="scope">
          <q-td
            key="sku"
            :props="scope"
          >
            {{ scope.row.sku.sku }}
          </q-td>
          <q-td
            key="name"
            :props="scope"
          >
            {{ scope.row.sku.name }}
          </q-td>
          <q-td
            key="actions"
            :props="scope"
          >
            <q-btn
              :loading="deleteRowLoadings.includes(scope.row.id)"
              class="q-ml-sm"
              size="sm"
              round
              icon="sym_o_delete"
              @click="removeRow(scope.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">

import { useOrderStore } from 'stores/order-store'
import { computed, PropType, Ref, ref } from 'vue'
import OrderRowModel, { OrderRowInterface, RejectedRowInterface } from 'src/models/OrderRowModel'
import { useWishlistStore } from 'stores/wishlist-store-multi'
import useProduct from 'src/composables/useProduct'
import BackInStockList from 'components/products/BackInStockList.vue'
import { useBackInStockStore } from 'stores/back-in-stock-store-multi'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  },
  rejectedRows: {
    type: Array as PropType<RejectedRowInterface[]>,
    required: false,
    default: () => []
  }
})

const oStore = useOrderStore()
oStore.init(props.orderId).then(() => {
  console.log('OrderStore initialized')
})
const { createProductListDialog } = useProduct()
const bisStore = useBackInStockStore(props.customerId)

const columns = computed(() => [
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    align: 'left'
  },
  {
    name: 'name',
    label: 'Item',
    field: (row: OrderRowInterface) => row.sku.name,
    align: 'left',
    sortable: true
  },
  {
    name: 'amount',
    label: 'Qty',
    field: 'amount',
    align: 'left',
    sortable: true
  },
  {
    name: 'price',
    label: 'Price',
    field: (row: OrderRowInterface) => (parseFloat(row.price)),
    align: 'left',
    sortable: true
  },
  {
    name: 'subtotal',
    label: 'Subtotal',
    field: (row: OrderRowInterface) => (parseFloat(row.rowPrice)),
    align: 'left',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'right'
  }
])

const columnsGifts = [
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    align: 'left'
  },
  {
    name: 'name',
    label: 'Item',
    field: (row: OrderRowInterface) => row.sku.name,
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'right'
  }
]

const rows = computed(() => {
  if (!oStore.isOrderReady) return []
  return oStore.order?.rows.filter(row => !row.sku.gift) || []
})
const pagination = computed(() => ({
  page: 1,
  rowsPerPage: rows.value.length || 0
}))

const rowsGifts = computed(() => {
  if (!oStore.isOrderReady) return []
  return oStore.order?.rows.filter(row => row.sku.gift) || []
})
const paginationGifts = computed(() => ({
  page: 1,
  rowsPerPage: rowsGifts.value.length || 0
}))

const inRejectedRows = (row: OrderRowModel) => {
  return props.rejectedRows.some((rejectedRow) => {
    return rejectedRow.id === row.sku.id
  })
}

const wlStore = useWishlistStore(props.customerId)

const deleteRowLoadings: Ref<number[]> = ref([])
const removeRow = async (row: OrderRowModel) => {
  deleteRowLoadings.value.push(row.id)
  await oStore.updateOrderProductAmount(props.orderId, row.sku.id, 0)
    .finally(() => {
      deleteRowLoadings.value = deleteRowLoadings.value.filter((id) => id !== row.id)
    })
}
</script>

<style scoped>

</style>
