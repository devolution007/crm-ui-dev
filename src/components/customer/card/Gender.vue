<template>
  <q-item
    dense
    clickable
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('gender') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="customerStore.isFetching || loading"
          type="text"
        />
        <div
          v-else
          class="cursor-pointer"
        >
          {{ $t(customer.gender) }}
        </div>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon
        v-if="!customerStore.isFetching"
        color="grey"
        name="sym_o_edit"
      />
    </q-item-section>
    <q-popup-edit
      v-slot="scope"
      :disable="loading"
      :model-value="customer.gender"
      buttons
      label-set="Save"
      :cover="false"
      @save="editGender"
    >
      <q-radio
        v-model="scope.value"
        :val="$constants.GENDER_FEMALE_CODE"
        :label="$t($constants.GENDER_FEMALE_CODE)"
      />
      <q-radio
        v-model="scope.value"
        :val="$constants.GENDER_MALE_CODE"
        :label="$t($constants.GENDER_MALE_CODE)"
      />
    </q-popup-edit>
  </q-item>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed, ref } from 'vue'

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const loading = ref(false)

const editGender = (value: string) => {
  loading.value = true
  customerStore.editGender({
    gender: value,
    customerId: customer.value.id
  })
  loading.value = false
}
</script>
