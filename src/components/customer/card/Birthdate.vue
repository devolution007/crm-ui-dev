<template>
  <q-item
    dense
    clickable
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('birthdate') }}
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
          {{ customer.birthdateStr }}
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
      :model-value="fromatedBirthdate"
      buttons
      label-set="Save"
      :cover="false"
      @save="editBirthdate"
    >
    <app-date-picker
      v-model="scope.value"
      label="Birthdate"
    />
    <!-- <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="scope.value"
            mask="YYYY-MM-DD"
            today-btn
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                :label="$t('close')"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon> -->
    </q-popup-edit>
  </q-item>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed, ref } from 'vue'
import moment from 'moment'

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)
const fromatedBirthdate = computed(() => moment(String(customerStore.customer.birthdateStr)).format('YYYY-MM-DD'))

const loading = ref(false)

const editBirthdate = (value: string) => {
  loading.value = true
  customerStore.editBirthdate({
    birthdate: value,
    customerId: customer.value.id
  })
  loading.value = false
}
</script>
