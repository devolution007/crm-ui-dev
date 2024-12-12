<template>
  <div>
    <q-btn
      v-if="! oStore.isAddressSelected"
      label="Select shipping address"
      color="secondary"
      text-color="primary"
      @click="selectDialog"
    />
    <div v-else>
      <q-card
        class="bg-toner"
        flat
      >
        <q-card-section>
          <div class="flex">
            <div class="col-grow">
              <address-output
                full
                :entry="oStore.order?.address"
              />
            </div>
            <div>
              <q-btn
                :loading="loading"
                size="md"
                label="Change"
                outline
                @click="selectDialog"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

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

const emit = defineEmits(['select:error'])

import { useOrderStore } from 'stores/order-store'
import { Dialog } from 'quasar'
import EditDialog from 'components/customer/addresses/EditDialog.vue'
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'

const oStore = useOrderStore()
oStore.init(props.orderId)

const loading = ref(false)

const selectDialog = () => {
  Dialog.create({
    component: EditDialog,
    componentProps: {
      customerId: props.customerId,
      title: 'Select shipping address',
      selectMode: true,
      selectedId: oStore.order?.address?.id || null
    }
  })
    .onOk(async (address) => {
      loading.value = true
      try {
        await oStore.updateFields({
          address
        })
      } catch (e: unknown | AxiosError) {
        if (axios.isAxiosError(e)) {
          let message = 'Unknown error'
          const serverErrors = e.response?.data || {}
          if (serverErrors.general) {
            message = serverErrors.general
          } else if (Object.values(serverErrors).length > 0) {
            const k = Object.keys(serverErrors)[0]
            const v = Object.values(serverErrors)[0]
            message = `${k}: ${v}`
          }
          emit('select:error', message)
        } else {
          emit('select:error', 'Something went wrong.')
        }
      }
      loading.value = false
    })
}
</script>

<style scoped>

</style>
