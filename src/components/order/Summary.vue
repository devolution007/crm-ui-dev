<template>
  <div class="row">
    <div class="col-12 col-lg-6">
      <q-list
        v-if="oStore.isOrderReady"
        class="q-mb-md"
      >
        <q-item-label
          header
          class="text-h6"
        >
          Order Total
        </q-item-label>
        <q-item
          dense
          clickable
          class="cursor-inherit"
        >
          <q-item-section>
            Items Subtotal:
          </q-item-section>
          <q-item-section side>
            {{ $helper.money(oStore.order?.itemsUnDiscountedSubtotal) }}
          </q-item-section>
        </q-item>
        <q-item
          dense
          clickable
          class="cursor-inherit"
        >
          <q-item-section>
            Delivery Fee:
          </q-item-section>
          <q-item-section side>
            {{ $helper.money(oStore.order?.deliveryCustomerPrice) }}
          </q-item-section>
        </q-item>
        <q-item
          v-if="oStore.order?.promosAttached.length"
          dense
        >
          <q-item-section>
            Discounts:
          </q-item-section>
          <q-item-section side>
            <span class="text-positive">
              - {{ $helper.money(oStore.order?.promosAppliedTotal) }}
            </span>
          </q-item-section>
        </q-item>
        <q-item
          v-for="promo in oStore.order?.promosAttached"
          :key="`promo-${promo.type}`"
          dense
          clickable
          class="cursor-inherit"
        >
          <q-item-section side />
          <q-item-section>
            {{ promo.promoName }}
          </q-item-section>
        </q-item>
        <q-item
          dense
          clickable
          class="cursor-inherit"
        >
          <q-item-section>
            Total to Pay:
          </q-item-section>
          <q-item-section side>
            <span class="text-weight-bold">{{ $helper.money(oStore.order?.price) }}</span>
          </q-item-section>
        </q-item>
      </q-list>
      <list-skeleton
        v-else
        :items="3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { useOrderStore } from 'stores/order-store'
import ListSkeleton from 'components/tools/ListSkeleton.vue'

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  }
})
const oStore = useOrderStore()
oStore.init(props.orderId)
</script>

<style scoped>

</style>
