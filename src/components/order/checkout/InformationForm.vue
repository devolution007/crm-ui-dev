<template>
  <q-select
    class="q-mb-sm"
    :model-value="oStore.order?.phone"
    :options="validPhones"
    map-options
    emit-value
    label="Best phone to reach you about the order"
    :loading="loadingFields.includes('phone')"
    :error="!!serverErrors.phone"
    :error-message="serverErrors.phone"
    @update:model-value="saveEntity({ phone: $event })"
  />

  <q-select
    class="q-mb-sm"
    :model-value="oStore.order?.email"
    :options="emails"
    map-options
    emit-value
    label="Send order confirmation to"
    :loading="loadingFields.includes('email')"
    :error="!!serverErrors.email"
    :error-message="serverErrors.email"
    @update:model-value="saveEntity({ email: $event })"
  />

  <q-input
    v-model="noteForPostman"
    class="q-mb-sm"
    label="Shipping label note for postman"
    counter
    debounce="500"
    bottom-slots
    maxlength="32"
    :error="!!serverErrors.noteForPostman"
    :error-message="serverErrors.noteForPostman"
    @update:model-value="saveEntity({noteForPostman: $event})"
  >
    <template #counter>
      <div>{{ noteForPostman.length }}/32</div>
    </template>
  </q-input>

  <div
    v-if="oStore.order?.type !== $constants.ORDER_TYPE_FAX"
    class="q-mb-md"
  >
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-6">
        <q-checkbox
          v-model="onBehalfOfPOA"
          label="Order placed by member’s POA / relative"
          @update:model-value="saveOnBehalfOfPOA"
        />
      </div>
      <div class="col-12 col-lg-6">
        <q-input
          v-if="onBehalfOfPOA"
          v-model="poaName"
          debounce="500"
          label="POA / relative name"
          data-1p-ignore
          @update:model-value="savePoaName"
        />
      </div>
    </div>
  </div>

  <div class="q-mb-md">
    <q-input
      v-model="notesBuffer"
      label="Common notes"
      outlined
      debounce="500"
      :hint="!notesBuffer ? 'Any points about the order' : null"
      :bottom-slots="!notesBuffer"
      type="textarea"
      :error="!!serverErrors.notes"
      :error-message="serverErrors.notes"
      :rows="notesRowsCount"
      @update:model-value="saveNoteBuffer"
    />
  </div>

  <div
    v-if="oStore.order?.type === $constants.ORDER_TYPE_FAX"
    class="q-mb-md"
  >
    <div class="text-h6">
      Fax Form Information
    </div>
    <order-checkout-fax-saver
      :order-id="props.orderId"
      :customer-id="props.customerId"
      :server-errors="serverErrors.faxAttachments || {}"
      :loading="loadingFields.includes('faxAttachments')"
      @save:requested="saveEntity({faxAttachments: $event})"
      @input:field="serverErrors.faxAttachments[$event.field] = null"
    />
  </div>
  <div>
    <div class="text-h6 q-mb-md">
      Coupon Code
    </div>

    <div class="max300px">
      <q-input
        v-model="promoCode"
        label="Coupon Code"
        outlined
        debounce="500"
        autocorrect="off"
        spellcheck="false"
        autocomplete="off"
        readonly
        onfocus="this.removeAttribute('readonly');"
        :bottom-slots="!promoCode"
        :error="!!serverErrors.promoCode"
        :error-message="serverErrors.promoCode"
      >
        <template #after>
          <q-btn
            label="Apply"
            :loading="loadingFields.includes('promoCode')"
            @click="saveEntity({ promoCode: promoCode })"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref, inject } from 'vue'
import { EventBus } from 'quasar'

const bus = inject('bus') as EventBus
const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['saved', 'save:error', 'save:start', 'save:end'])

import { useOrderStore } from 'stores/order-store'
import { ErrorContainer } from 'src/types/classes'
import { helper } from 'boot/helper'
import axios, { AxiosError } from 'axios'
import { OrderInputPatch } from 'src/models/OrderModel'
import { useCustomerStore } from 'stores/customer-store'
import BUS_EVENT from 'src/types/bus-events'

const noteForPostman = ref('')
const notesBuffer = ref('')
const notesActive: Ref<boolean> = ref(false)
const phone: Ref<string> = ref('')
const email: Ref<string> = ref('')
const promoCode: Ref<string> = ref('')
const onBehalfOfPOA: Ref<boolean> = ref(false)
const poaName: Ref<string> = ref('')

class IErr {
  general: string | null = null
  noteForPostman = null
  faxAttachments = {}
}

const serverErrors = <Ref<IErr>>ref({
  noteForPostman: null,
  faxAttachments: {}
})

const notePoaValue = 'POA/relative: '
function extractPoaValueFromNote () {
  if (notesBuffer.value.startsWith(notePoaValue)) {
    const poaName = notesBuffer.value.substring(notePoaValue.length, notesBuffer.value.indexOf('\n') - 1)
    if (poaName) {
      notesBuffer.value = notesBuffer.value.split('\n').slice(1).join('\n')
      return poaName
    }
  }
  return ''
}

const oStore = useOrderStore()
oStore.init(props.orderId).then(() => {
  console.log('oStore.order', oStore.order)
  noteForPostman.value = oStore.order?.noteForPostman || ''
  notesBuffer.value = oStore.order?.notes[0]?.text || ''
  promoCode.value = oStore.order?.promoCode || ''
  onBehalfOfPOA.value = oStore.order?.onBehalfOfPOA || false
  if (notesBuffer.value !== '') {
    poaName.value = extractPoaValueFromNote()
  }
})

const setServerErrors = (errors: object) => {
  serverErrors.value = Object.assign(new IErr(), helper.getFirstErrors(errors))
}

const loading = ref(false)
const loadingFields: Ref<string[]> = ref([])

function nullToEmpty (value: string | number | boolean | null) {
  if (value === null) {
    return ''
  }
  return value
}
function objectValuesNullToEmpty (obj: OrderInputPatch) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, nullToEmpty(value)]))
}

const saveEntity = async (patch: OrderInputPatch) => {
  serverErrors.value = new IErr()

  emit('save:start')
  loading.value = true
  loadingFields.value = Object.keys(patch)

  try {
    await oStore.updateFields(objectValuesNullToEmpty(patch))
    bus.emit(BUS_EVENT.ORDER_PATCHED, oStore.orderId, patch)
    emit('saved', patch)
  } catch (e: unknown | AxiosError) {
    if (axios.isAxiosError(e)) {
      let message = 'Unknown error'
      const serverErrors = helper.getFirstErrors(e.response?.data || {}) as { [key: string]: string }
      if (serverErrors.general) {
        message = serverErrors.general
      } else if (Object.values(serverErrors).length > 0) {
        message = Object.values(serverErrors)[0]
      }
      if (e.response && e.response.data && e.response.status === 422) {
        setServerErrors(e.response.data)
        message = 'Validation error. Please check the form'
      }
      emit('save:error', message)
    } else {
      emit('save:error', 'Something went wrong.')
    }
  }

  loading.value = false
  loadingFields.value = []
  emit('save:end')
}

const cStore = useCustomerStore()
cStore.init(props.customerId)

type SelectOption = {
  label: string
  value: string | null
}

const validPhones = computed(() => {
  let phones: SelectOption[] = [{ label: '-- not selected --', value: null }]

  if (!cStore.isReady) return phones

  phones = phones.concat(cStore.customer?.phones?.filter(phone => !!phone.isValid).map(p => {
    return {
      label: p.formattedPhone,
      value: p.phone
    }
  }) as SelectOption[] || [])

  return phones
})

const emails = computed(() => {
  let opts: SelectOption[] = [{ label: '-- not selected --', value: null }]

  if (!cStore.isReady) return opts

  opts = opts.concat(cStore.customer?.emails?.map(p => {
    return {
      label: p.value,
      value: p.value
    }
  }) as SelectOption[] || [])

  return opts
})

defineExpose({
  loading
})

const notesRowsCount = computed(() => {
  return notesBuffer.value.split('\n').length + 1
})

const savePoaName = async () => {
  await saveNoteBuffer(notesBuffer.value)
}
const saveNoteBuffer = async (value: string) => {
  let savingValue = value
  if (poaName.value !== '') {
    savingValue = `${notePoaValue}${poaName.value}.\n${value}`
  }
  await saveEntity({ notes: savingValue })
}
const saveOnBehalfOfPOA = async (value: string | boolean) => {
  await saveEntity({ onBehalfOfPOA: !!value })
  if (!value) {
    poaName.value = ''
    await saveNoteBuffer(notesBuffer.value)
  }
}
</script>

<style scoped>

</style>
