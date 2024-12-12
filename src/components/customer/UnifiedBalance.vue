<template>
  <!-- <q-item
    dense
    :clickable="customerStore.hasFeature('trnsxMethod')"
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('balance') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="props.loading"
          type="text"
        />
        <span v-else>
          $ {{ customerStore.unifiedBalance }}
        </span>
      </q-item-label>
    </q-item-section>
    <q-popup-edit
      v-if="customerStore.hasFeature('trnsxMethod')"
      v-slot="scope"
      :model-value="virtualTempBalance"
      buttons
      :cover="false"
      label-set="Save"
      :disable="props.loading"
      :validate="(val: string) => !(isNaN(Number(val)) || Number(val) < 0)"
      @save="setVirtualTempBalance"
    >
      <q-input
        v-model="scope.value"
        :label="$t('balanceInfo')"
        dense
        autofocus
        @keyup.enter="scope.set"
      />
    </q-popup-edit>
    
  </q-item> -->
  <q-item
    dense
    :clickable="customerStore.hasFeature('nationsMethod')"
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('balance') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="props.loading"
          type="text"
        />
        <span v-else>
          $ {{ customerStore.unifiedBalance }}
        </span>
      </q-item-label>
    </q-item-section>
    <q-popup-edit
      v-if="customerStore.hasFeature('nationsMethod')"
      v-slot="scope"
      :model-value="virtualTempBalance"
      buttons
      :cover="false"
      label-set="Save"
      :disable="props.loading"
      :validate="(val: string) => !(isNaN(Number(val)) || Number(val) < 0)"
      @save="setVirtualTempBalance"
    >
      <q-input
        v-model="scope.value"
        :label="$t('balanceInfo')"
        dense
        autofocus
        @keyup.enter="scope.set"
      />
    </q-popup-edit>
    
  </q-item>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import useVirtualTempCard from 'src/composables/useVirtualTempCard'

const customerStore = useCustomerStore()

const {
  setVirtualTempBalance,
  virtualTempBalance
} = useVirtualTempCard(customerStore.id)

const props = withDefaults(defineProps<{
  loading: boolean
}>(), {
  loading: false
})
</script>
