<template>
  <q-card>
    <q-card-section class="bg-toner">
      <div class="row items-center no-wrap">
        <div class="col">
          <bricks-page-title :padding="false">Order #{{ props.orderId }}</bricks-page-title>
        </div>
        <order-actions :order-id="props.orderId" />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="bg-toner">
      <div class="row q-col-gutter-md">
        <div class="col-4">
          <div class="text-h6">
            Order Information
          </div>
          <q-list>
            <order-details-line
              label="Status"
              :value="oStore.order?.statusName"
              :show-data="oStore.isOrderReady"
            />
            <order-details-line
              label="Created at (Order Date)"
              :show-data="oStore.isOrderReady"
            >
              {{ $helper.dateEst(oStore.order?.createdAt) }}
            </order-details-line>
            <order-details-line
              label="Performer"
              :show-data="oStore.isOrderReady"
            >
              <span v-if="oStore.order?.performer">
                {{ oStore.order?.performer?.name }} ({{ oStore.order?.performer?.email }})
              </span>
              <span v-if="oStore.order?.staff">
                {{ oStore.order?.staff?.name }} ({{ oStore.order?.staff?.email }})
              </span>
            </order-details-line>
            <order-details-line
              label="Order Type"
              :show-data="oStore.isOrderReady"
            >
              {{ capitalize(orderLabel(oStore.order?.type)) || oStore.order?.type }}
              <span v-if="oStore.faxAttachmentType">
                ({{ oStore.faxAttachmentType }})
              </span>
            </order-details-line>
            <order-details-line
              label="Best communication phone"
              :show-data="oStore.isOrderReady"
              :editable="oStore.isOrderReady && oStore.isOrderHasEditableStatus"
            >
              <template #default>
                {{ oStore.order?.phone || '---' }}
              </template>
              <template #item-section>
                <order-editable-phone
                  v-if="oStore.order && oStore.isOrderHasEditableStatus"
                  :order-id="props.orderId"
                />
              </template>
            </order-details-line>
            <order-details-line
              :label="$t('orderConfirmationSentTo')"
              :show-data="oStore.isOrderReady"
              :editable="oStore.isOrderReady && oStore.isOrderHasEditableStatus"
            >
              <template #default>
                {{ oStore.order?.email || '---' }}
              </template>
              <template #item-section>
                <order-editable-email
                  v-if="oStore.order && oStore.isOrderHasEditableStatus"
                  :order-id="props.orderId"
                />
              </template>
            </order-details-line>
            <order-details-line
              label="Order notes"
              :show-data="oStore.isOrderReady"
            >
              <div
                v-for="note in oStore.order?.notes"
                :key="`order${props.orderId}_note_${note.id}`"
              >
                "{{ note.text }}". ({{ note.authorName }})
              </div>
            </order-details-line>
          </q-list>
        </div>
        <div class="col-5">
          <div class="text-h6">
            Shipping Information
          </div>
          <q-list>
            <order-details-line
              label="Shipping Address"
              :show-data="oStore.isOrderReady"
              :editable="oStore.isOrderReady && oStore.isOrderHasEditableStatus"
              @edit-attempt="$refs.shippingAddressDialog.open()"
            >
              <address-output
                :entry="oStore.order?.address"
                full
              />
              <template #item-section>
                <order-editable-address
                  v-if="oStore.isOrderHasEditableStatus"
                  ref="shippingAddressDialog"
                  :order-id="props.orderId"
                />
              </template>
            </order-details-line>
            <order-details-line
              label="Shipping label note for postman"
              :show-data="oStore.isOrderReady"
              :editable="oStore.isOrderReady && oStore.isOrderHasEditableStatus"
            >
              <template #default>
                <div class="white-space-pre">
                  {{ oStore.order?.noteForPostman || '---' }}
                </div>
              </template>
              <template #item-section>
                <order-editable-label-note
                  v-if="oStore.order && oStore.isOrderHasEditableStatus"
                  :order-id="props.orderId"
                />
              </template>
            </order-details-line>
            <order-details-line
              label="Delivery option"
              :show-data="oStore.isOrderReady"
              :value="oStore.order?.carrierName || 'N/A'"
            />
            <order-details-line
              label="Shipped on"
              :show-data="oStore.isOrderReady"
              :value="(oStore.order?.shippedAt) ? $helper.dateEst(oStore.order.shippedAt) : 'N/A'"
            />
          </q-list>
        </div>
        <div class="col-3">
          <div class="text-h6">
            Tracking Info
          </div>
          <order-details-line
            label="Est.Delivery Date"
            :show-data="oStore.isOrderReady"
            :value="(oStore.order?.deliveryDate) ? $helper.dateEst(oStore.order.deliveryDate) : 'N/A'"
          />
          <order-details-line
            :label="$t('trackingLink')"
            :show-data="oStore.isOrderReady"
          >
            <order-track-button
              v-if="oStore.order?.trackingLink && oStore.order?.trackingNumber"
              color="secondary"
              text-color="primary"
              :tracking-code="oStore.order?.trackingNumber as string"
              :tracking-link="oStore.order?.trackingLink as string"
            />
            <span v-else>N/A</span>
          </order-details-line>
          <div v-if="oStore.order?.activePayment">
            <div class="text-h6">
              {{ $t('paymentInfo') }}
            </div>
            <order-details-line
              :label="$t('paymentMethod')"
              :show-data="oStore.isOrderReady"
              :value="oStore.order?.activePayment.processorCode.toUpperCase() || 'N/A'"
            />
            <order-checkout-payment-info-t-r-n-s-x
              v-if="oStore.order?.activePayment.processorCode === $constants.PAYMENT_PROCESSOR_CODE_TRNSX"
              :details="oStore.order?.activePayment.details as PaymentDetailsTRNSXInterface"
            />
            <order-checkout-payment-info-n-a-t-i-o-n-s
              v-if="oStore.order?.activePayment.processorCode === $constants.PAYMENT_PROCESSOR_CODE_NATIONS"
              :details="oStore.order?.activePayment.details as PaymentDetailsNATIONSInterface"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-tabs
      v-model="tab"
      align="left"
    >
      <q-tab
        name="items"
        label="Items"
        active-class="text-primary"
      />
      <q-tab
        name="issues"
        label="Issues"
        active-class="text-primary"
      />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      keep-alive
    >
      <q-tab-panel name="items">
        <order-items
          v-if="oStore.isOrderReady"
          :order="oStore.order"
        />
      </q-tab-panel>
      <q-tab-panel
        class="q-pa-none"
        name="issues"
      >
        <order-issues
          v-if="oStore.isOrderReady && tab === 'issues'"
          :order-id="props.orderId"
          :customer-id="oStore.order?.customer?.id"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useOrderTypes } from 'src/composables/useOrderTypes'
import { format } from 'quasar'
import { PaymentDetailsTRNSXInterface } from 'src/models/Payments'
import { PaymentDetailsNATIONSInterface } from 'src/models/Payments'

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  }
})

const tab = ref('items')

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)
const { capitalize } = format

const { labelByType: orderLabel } = useOrderTypes()

</script>

<style scoped>

</style>
