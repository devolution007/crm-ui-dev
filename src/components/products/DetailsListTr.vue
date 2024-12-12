<template>
  <q-tr
    v-show="componentProps.props.expand"
    :props="componentProps.props"
  >
    <q-td
      colspan="100%"
      class="white-space-normal"
    >
      <products-detail-row
        label="Inactive ingr"
        :value="componentProps.props.row.inactiveIngredients"
      />
      <products-detail-row
        label="Symptoms"
        :value="componentProps.props.row.symptoms"
      />
      <products-detail-row
        label="Description"
        :value="componentProps.props.row.description"
      />
    </q-td>
  </q-tr>
</template>

<script setup lang="ts">
import { QTrProps } from 'quasar'
import { ProductInterface } from 'src/models/ProductModel'

interface ProductTrProps extends QTrProps {
  row: ProductInterface
  expand: boolean
}

const componentProps = defineProps<{
  props: ProductTrProps
}>()
</script>
