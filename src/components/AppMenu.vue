<template>
  <q-list>
    <q-item
      v-ripple
      clickable
      :to="{ name: 'dashboard' }"
    >
      <q-item-section avatar>
        <q-icon name="sym_o_dashboard" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ $t('dashboard') }}</q-item-label>
      </q-item-section>
    </q-item>
    <bricks-menu-expansion-item
      v-if="authStore.hasAccessFeature(FEATURE_ACCESS_PAGE_CUSTOMERS)"
      icon="sym_o_people"
      :to="{ name: 'customers' }"
      :label="$t('customers')"
      :active-routes="['customers', 'customer-orders', 'customer-add']"
      :items="[{ label: 'Customers list', to: { name: 'customers'} }, { label: 'Register new', to: { name: 'customer-add' }, hide: $route.name !== 'customer-add' }]"
    />
    <q-item
      v-ripple
      clickable
      :to="{ name: 'card-check' }"
    >
      <q-item-section avatar>
        <q-icon name="sym_o_card_membership" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Check Insurance Card</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-if="authStore.hasAccessFeature(FEATURE_ACCESS_PAGE_TARGETS)"
      v-ripple
      clickable
      to="/target-list"
    >
      <q-item-section avatar>
        <q-icon name="tune" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ $t('targetList') }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-if="authStore.hasAccessFeature(FEATURE_ACCESS_PAGE_CATALOG_SYNC)"
      v-ripple
      clickable
      :to="{ name: 'catalog-sync' }"
    >
      <q-item-section avatar>
        <q-icon name="storage" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ $t('catalogSync') }}</q-item-label>
      </q-item-section>
    </q-item>

    <bricks-menu-expansion-item
      v-if="authStore.hasAccessFeature(FEATURE_ACCESS_PAGE_FACILITIES)"
      icon="sym_o_business"
      :label="$t('facilities')"
      :to="{ name: 'facility-list' }"
      :active-routes="['facility-edit', 'facility-view', 'facility-add', 'staff', 'staff-edit']"
      :items="[{ label: $t('facilityList'), to: { name: 'facility-list'} }, { label: $t('associations'), to: { name: 'facility-associations' } },
               { label: $t('staffList'), to: { name: 'staff-list'}, accessFeature: FEATURE_ACCESS_PAGE_STAFF },
               { label: 'Add Staff', to: { name: 'staff-add' }, accessFeature: FEATURE_ACCESS_PAGE_STAFF }]"
    />

    <bricks-menu-expansion-item
      v-if="authStore.hasAccessFeature(FEATURE_ACCESS_PAGE_REPORTS)"
      icon="sym_o_insights"
      :label="$t('reports')"
      :active-routes="['refunds-list', 'refund-details']"
      :items="reportsItems"
    />
    <bricks-menu-expansion-item
      v-if="authStore.hasAccessFeature(FEATURE_ACCESS_PAGE_BROKERS)"
      icon="sym_o_handshake"
      :to="{ name: 'brokers-list' }"
      :label="$t('brokers')"
      :active-routes="['brokers', 'broker-agencies']"
      :items="[{ label: t('brokers'), to: { name: 'brokers-list' } }, { label: t('brokerAgencies'), to: { name: 'broker-agencies' }}]"
    />
  </q-list>
</template>
<script setup lang="ts">
import {
  FEATURE_ACCESS_PAGE_BROKERS,
  FEATURE_ACCESS_PAGE_CATALOG_SYNC, FEATURE_ACCESS_PAGE_CUSTOMERS, FEATURE_ACCESS_PAGE_FACILITIES,
  FEATURE_ACCESS_PAGE_REFUNDS, FEATURE_ACCESS_PAGE_REPORTS,
  FEATURE_ACCESS_PAGE_STAFF, FEATURE_ACCESS_PAGE_TARGETS,
  useAuthStore
} from 'stores/auth-store'
import { useI18n } from 'vue-i18n'
import { MenuExpansionItem } from 'src/types'
const { t } = useI18n()

const authStore = useAuthStore()

const reportsItems: MenuExpansionItem[] = [
  {
    label: t('orders'),
    to: { name: 'report-orders' },
    icon: 'sym_o_shopping_cart'
  },
  {
    label: t('calls'),
    to: { name: 'report-calls' },
    icon: 'sym_o_settings_phone'
  },
  {
    label: t('refunds'),
    to: { name: 'refunds-list' },
    icon: 'sym_o_remove_shopping_cart',
    accessFeature: FEATURE_ACCESS_PAGE_REFUNDS
  },
  {
    label: t('issues'),
    to: { name: 'report-issues' },
    icon: 'sym_o_report_problem'
  },
  {
    label: t('productRequest'),
    to: { name: 'report-product-request' },
    icon: 'sym_o_assignment'
  },
  {
    label: t('contactRequest'),
    to: { name: 'report-contact-request' },
    icon: 'sym_o_contact_support'
  },
  {
    label: t('facilities'),
    to: { name: 'report-facilities' },
    icon: 'sym_o_business'
  },
  {
    label: t('ordersSchedule'),
    to: { name: 'report-orders-schedule' },
    icon: 'sym_o_summarize'
  },
  {
    label: t('backInStock'),
    to: { name: 'report-back-in-stock' },
    icon: 'sym_o_cloud_sync'
  }
]
</script>
