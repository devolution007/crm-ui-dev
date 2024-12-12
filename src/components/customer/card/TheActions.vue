<template>
  <q-card-section
    v-if="! customerStore.isFetching"
    class="q-pb-none"
  >
    <div class="flex justify-between">
      <div>
        <app-back-button
          :fab="false"
          color="default"
          text-color="body"
          round
          :to="{ name: 'customers' }"
          enable-history
        />
      </div>
      <div>
        <q-btn
          v-if="! callStore.call"
          icon="sym_o_phone"
          round
          @click="startCallTypeDialog"
        >
          <q-tooltip class="text-body2">
            {{ $t('startACallWithThisCustomer') }}
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="notIdentifiedYet"
          icon="sym_o_contact_phone"
          color="primary"
          round
          @click="callStore.identify({customerId: customer.id})"
        >
          <q-tooltip class="text-body2">
            {{ $t('identifyCustomerForCurrentCall') }}
          </q-tooltip>
        </q-btn>
        <q-btn
          :loading="loadingBtn"
          icon="sym_o_more_vert"
          round
        >
          <q-menu auto-close>
            <q-list>
              <q-item
                clickable
                @click="customerStore.getCustomer(customer.id)"
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_refresh" />
                </q-item-section>
                <q-item-section>
                  {{ $t('customerCardActionsRefresh') }}
                </q-item-section>
              </q-item>
              <q-item
                v-if="notIdentifiedYet"
                clickable
                @click="callStore.identify({customerId: customer.id})"
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_contact_phone" />
                </q-item-section>
                <q-item-section>
                  {{ $t('identifyCustomerForCurrentCall') }}
                </q-item-section>
              </q-item>
              <q-item
                v-if="! callStore.call"
                clickable
                @click="startCallTypeDialog"
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_phone" />
                </q-item-section>
                <q-item-section>
                  {{ $t('startACallWithThisCustomer') }}
                </q-item-section>
              </q-item>
              <customer-place-order-btn
                v-if="customerStore.hasFeature('faxOrders')"
                :customer-id="customer.id"
                type="fax"
                element="item"
                :label="$t('placeFaxOrder')"
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_fax" />
                </q-item-section>
              </customer-place-order-btn>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">

import { CallType, useCall } from 'stores/call'
import { useCustomerStore } from 'stores/customer-store'
import { computed } from 'vue'
import { Dialog } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const callStore = useCall()
const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

async function initiateCall (type: CallType) {
  callStore.identifying = customer.value.id
  await callStore.startCall(type)
  await callStore.identify({ customerId: customer.value.id })
}

const startCallTypeDialog = () => {
  Dialog.create({
    title: t('startACall'),
    message: t('chooseCallType'),
    options: {
      type: 'radio',
      model: 'callType',
      items: [
        { label: 'Outbound', value: 'outbound', color: 'orange', uncheckedIcon: 'phone_forwarded' },
        { label: 'Inbound', value: 'inbound', color: 'green', uncheckedIcon: 'phone_callback' }
      ],
      isValid: val => !!val && ['inbound', 'outbound'].includes(val as string)
    },
    cancel: true
  }).onOk(async (val) => {
    await initiateCall(val)
  })
}

const notIdentifiedYet = computed(() => callStore.call && !callStore.call?.customer)

const loadingBtn = computed(() => callStore.identifying !== null)
</script>
