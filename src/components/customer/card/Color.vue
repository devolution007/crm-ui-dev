<template>
  <q-item
    dense
    clickable
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('customerColorLabel') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="customerStore.isFetching || loading"
          type="text"
        />
        <q-chip
          v-else
          :color="checkColor(customer.color)"
          square
          text-color="white"
          class="q-ma-none"
        >
          {{ $t(camalize(customer.color)) }}
        </q-chip>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon
        v-if="! customerStore.isFetching"
        color="grey"
        name="sym_o_edit"
      />
    </q-item-section>
    <q-popup-edit
      v-slot="scope"
      :model-value="customer.color"
      buttons
      :cover="false"
      label-set="Save"
      :disable="customerStore.isFetching || loading"
      @save="editColor"
    >
      <q-list>
        <q-item
          v-for="color in colors"
          :key="`color_${color}`"
          v-ripple
          dense
          tag="label"
        >
          <q-item-section avatar>
            <q-radio
              v-model="scope.value"
              :val="color"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-chip
                :color="checkColor(color)"
                square
                text-color="white"
                class="q-ma-none"
                :label="$t(camalize(color))"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-popup-edit>
  </q-item>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed, ref } from 'vue'

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const loading = ref(false)

const editColor = async (color: string) => {
  loading.value = true
  await customerStore.editColor({
    color,
    customerId: customer.value.id
  })
  loading.value = false
}

const colors = [
  'grey',
  'brown',
  'green',
  'orange',
  'red',
  'dark grey',
  'blue'
]

const camalize = (str: string) => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}
const checkColor = (color: string) => {
  return color === 'dark grey' ? 'grey-8' : color
}
</script>
