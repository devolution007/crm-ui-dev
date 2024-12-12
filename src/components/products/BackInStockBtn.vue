<template>
  <template v-if="bisStore.isSkuInList(componentProps.sku)">
    <q-btn
      v-if="! componentProps.mini"
      size="md"
      icon="notifications_active"
      label="Notification Enabled"
      class="q-ml-sm"
      :loading="loading"
      @click="removeItemDialog(componentProps.sku)"
    />
    <q-btn
      v-else
      :size="componentProps.size"
      flat
      dense
      round
      icon="sym_o_delete"
      :loading="loading"
      @click="removeItemDialog(componentProps.sku)"
    />
  </template>
  <template v-else>
    <q-btn
      size="md"
      color="primary"
      icon="sym_o_notification_add"
      label="Notify When in Stock"
      class="q-ml-sm"
      :loading="loading"
      @click="addItemDialog(componentProps.sku)"
    />
  </template>
</template>

<script setup lang="ts">
import { Dialog } from 'quasar'
import { computed, ref } from 'vue'
import { useBackInStockStore } from 'stores/back-in-stock-store-multi'
import { constants } from 'boot/constants'
import OneTask from 'components/tasks/OneTask.vue'
import ProductsListDialog from 'components/products/ListDialog.vue'
import BackInStockDialog from 'components/products/BackInStockDialog.vue'

const componentProps = withDefaults(defineProps<{
  customerId: number
  sku: string,
  size?: string,
  mini?: boolean
}>(), {
  size: 'md',
  mini: false
})

const loading = ref(false)

const bisStore = computed(() => useBackInStockStore(componentProps.customerId))

const removeItemDialog = (sku: string) => {
  Dialog.create({
    title: 'Please confirm',
    message: 'Are you sure you want to delete this item from the customer\'s "Back in stock" list?',
    cancel: true
  }).onOk(async () => {
    loading.value = true
    await bisStore.value.removeSku(sku)
      .finally(() => {
        loading.value = false
      })
  })
}

const addItemDialog = (sku: string) => {
  Dialog.create({
    component: BackInStockDialog,
    componentProps: {
      customerId: componentProps.customerId
    }
  }).onOk(async (value) => {
    loading.value = true
    await bisStore.value.addSku(sku, value.type, value.target)
      .finally(() => {
        loading.value = false
      })
  })
}

</script>

<style scoped>

</style>
