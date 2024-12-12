<template>
  <div class="row">
    <div class="col-12 col-lg-8">
      <q-list>
        <q-item
          v-for="item in props.order.rows"
          :key="`order${props.order.id}_row_${item.id}`"
        >
          <q-item-section
            top
            avatar
          >
            <q-img
              :src="item.sku.mainImage"
              :alt="item.sku.name"
              width="100px"
              ratio="1"
              fit="scale-down"
            />
          </q-item-section>
          <q-item-section top>
            <div class="text-weight-medium">
              {{ item.sku.name }}
            </div>
            <div class="row q-gutter-md">
              <span class="text-toner">SKU: {{ item.sku.sku }}</span>
              <span class="text-toner">Qty: {{ item.amount }}</span>
              <span class="text-toner">Price: {{ $helper.money(item.price) }}</span>
            </div>
          </q-item-section>
          <q-item-section
            top
            side
          >
            {{ $helper.money(item.rowPrice) }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col-12 col-lg-4">
      <q-list>
        <q-item-label
          header
          class="text-h6"
        >
          Order Total
        </q-item-label>
        <q-item
          dense
        >
          <q-item-section>
            Item(s) Subtotal:
          </q-item-section>
          <q-item-section side>
            {{ $helper.money(order.itemsUnDiscountedSubtotal) }}
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section>
            Shipping Price:
          </q-item-section>
          <q-item-section side>
            {{ $helper.money('0.00') }}
          </q-item-section>
        </q-item>
        <q-item
          v-if="order.promoCode"
          dense
        >
          <q-item-section>
            Promo Code:
          </q-item-section>
          <q-item-section side>
            <div class="font-mono">
              {{ order.promoCode }}
            </div>
          </q-item-section>
        </q-item>
        <q-item
          v-if="order.promosAttached.length"
          dense
        >
          <q-item-section>
            Discounts:
          </q-item-section>
          <q-item-section side>
            <span class="text-positive">
              - {{ $helper.money(order.promosAppliedTotal) }}
            </span>
          </q-item-section>
        </q-item>
        <q-item
          v-for="promo in order.promosAttached"
          :key="`promo-${promo.type}`"
          dense
          class="cursor-inherit"
        >
          <q-item-section side />
          <q-item-section>
            {{ promo.promoName }}
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-item-section>
            Total Price:
          </q-item-section>
          <q-item-section side>
            {{ $helper.money(order.price) }}
          </q-item-section>
        </q-item>
        <q-list class="q-pl-lg">
          <q-item dense>
            <q-item-section>
              Covered by OTC benefit:
            </q-item-section>
            <q-item-section side>
              {{ $helper.money(order.totalPaid) }}
            </q-item-section>
          </q-item>
          <q-item dense>
            <q-item-section>
              Paid by customer:
            </q-item-section>
            <q-item-section side>
              {{ $helper.money('0.00') }}
            </q-item-section>
          </q-item>
          <q-item dense>
            <q-item-section>
              Refund amount:
            </q-item-section>
            <q-item-section side>
              {{ $helper.money(order.totalRefundSum) }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderInterface } from 'src/models/OrderModel'

const props = defineProps<{
  order: OrderInterface
}>()
</script>
