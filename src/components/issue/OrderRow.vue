<template>
  <tr>
    <td>
      <q-checkbox
        v-model="mutableRow.isSelected"
        @change="changeSelected"
      />
    </td>
    <td>
      {{ row.sku.name }}
    </td>
    <td>{{ row.sku.sku }}</td>
    <td>{{ row.amount }}</td>
    <td>{{ row.price }}</td>
  </tr>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { orderRowsForm } from 'src/types'

const props = defineProps<{
  row: orderRowsForm
}>()

const mutableRow = ref<orderRowsForm>({ ...props.row })

const emit = defineEmits(['change:selected'])

function changeSelected () {
  emit('change:selected', mutableRow)
}

</script>
