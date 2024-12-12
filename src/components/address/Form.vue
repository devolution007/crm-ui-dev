<template>
  <q-form
    ref="form"
    autocomplete="off"
    @submit.prevent="submit"
  >
    <slot name="top" />
    <div class="row q-col-gutter-md">
      <div class="col-lg-6">
        <q-input
          v-model="mutableEntry.firstName"
          label="First Name"
          :error="!!serverErrors.firstName"
          :error-message="serverErrors.firstName"
        />
      </div>
      <div class="col-lg-6">
        <q-input
          v-model="mutableEntry.lastName"
          label="Last Name"
          :error="!!serverErrors.lastName"
          :error-message="serverErrors.lastName"
        />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-lg-6">
        <q-input
          v-model="mutableEntry.phone"
          unmasked-value
          :rules="[
            (v: string) => !!v || 'The field is required',
            (v: string) => v.substring(0, 1) === '1' || 'The country code must be +1',
            (v: string) => /^\d{11}$/.test(v) || 'Phone must be valid'
          ]"
          mask="+#(###)###-####"
          :disable="loading"
          aria-autocomplete="none"
          :error="!!serverErrors.number"
          :error-message="serverErrors.number"
          label="Phone"
          placeholder="Phone"
        />
      </div>
      <div class="col-lg-6">
        <q-field
          borderless
          label="Customer phones"
          stack-label
        >
          <template #control>
            <customer-choose-phone
              v-if="customerStore?.customer?.id"
              :customer-id="customerStore?.customer?.id"
              label="Choose from"
              @input="mutableEntry.phone = $event"
            />
          </template>
        </q-field>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-4">
        <q-input
          v-model="mutableEntry.zipCode"
          :error="!!serverErrors.zipCode"
          :error-message="serverErrors.zipCode"
          label="ZIP Code"
        />
      </div>
      <div class="col-12 col-lg-4">
        <q-input
          v-model="mutableEntry.city"
          :error="!!serverErrors.city"
          :error-message="serverErrors.city"
          label="City"
        />
      </div>
      <div class="col-12 col-lg-4">
        <q-select
          v-model="mutableEntry.state"
          :error="!!serverErrors.state"
          :error-message="serverErrors.state"
          label="State"
          :disable="loading"
          :options="constants.USA_STATES"
          map-options
          emit-value
          option-value="code"
          option-label="name"
        />
      </div>
    </div>

    <q-input
      v-model="mutableEntry.addressString"
      class="q-mb-sm"
      :error="!!serverErrors.addressString"
      :error-message="serverErrors.addressString"
      label="Address 1"
      placeholder="First Ave."
      hint="Primary address information and secondary address information (e.g., floor, suite or mail stop number)"
    />

    <q-input
      v-model="mutableEntry.addressOptionalString"
      class="q-mb-sm"
      label="Address 2 (optional)"
      :error="!!serverErrors.addressOptionalString"
      :error-message="serverErrors.addressOptionalString"
      placeholder=""
      hint="building/dorm"
    />

    <q-input
      v-model="mutableEntry.note"
      :error="!!serverErrors.note"
      :error-message="serverErrors.note"
      class="q-mb-sm"
      label="Note (optional)"
      placeholder=""
    />

    <q-btn
      v-show="false"
      type="submit"
    />
  </q-form>
</template>

<script setup lang="ts">

import AddressModel from 'src/models/AddressModel'
import { onMounted, ref, Ref } from 'vue'
import { constants } from 'boot/constants'
import { helper } from 'boot/helper'
import { useCustomerStore } from 'stores/customer-store'
import { QForm, useQuasar } from 'quasar'
import { ErrorContainer } from 'src/types/classes'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from 'axios'

const $q = useQuasar()

interface Props {
  item: AddressModel,
  mode?: 'entity' | 'data',
}

class IErr extends ErrorContainer {
  firstName: string | null = null
  lastName: string | null = null
  number: string | null = null
  zipCode: string | null = null
  city: string | null = null
  state: string | null = null
  addressString: string | null = null
  addressOptionalString: string | null = null
  note: string | null = null
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'entity'
})

const emit = defineEmits(['saved'])

const mutableEntry = <Ref<AddressModel>>ref(new AddressModel())
const loading = ref(false)
const form = ref()

const serverErrors = <Ref<IErr>>ref(new ErrorContainer())

const customerStore = useCustomerStore()

const initValues = () => {
  mutableEntry.value = helper.clone(props.item) as AddressModel
}
onMounted(() => {
  initValues()
})

const saveEntity = async () => {
  serverErrors.value = new IErr()

  loading.value = true

  try {
    if (props.item.id) {
      await customerStore.editAddress({
        address: mutableEntry.value
      })
    } else {
      await customerStore.addAddress({
        address: mutableEntry.value
      })
    }

    emit('saved', mutableEntry.value)
  } catch (error: AxiosError | any) {
    if (error.response && error.response.data && error.response.status === 422) {
      setServerErrors(error.response.data)
      $q.notify('Validation error')
    }
  }
  loading.value = false
}

const submit = async () => {
  if (!await form.value.validate()) {
    return
  }

  if (props.mode === 'entity') {
    await saveEntity()
  } else {
    emit('saved', mutableEntry.value)
  }
}

const setServerErrors = (errors: object) => {
  serverErrors.value = Object.assign(new IErr(), helper.getFirstErrors(errors))
}

defineExpose({
  loading,
  submit,
  setServerErrors
})
</script>
