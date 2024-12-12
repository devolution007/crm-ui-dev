<template>
  <q-popup-edit
    v-if="oStore.isOrderReady"
    v-slot="scope"
    ref="popupEdit"
    :model-value="oStore.order?.noteForPostman"
    buttons
    persistent
    :cover="false"
    label-set="Save"
    :validate="validate"
    @before-show="beforeShow"
  >
    <q-input
      v-model="scope.value"
      type="textarea"
      :rules="[val => (val && val.length <= 255) || 'Max 255 characters']"
      autofocus
      counter
      @keyup.enter.stop
    />
  </q-popup-edit>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios'
import { computed, ref } from 'vue'
import { Notify, QPopupEdit } from 'quasar'
import { useOrderStore } from 'stores/order-store'

const props = defineProps<{
  orderId: number
}>()

const orderIdC = computed(() => props.orderId)
const oStore = useOrderStore()
oStore.initWatch(orderIdC)

const properlySaved = ref(false)

const popupEdit = ref<QPopupEdit>()

const beforeShow = () => {
  properlySaved.value = false
}

/**
 * There is a little hack here. We need to keep the popup open until the server confirms that the note was saved.
 * (to prevent from accidentally closing the popup and losing the note when the server is returning an error)
 */
const validate = (value: string) => {
  if (properlySaved.value) {
    return true
  }

  save(value)
    .then(() => {
      properlySaved.value = true
      popupEdit.value?.set()
    })

  return properlySaved.value
}

const save = async (value: string) => {
  try {
    await oStore.updateFields({
      noteForPostman: value
    })
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    if (axiosError.response && axiosError.response.data && axiosError.response.status === 422) {
      Notify.create('Validation error')
    }
    throw error
  }
}
</script>
