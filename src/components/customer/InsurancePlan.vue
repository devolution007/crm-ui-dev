<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import useInsurancePlansList from 'src/composables/useInsurancePlansList'
import { constants } from 'boot/constants'
import { ref } from 'vue'
import CustomerModel from 'src/models/CustomerModel'

const props = withDefaults(defineProps<{
  loading: boolean
  customer: CustomerModel
}>(), {
  loading: false
})
const customerStore = useCustomerStore()

const loading = ref(false)

const {
  plans,
  loading: plansLoading
} = useInsurancePlansList(constants.PROJECT_DOMAIN_METRO)

const editPlan = async (planId: number) => {
  loading.value = true
  await customerStore.editPlan({
    plan: planId,
    customerId: props.customer.id
  })
  loading.value = false
}
</script>

<template>
  <q-item
    dense
    clickable
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('insurancePlan') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="props.loading || loading"
          type="text"
        />
        <span v-else>
          {{ props.customer.insurancePlan?.name || '-' }}
        </span>
      </q-item-label>
    </q-item-section>
    <q-popup-edit
      v-slot="scope"
      :model-value="props.customer.insurancePlan?.id"
      buttons
      :cover="false"
      label-set="Save"
      :disable="props.loading"
      :validate="(val: string) => !(isNaN(Number(val)) || Number(val) < 0)"
      @save="editPlan"
    >
      <q-list>
        <q-item
          v-for="plan in plans"
          :key="`plan_${plan.id}`"
          v-ripple
          dense
          tag="label"
        >
          <q-item-section avatar>
            <q-radio
              v-model="scope.value"
              :val="plan.id"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ plan.name }} ({{ plan.code }})
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-popup-edit>
  </q-item>
</template>

<style scoped>

</style>
