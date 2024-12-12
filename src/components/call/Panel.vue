<template>
  <div class="row no-wrap items-center">
    <template v-if="callLoading">
      <q-skeleton type="QBtn" />
    </template>
    <template v-if="!callLoading && call">

      <q-btn v-if="call.customer" rounded color="primary" size="sm" class="q-mr-md" no-caps
        :to="{ name: 'customer-details', params: { customerId: call.customer.id } }">
        <span class="text-body2">{{ customerTextIndicator }}</span>
      </q-btn>
      <q-space />
      <customer-place-order-btn v-if="call.customer" class="q-mr-md" element="btn" label=""
        :customer-id="call.customer.id" :type="call.type === 'inbound' ? 'cc_in' : 'cc_out'">
        <bricks-btn-label-tooltip>Make new order</bricks-btn-label-tooltip>
      </customer-place-order-btn>
      <q-btn-dropdown v-if="call.customer" icon="sym_o_magic_button" class="q-mr-md">
        <template #label>
          <bricks-btn-label-tooltip>Request Actions</bricks-btn-label-tooltip>
        </template>
        <q-list>
          <q-item v-close-popup clickable
            :to="{ name: 'customer-new-issues', params: { customerId: call?.customer?.id } }">
            <q-item-section avatar>
              <q-icon name="sym_o_report_problem" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Log Issue</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-close-popup clickable @click="prodRequestDialogCall">
            <q-item-section avatar>
              <q-icon name="sym_o_assignment_add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t('productRequest') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn v-if="!call.customer && $route.name !== 'customers-list'"
        :label="$q.screen.gt.xs ? 'Identify Customer' : ''" class="q-mr-md" icon="sym_o_contact_phone"
        :to="{ name: 'customers' }" />
      <call-timer v-show="$q.screen.gt.sm" :start-time="call.startedAt" class="q-mr-md" />
      <q-btn color="red" :label="$q.screen.gt.sm ? title : ''" @click="showEndCallDialog()" />
    </template>
    <template v-if="!callLoading && !call">

      <q-btn class="q-mr-sm" :style="{ backgroundColor: '#3b82f6', color: '#ffffff' }" title="Order On Behalf"
        @click="initiateCall('order')"> Order On Behalf </q-btn>
      <the-top-create />


      <q-btn class="q-mr-sm" color="green" title="Inbound call" icon="sym_o_phone_callback"
        @click="initiateCall('inbound')" />
      <q-btn color="orange" title="Outbound call" icon="sym_o_phone_forwarded" @click="initiateCall('outbound')" />
    </template>

    <!-- Todo: Replace to a proper single-file dialog -->
    <app-dialog v-model="endCallDialog" title="Select call category" min-width="400px" max-width="600px">
      <call-end-call-form ref="endCallForm" :show-submit-btn="false" @succeed="endCallDialog = false" />
      <template #primary-action>
        <q-btn color="primary" label="Finish Call" :loading="$refs.endCallForm?.submitting"
          @click="$refs.endCallForm.submit()" />
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { CallType, useCall } from 'stores/call'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useProductRequest from 'src/composables/useProductRequest'
import { Notify } from 'quasar'
const callStore = useCall()
const router = useRouter()
const { openCreateDialog: openProductRequestCreateDialog } = useProductRequest()

const title = ref('Finish The Call')
const callLoading = ref(false)
const call = computed(() => {
  return callStore.call
})

const submit = async () => {



}

const endCallDialog = computed({
  get() {
    return callStore.isShowEndCallDialog
  },
  set(value: boolean) {
    callStore.isShowEndCallDialog = value
  }
})

const customerTextIndicator = computed(() => {
  if (!call.value || !call.value.customer) {
    return ''
  }
  return `#${call.value.customer.insuranceId} ${call.value.customer.name}`
})

const getCurrentCall = async () => {
  callLoading.value = true
  try {
    await callStore.getCall()
  } catch (e) {
    // in case a call was not started
  } finally {
    callLoading.value = false
  }
}

const showEndCallDialog = async () => {

  if (title.value == 'Complete Order')
    await callStore.endCall({
      category: '001',
      note: ''
    })
  else
    callStore.showEndCallDialog()
}

const initiateCall = async (type: CallType) => {

  if (type == 'order')
    title.value = 'Complete Order'
  else
    title.value = 'Finish The Call'
  callLoading.value = true
  await callStore.startCall(type)
  callLoading.value = false
  await router.push({ name: 'customers' })
}

const prodRequestDialogCall = async () => {
  if (!callStore.call?.customer?.id) {
    return
  }

  (await openProductRequestCreateDialog(callStore.call.customer.id))
    .onOk(() => {
      // some callback after request is created
      Notify.create({
        message: 'Product request created',
        color: 'positive'
      })
    })
}

onMounted(() => {
  getCurrentCall()
})

</script>
