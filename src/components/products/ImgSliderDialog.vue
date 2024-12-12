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
          {{ props.product.name }} (SKU: {{ props.product.sku }})
        </div>
        <q-space />
        <q-checkbox
          v-model="fullSize"
          checked-icon="photo_size_select_large"
          unchecked-icon="photo_size_select_small"
          indeterminate-icon="help"
        />
        <q-btn
          v-close-popup
          icon="sym_o_close"
          flat
          round
          dense
        />
      </q-card-section>
      <q-card-section>
        <products-img-slider
          :product="props.product"
          :full-size="fullSize"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import { useDialogPluginComponent, useQuasar } from 'quasar'
import { ProductInterface } from 'src/models/ProductModel'
import { computed, ref } from 'vue'

const props = defineProps<{
  product: ProductInterface
}>()

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const fullSize = ref(false)

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
</script>

<style scoped>

</style>
