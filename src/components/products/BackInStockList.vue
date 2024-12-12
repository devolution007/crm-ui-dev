<template>
  <p>
    {{ bisStore.inStockItems.length }} products from your list are available now.
  </p>
  <q-table
    :loading="bisStore.loading"
    :rows="rows"
    separator="horizontal"
    :hide-header="true"
    :flat="componentProps.flat"
  >
    <template #body="props">
      <products-list-row
        :props="props"
        :customer-id="componentProps.customerId"
        :order-id="componentProps.orderId"
        @toggle-expand="props.expand = $event"
      >
        <template #under-name="item">
          <products-detail-row
            :label="item.row.noticeType"
            :value="item.row.noticeTarget"
          />
        </template>
        <template #top-right="item">
          <products-back-in-stock-btn
            :sku="item.row.sku"
            :customer-id="componentProps.customerId"
            mini
          />
        </template>
      </products-list-row>
      <products-details-list-tr
        v-show="props.expand"
        :props="props"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBackInStockStore } from 'stores/back-in-stock-store-multi'

const componentProps = withDefaults(defineProps<{
  customerId: number,
  orderId?: number,
  flat?: boolean
}>(), {
  flat: false,
  orderId: undefined
})

const bisStore = computed(() => useBackInStockStore(componentProps.customerId))

const rows = computed(() => {
  return bisStore.value.items.map((item) => {
    return {
      ...item.product,
      noticeType: item.noticeType,
      noticeTarget: item.noticeTarget
    }
  }).sort((a, b) => {
    return b.inStockAmount - a.inStockAmount
  })
})

</script>

<style scoped>

</style>
