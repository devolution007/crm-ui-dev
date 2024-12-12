<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.md"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      :style="cardStyles"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ componentProps.title }}
        </div>
        <q-space />
        <q-btn
          v-close-popup
          icon="sym_o_close"
          flat
          round
          dense
        />
      </q-card-section>
      <q-card-section>
        <q-banner
          v-if="!componentProps.customerId && !componentProps.plan"
          class="bg-red-5"
          dense
          rounded
        >
          The prop customerId or plan is required
        </q-banner>
        <q-table
          :loading="loading"
          :rows="rows"
          separator="horizontal"
          :hide-header="true"
          flat
        >
          <template #body="props">
            <products-list-row
              :props="props"
              :customer-id="componentProps.customerId"
              :order-id="componentProps.orderId"
              @toggle-expand="props.expand = $event"
            />
            <products-details-list-tr
              v-show="props.expand"
              :props="props"
            />
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn
          v-close-popup
          label="Close"
          color="primary"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import { useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, onMounted, ref, watch } from 'vue'
import ProductApi from 'src/api/ProductApi'
import { api } from 'boot/axios'
import { ProductInterface } from 'src/models/ProductModel'

const componentProps = withDefaults(defineProps<{
  productsIds: number[],
  title: string,
  customerId?: number
  plan?: string,
  orderId?: number
}>(), {
  customerId: undefined,
  plan: undefined,
  orderId: undefined
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

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
const rows = ref(<ProductInterface[]>[])

const loadProducts = async () => {
  if (!componentProps.customerId && !componentProps.plan) {
    return
  }
  loading.value = true
  try {
    const response = await (new ProductApi(api)).getProductsByIds(componentProps.productsIds, componentProps.customerId as number, componentProps?.plan)
    rows.value.splice(0, rows.value.length, ...response.items)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
watch(() => componentProps.productsIds, () => {
  loadProducts()
})
</script>

<style scoped>

</style>
