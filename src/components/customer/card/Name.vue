<template>
  <q-item clickable>
    <q-item-section>
      <q-skeleton
        v-if="customerStore.isFetching || loading"
        type="rect"
        height="29px"
      />
      <q-item-label
        v-else
        class="text-h5"
      >
        {{ customer.firstName }} {{ customer.lastName }}
      </q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-icon
        v-if="! customerStore.isFetching"
        color="grey"
        name="sym_o_edit"
      />
    </q-item-section>

    <q-popup-edit
      v-slot="scope"
      buttons
      :model-value="name"
      :disable="customerStore.isFetching || loading"
      label-set="Save"
      :cover="false"
      :validate="validateAll"
      @save="saveVal"
      @before-show="initPopupFields"
    >
      <q-input
        ref="firstNameInput"
        v-model="firstName"
        label="First name"
        :rules="[v => !!v || 'Required']"
        @update:model-value="writeScopeValue(`${$event} ${customer.lastName}`, scope)"
      />
      <q-input
        ref="lastNameInput"
        v-model="lastName"
        label="Last name"
        :rules="[v => !!v || 'Required']"
        @update:model-value="writeScopeValue(`${customer.firstName} ${$event}`, scope)"
      />
    </q-popup-edit>
  </q-item>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed, watch, ref } from 'vue'
import type { Ref } from 'vue'

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const loading = ref(false)

const firstNameInput = <Ref>ref(null)
const lastNameInput = <Ref>ref(null)
const firstName = ref('')
const lastName = ref('')

const name = ref(`${customer.value.firstName} ${customer.value.lastName}`)
watch(() => customer.value.name, () => {
  name.value = `${customer.value.firstName} ${customer.value.lastName}`
})

const validateAll = () => {
  return lastNameInput.value?.validate() && firstNameInput.value?.validate()
}

const saveVal = async (val: any, valPrev: any) => {
  loading.value = true

  await customerStore.editName({
    firstName: firstName.value,
    lastName: lastName.value,
    customerId: customer.value.id
  })

  loading.value = false
}

const writeScopeValue = (value: string, scope: any) => {
  scope.value = value
  return true
}

const initPopupFields = () => {
  firstName.value = customer.value.firstName
  lastName.value = customer.value.lastName
}

</script>
