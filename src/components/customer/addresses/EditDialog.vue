<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.md"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin bg-page"
      :class="{'column': $q.screen.lt.md, 'full-height': $q.screen.lt.md}"
      :style="cardStyles"
    >
      <bricks-dialog-card-title>{{ dialogTitle }}</bricks-dialog-card-title>
      <q-card-section>
        <div class="row justify-between q-pt-md">
          <q-btn
            icon="sym_o_add"
            color="secondary"
            text-color="primary"
            label="Add address"
            @click="initAddAddress"
          />
          <q-toggle
            v-model="showDeleted"
            label="Show deleted"
          />
        </div>

        <q-separator class="q-my-md" />

        <div class="row q-col-gutter-md">
          <customer-addresses-edit-one
            v-if="customer.facility?.address"
            :item="customer.facility.address"
            :edit="false"
            :select-mode="props.selectMode"
            :selected="customer.facility.address.id === props.selectedId"
            @select="onDialogOK($event)"
          />
          <customer-addresses-edit-one
            v-for="(address, key) in addressesList"
            :key="`customer-address-row-${customer.id}-${address.id}-${key}`"
            :item="address"
            :index="key + 1"
            :edit="true"
            :select-mode="props.selectMode"
            :selected="address.id === props.selectedId"
            @edit-call="initEditAddress"
            @select="onDialogOK($event)"
          />
        </div>
      </q-card-section>
    </q-card>
    <app-dialog
      v-model="editShown"
      :title="editFormTitle"
      :loading="loading"
      min-width="900"
    >
      <address-form
        ref="editAddressForm"
        :item="editEntry"
        @saved="afterAddressSaved"
      />
      <template #primary-action>
        <q-btn
          color="primary"
          label="Save"
          :loading="$refs.editAddressForm?.loading"
          @click="$refs.editAddressForm?.submit"
        />
      </template>
    </app-dialog>
  </q-dialog>
</template>

<script setup lang="ts">

import { QForm, useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, Ref, ref } from 'vue'
import AddressModel from 'src/models/AddressModel'
import { useCustomerStore } from 'stores/customer-store'

const props = withDefaults(defineProps<{
  customerId: number
  title?: string | null,
  selectMode?: boolean | null,
  selectedId?: string | null
}>(), {
  title: null,
  selectMode: false,
  selectedId: null
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

interface AddressFormType extends QForm {
  loading: boolean
}

const dialogTitle = computed(() => props.title || 'Addresses')
const showDeleted = ref(false)
const editEntry = <Ref<AddressModel>>ref(new AddressModel())
const editShown = ref(false)
const editAddressForm = <Ref<AddressFormType | null>> ref(null)

const customerStore = useCustomerStore()
const customer = customerStore.getCustomerLazy(computed(() => props.customerId))
const addressesList = computed(() => {
  if (showDeleted.value) {
    return customer.value.addresses || []
  } else {
    return customer.value.addresses?.filter((address: AddressModel) => !address.deleted) || []
  }
})

const initEditAddress = (address: AddressModel) => {
  editEntry.value = address
  editShown.value = true
}
const initAddAddress = () => {
  editEntry.value = new AddressModel({
    firstName: customer.value.firstName,
    lastName: customer.value.lastName
  })
  editShown.value = true
}

const $q = useQuasar()

const cardStyles = computed(() => {
  let minWidth = '400px'
  let maxWidth = '100%'
  if ($q.screen.gt.sm) { // > 1024px
    minWidth = '800px'
    maxWidth = '900px'
  }
  if ($q.screen.gt.md) { // > 1440px
    minWidth = '1000px'
    maxWidth = '1200px'
  }
  return {
    minWidth,
    maxWidth
  }
})

const loading = ref(false)
const editFormTitle = computed(() => {
  if (editEntry.value.id) {
    return 'Edit address'
  } else {
    return 'Add address'
  }
})
const afterAddressSaved = (address: AddressModel) => {
  $q.notify('Address saved')
  editShown.value = false
}
</script>

<style scoped>

</style>
