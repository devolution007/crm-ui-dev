<script setup lang="ts">
import useVirtualTempCard from 'src/composables/useVirtualTempCard'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  }
})

const {
  setVirtualTempCardNumber,
  virtualTempCardNumber
} = useVirtualTempCard(props.customerId)

</script>

<template>
  <q-item
    dense
    clickable
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('cardNumber') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label
        class="overflow-hidden text-ellipsis"
      >
        {{ virtualTempCardNumber }}
      </q-item-label>
    </q-item-section>
    <q-popup-edit
      v-slot="scope"
      :model-value="virtualTempCardNumber"
      buttons
      :cover="false"
      label-set="Save"
      @save="setVirtualTempCardNumber"
    >
      <q-input
        v-model="scope.value"
        :label="$t('cardNumber')"
        :maxlength="19"
        :minlength="16"
        dense
        autofocus
        data-1p-ignore
        @keyup.enter="scope.set"
      />
    </q-popup-edit>
  </q-item>
</template>

<style scoped>

</style>
