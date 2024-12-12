<template>
  <p>
    To complete the payment, please transfer all the required data to the <a
      href="https://www.trnsxmobile.com/"
      class="text-primary"
      target="_blank"
    >TRNSX (InComm Payment System)</a> Or the Nations benefit terminal
  </p>

  <div class="text-subtitle1 q-mb-sm">
    {{ $t('orderItems') }}
  </div>
  <div class="q-mb-md">
    <div
      v-for="row in props.orderInfo.rows"
      :key="`order${props.orderInfo.id}_row_${row.id}`"
      class="row q-mb-lg"
    >
      <div class="col-12 col-sm-6 col-md-4">
        <bricks-check-input-copy
          :model-value="row.upc"
          :label="$t('upc')"
          outlined
          readonly
          :hint="row.name"
        />
      </div>
      <div class="col-12 col-sm-4 col-md-4 q-pl-md">
        <bricks-check-input-copy
          :model-value="row.price"
          :label="$t('pricePerItem')"
          outlined
          readonly
        />
      </div>
      <div class="col-12 col-sm-2 col-md-2 q-pl-md">
        <q-input
          v-model="row.amount"
          :label="$t('amount')"
          outlined
          readonly
          :hint="row.amount > 1 ? `Row price ${row.rowPrice}` : ''"
        />
      </div>
    </div>
  </div>

  <div class="text-subtitle1 q-mb-sm">
    {{ $t('paymentMethod') }}
  </div>
  <div class="row q-mb-md">
    <div class="col-12 col-md-5">
      <bricks-check-input-copy
        :model-value="props.card"
        :label="$t('cardNumber')"
        outlined
        readonly
      />
    </div>
  </div>

  <div class="text-subtitle1 q-mb-sm">
    {{ $t('totalPrice') }}
  </div>
  <div class="text-body1">
    <strong>{{ $helper.money(orderInfo.price) }}</strong>
  </div>
  <q-splitter
    :model-value="1"
    class="q-mt-md q-mb-md"
    horizontal
  />
  <div>
    <div class="row">
      <div class="col-3">
        <q-input
          v-model="receiptNumber"
          standout
          :label="$t('receiptNumber')"
          :rules="[(v) => !!v || $t('fieldIsRequired')]"
          @change="checkReady"
        />
      </div>
      <div class="col-9 q-pl-md q-pt-sm">
        {{ $t('pleaseEnterReceiptNumberTRNSX') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderPaymentInfoInterface } from 'src/models/OrderModel'
import { Ref, ref } from 'vue'

const props = defineProps<{
  card: string,
  orderInfo: OrderPaymentInfoInterface
}>()

const receiptNumber: Ref<string> = ref('')

const emit = defineEmits(['ready', 'notReady'])

const checkReady = () => {
  if (receiptNumber.value) {
    emit('ready', {
      receiptNumber: receiptNumber.value
    })
  } else {
    emit('notReady')
  }
}
</script>

<style scoped>

</style>
