<template>
  <q-page padding>
    <!-- content -->
    <bricks-page-title>{{ $t('checkInsuranceCard') }}</bricks-page-title>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8 col-lg-5">
        <q-card>
          <q-card-section>
            <q-form
              ref="form"
              @submit.prevent="submit"
            >
              <customer-insurance-card-validation-form
                ref="cardForm"
                auto-submit
                input-class="q-mb-md"
                @check-success="onCardCheckSuccess"
                @loading-start="showSuccessActions = false"
              />

              <q-btn
                data-cy="card-check-button"
                type="submit"
                :label="$t('doCheckCard')"
                color="primary"
                :loading="cardForm?.isLoading"
              />

              <q-btn
                v-if="showSuccessActions"
                class="q-ml-sm"
                :label="$t('doReset')"
                @click="resetCheck"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div
        v-if="showSuccessActions"
        class="col-12 col-md-8 col-lg-5"
      >
        <q-card>
          <q-card-section>
            <p>{{ $t('detailedInformation') }}</p>
            <bricks-raw-object-output :object="lastResult" />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div
      v-if="showSuccessActions"
      class="q-pt-md"
    >
      <q-btn
        :label="$t('doRegisterNewCustomer')"
        color="primary"
        rounded
        :to="{ name: 'customer-add' }"
      />

      <div
        v-if="relatedCustomers.length > 0"
        class="q-pt-lg row q-col-gutter-md"
      >
        <div class="col-12 col-md-8 col-lg-5">
          <bricks-page-title>{{ $t('customersWithThisCardInProfile') }}</bricks-page-title>
          <q-table
            :rows="relatedCustomers"
            :columns="relatedCustomersColumns"
            :rows-per-page-options="[0]"
            hide-pagination
            @row-click="onRelatedCustomerClick"
          >
            <template #body-cell-actions="scope">
              <q-td :props="scope">
                <q-btn
                  color="secondary"
                  text-color="primary"
                  size="md"
                  icon="sym_o_person_search"
                  :label="$t('viewProfile')"
                  :to="{ name: 'customer-orders', params: { customerId: scope.row.id } }"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import useCardChecker from 'src/composables/useCardChecker'
import { ref, Ref } from 'vue'
import { Notify, QForm, useMeta } from 'quasar'
import { CardValidationForm } from 'components/customer/insurance-card/ValidationForm.vue'
import CustomerApi from 'src/api/CustomerApi'
import { api } from 'boot/axios'
import CustomerModel from 'src/models/CustomerModel'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useMeta({
  title: t('checkInsuranceCard')
})

const form: Ref<QForm | null> = ref(null)
const cardForm: Ref<CardValidationForm | null> = ref(null)
const showSuccessActions = ref(false)
const relatedCustomers: Ref<CustomerModel[]> = ref([])
const relatedCustomersColumns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'birthdateStr',
    label: 'Birthdate',
    field: 'birthdateStr',
    align: 'left'
  },
  {
    name: 'actions',
    label: '',
    field: () => ''
  }
]
const { lastResult, reset, cardNumber } = useCardChecker()

const onCardCheckSuccess = async () => {
  showSuccessActions.value = true

  loadRelatedCustomers().finally()
}
const resetCheck = () => {
  showSuccessActions.value = false
  reset()
}
const loadRelatedCustomers = async () => {
  relatedCustomers.value = []
  try {
    const response = await (new CustomerApi(api)).getCustomers(1, 10, {}, {
      combined: cardNumber.value
    })
    relatedCustomers.value = response.items
  } catch (e) {
    Notify.create({
      message: 'Error while getting related customers',
      color: 'negative'
    })
  }
}

const router = useRouter()
const onRelatedCustomerClick = (evt: MouseEvent, row: CustomerModel) => {
  router.push({ name: 'customer-orders', params: { customerId: row.id } })
}

const submit = () => {
  cardForm.value?.submit()
}
</script>
