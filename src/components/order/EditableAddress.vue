<template>
  <app-dialog
    v-model="editShown"
    title="Edit delivery address"
    :loading="loading"
    min-width="900"
  >
    <address-form
      ref="editAddressForm"
      :item="editEntry"
      mode="data"
      @saved="onSaveAttempt"
    >
      <template #top>
        <q-banner class="bg-toner q-mb-md">
          <q-icon
            name="sym_o_tips_and_updates"
            color="warning"
            size="sm"
          />
          Changing the delivery address for this order will not change the addresses in the customer profile.
        </q-banner>
      </template>
    </address-form>
    <template #primary-action>
      <q-btn
        color="primary"
        label="Save"
        :loading="$refs.editAddressForm?.loading"
        @click="$refs.editAddressForm?.submit"
      />
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import { Notify, QForm } from 'quasar'
import { AddressDto, AddressModelAbstract } from 'src/models/AddressModel'
import { useOrderStore } from 'stores/order-store'

import { AxiosError } from 'axios'
import { helper } from 'boot/helper'

interface AddressFormType extends QForm {
  loading: boolean,
  setServerErrors: (errors: object) => void
}

const props = defineProps<{
  orderId: number
}>()

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)

const editAddressForm = <Ref<AddressFormType>> ref()
const editShown = ref(false)
const loading = ref(false)

const editEntry = ref(new AddressDto())

const onSaveAttempt = async (address: Record<string, string>) => {
  editAddressForm.value.loading = true

  try {
    await oStore.updateFields({
      address
    })
      .finally(() => {
        editAddressForm.value.loading = false
      })
    editShown.value = false
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    if (axiosError.response && axiosError.response.data && axiosError.response.status === 422) {
      const errs = axiosError.response.data as Record<string, string>
      editAddressForm.value.setServerErrors(helper.unPrefixObject(errs, 'address.'))
      Notify.create('Validation error')
    }
  }
}

defineExpose({
  open: () => {
    if (!oStore.order) return
    editEntry.value = new AddressDto(oStore.order.address as AddressModelAbstract)
    editShown.value = true
  }
})
</script>
