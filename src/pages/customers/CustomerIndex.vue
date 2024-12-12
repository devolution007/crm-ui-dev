<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
        <q-card
          class="q-pb-md"
          :style="customerStore.cardStyle"
        >
          <customer-card-the-actions />

          <q-list>
            <customer-card-name />
            <div class="row items-center no-wrap q-px-sm q-mb-sm">
              <div class="col-auto truncate-chip-labels">
                <q-chip
                  v-if="! customerStore.isFetching"
                  :clickable="false"
                  :ripple="false"
                  outline
                  square
                  :color="(customer.registered) ? 'green' : 'orange'"
                  tabindex="-1"
                  :icon="(customer.registered) ? 'sym_o_done' : 'sym_o_warning'"
                >
                  <div class="ellipsis">
                    {{ customer.registered ? $t('customerRegisteredStatusYes') : $t('customerRegisteredStatusNo') }}
                  </div>
                </q-chip>
                <q-skeleton
                  v-else
                  type="rect"
                  height="28px"
                  class="q-ma-xs"
                />
              </div>
            </div>
            <customer-card-tags-edit />
            
            <CustomerRepresentative
              :loading="isCustomerLoading"
              :customer="customer"
            />
            <q-item dense>
              <q-item-section class="section-label">
                <q-item-label caption>
                  {{ $t('status') }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-skeleton
                    v-if="isCustomerLoading"
                    type="QChip"
                  />
                  <customer-status
                    v-if="! isCustomerLoading && customer.status"
                    :status="customer.status"
                    square
                    class="q-ma-none"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <customer-member-info
              v-if="customerStore.hasFeature('memberInfo')"
              :customer="customer"
              :loading="isCustomerLoading"
            />
            <customer-insurance-info
              v-if="customerStore.hasFeature('insuranceInfo')"
              :customer="customer"
              :loading="isCustomerLoading"
            />
            <customer-insurance-company-info
              v-if="customer.insuranceCompany"
              :customer="customer"
              :loading="isCustomerLoading"
            />
            <CustomerUnifiedBalance
              :loading="isCustomerLoading"
            />
            <CustomerVirtualCard
              v-if="customerStore.hasFeature('trnsxMethod')"
              :loading="isCustomerLoading"
              :customer-id="props.customerId"
            /> 
            <!-- <CustomerVirtualCard
              v-if="customerStore.hasFeature('nationsMethod')"
              :loading="isCustomerLoading"
              :customer-id="props.customerId"
            /> -->
            <CustomerInsurancePlan
              v-if="customerStore.hasFeature('insurancePlans')"
              :customer="customer"
            />

            <customer-card-color />

            <customer-card-heading
              v-if="customerStore.hasFeature('insuranceCards')"
              :label="$t('insuranceCards')"
              icon="sym_o_card_membership"
              :editable="! customerStore.isFetching"
              :edit-call="customerStore.openInsuranceCardsEditDialog"
            />
            <customer-insurance-cards-preview
              v-if="customerStore.hasFeature('insuranceCards')"
              :customer="customer"
            />
            <tools-list-skeleton v-if="customerStore.hasFeature('insuranceCards') && isCustomerLoading" />

            <customer-card-heading
              :label="$t('customerPersonalDataLabel')"
              icon="sym_o_person"
            />
            <customer-card-gender />

            <Customer-card-birthdate />

            <customer-card-languages-edit />

            <customer-card-heading
              :label="$t('customerEmailsLabel')"
              icon="sym_o_alternate_email"
              :editable="! customerStore.isFetching"
            >
              <template #edit="{dialogOpen}">
                <customer-emails-edit :edit-modal-shown="dialogOpen" />
              </template>
            </customer-card-heading>
            <customer-emails-preview v-if="! customerStore.isFetching" />
            <tools-list-skeleton v-else />

            <customer-card-heading
              :label="$t('customerPhonesLabel')"
              icon="sym_o_dialpad"
              :editable="! customerStore.isFetching"
            >
              <template #edit="{dialogOpen}">
                <customer-phones-edit :edit-modal-shown="dialogOpen" />
              </template>
            </customer-card-heading>
            <customer-phones-preview v-if="! customerStore.isFetching" />
            <tools-list-skeleton v-else />

            <customer-card-heading
              :label="$t('addresses')"
              icon="sym_o_pin_drop"
              :editable="! customerStore.isFetching"
              :use-optimal-modal-width="true"
              :edit-call="() => $q.dialog({
                component: EditDialog,
                componentProps: {
                  customerId: customer.id,
                },
              })"
            />
            <customer-addresses-preview v-if="! customerStore.isFetching" />
            <tools-list-skeleton v-else />

            <customer-card-heading
              :label="$t('facility')"
              icon="sym_o_monitor_heart"
            />
            <customer-facility-info
              v-if="! customerStore.isFetching && customer.facility"
              :facility="customer.facility"
            />
            <tools-list-skeleton v-if="customerStore.isFetching" />
          </q-list>
        </q-card>
      </div>
      <div class="col-12 col-md-8 col-lg-9 q-px-md">
        <q-tabs
          v-if="['customer-orders', 'customer-notes', 'customer-issues', 'customer-history'].includes($route.name)"
          align="left"
          class="q-mb-md bg-transparent"
        >
          <q-route-tab
            :to="{ name: 'customer-orders' }"
            :label="$t('orders')"
            exact
          />
          <q-route-tab
            :to="{ name: 'customer-notes' }"
            :label="$t('notes')"
            exact
          >
            <q-badge
              v-if="customerStore.isReady && customerStore.customer?.notes?.length > 0"
              floating
            >
              {{ customerStore.customer?.notes?.length }}
            </q-badge>
          </q-route-tab>
          <q-route-tab
            to="issues"
            :label="$t('issues')"
            exact
          />
          <q-route-tab
            to="history"
            :label="$t('history')"
            exact
          />
        </q-tabs>
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCustomerStore } from 'stores/customer-store'
import { useMeta } from 'quasar'
import EditDialog from 'components/customer/addresses/EditDialog.vue'
import { useCall } from 'stores/call'
import useCardChecker from 'src/composables/useCardChecker'

const props = defineProps<{
  customerId: number,
  justRegistered: boolean
}>()

useMeta({
  title: `Customer profile #${props.customerId}`
})

const customerStore = useCustomerStore()

const isCustomerLoading = customerStore.getLoadingComputed()
const customer = customerStore.getCustomerLazy(
  computed(() => props.customerId)
)

customerStore.init(props.customerId)
  .then(() => {
    const cardChecker = useCardChecker()
    if (props.justRegistered && customerStore.hasFeature('insuranceCards') && !!cardChecker.lastResult.value) {
      customerStore.openInsuranceCardsEditDialog(true)
    }

    const callStore = useCall()
    if (props.justRegistered && callStore.isCallActive && !callStore.isCallIdentified) {
      callStore.identify({
        customerId: props.customerId
      })
    }
  })
</script>
<style lang="scss">
.section-label {
  max-width: 100px;
}
</style>
