<template>
  <q-list class="q-list-dense-full">
    <q-item>
      <q-item-section>
        <q-item-label caption>
          {{ $t('order') }} #
        </q-item-label>
        <q-item-label>
          <q-btn
            color="secondary"
            text-color="primary"
            dense
            :to="{ name: 'customer-order-details', params: {
              customerId: props.customerId,
              orderId: props.order.id
            } }"
          >
            #{{ props.order.id }}
          </q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption>
          {{ $t('tracking') }} #
        </q-item-label>
        <q-item-label>
          <AppLink
            link=""
            :label="props.order.trackingNumber"
            :target-blank="true"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption>
          {{ $t('carrier') }}
        </q-item-label>

        <q-item-label>
          {{ props.order.carrierName }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption>
          {{ $t('estDeliveryDate') }}
        </q-item-label>

        <q-item-label>
          {{ props.order.shippedAt && $helper.dateEst(props.order.shippedAt) }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import OrderModel from 'src/models/OrderModel'
import CustomerModel from 'src/models/CustomerModel'

const props = defineProps<{
  order: OrderModel,
  customerId: number
}>()
</script>
