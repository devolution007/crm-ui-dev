<template>
  <q-table
    v-model:selected="selected"
    :loading="loading"
    binary-state-sort
    :rows-per-page-options="[0]"
    :rows="params.customerPagination.items"
    hide-pagination
    :columns="columns"
    selection="multiple"
    :selected-rows-label="getSelectedString"
    :visible-columns="visibleColumns"
    flat
  >
    <template #top>
      {{ $t('customers') }}
      <q-space />
      <q-btn
        v-show="selected.length > 0"
        color="primary"
        dark
        class="mb-2"
        @click="createTasksForSelectedCustomers"
      >
        {{ $t('createTasks') }}
      </q-btn>
    </template>
  </q-table>
  <div class="row justify-center q-mt-md">
    <q-pagination
      v-model="page"
      :max="params.customerPagination.totalPages"
      max-pages="10"
    />
    <div class="q-ml-md">
      {{ $t('results') }}
      <q-badge
        v-if="helper.filterApplied && params.customerPagination.totalItemCount && !loading"
        align="top"
        color="green"
      >
        {{ params.customerPagination.totalItemCount }}
      </q-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CustomerModel from 'src/models/CustomerModel'
import { computed, ref, watch } from 'vue'
import { CustomerList } from 'src/types'
import { helper } from 'boot/helper'
import { Expression } from 'components/target-list/constants'
import useTasks from 'src/composables/useTasks'

const params = withDefaults(defineProps<{
  customerPagination: CustomerList
  loading: boolean,
  queryBody: Expression[],
  queryId: number|null
}>(), {
  queryId: null
})

const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: (row: CustomerModel) => row.id,
    sortable: false
  },
  {
    name: 'name',
    required: true,
    label: t('name'),
    align: 'left',
    field: (row: CustomerModel) => row.name,
    sortable: false
  },
  {
    name: 'insuranceId',
    required: true,
    label: t('insuranceId'),
    align: 'left',
    field: (row: CustomerModel) => row.insuranceId,
    sortable: false
  },
  {
    name: 'customer.status',
    required: false,
    label: t('status'),
    align: 'left',
    field: (row: CustomerModel) => row.status,
    sortable: false
  },
  {
    name: 'plan.organizationPlanId',
    required: false,
    label: t('plan'),
    align: 'left',
    field: (row: CustomerModel) => row.insurancePlan.name,
    sortable: false
  },
  {
    name: 'customer.confirmed',
    required: false,
    label: t('registered'),
    align: 'left',
    field: (row: CustomerModel) => row.registered,
    sortable: false
  },
  {
    name: 'customer.color',
    required: false,
    label: t('color'),
    align: 'left',
    field: (row: CustomerModel) => row.color,
    sortable: false
  },
  {
    name: 'customerProfile.gender',
    required: false,
    label: t('gender'),
    align: 'left',
    field: (row: CustomerModel) => row.gender,
    sortable: false
  },
  {
    name: 'languages.language',
    required: false,
    label: t('language'),
    align: 'left',
    field: (row: CustomerModel) => row.languages[0].iso,
    sortable: false
  },
  {
    name: 'customerProfile.birthday_month',
    required: false,
    label: t('birthdate'),
    align: 'left',
    field: (row: CustomerModel) => row.birthdateStr,
    sortable: false
  },
  {
    name: 'customerProfile.birthday_year',
    required: false,
    label: t('birthdate'),
    align: 'left',
    field: (row: CustomerModel) => row.birthdateStr,
    sortable: false
  },
  {
    name: 'customerProfile.birthdate',
    required: false,
    label: t('birthdate'),
    align: 'left',
    field: (row: CustomerModel) => row.birthdateStr,
    sortable: false
  },
  {
    name: 'customer.balance',
    required: false,
    label: t('balance'),
    align: 'left',
    field: (row: CustomerModel) => row.balance,
    sortable: false
  },
  {
    name: 'phcOrganization.name',
    required: false,
    label: t('phcOrganization'),
    align: 'left',
    field: (row: CustomerModel) => row.phcOrganization?.name,
    sortable: false
  },
  {
    name: 'facility.name',
    required: false,
    label: t('facility'),
    align: 'left',
    field: (row: CustomerModel) => row.facility.name,
    sortable: false
  },
  {
    name: 'addresses.city',
    required: false,
    label: t('city'),
    align: 'left',
    field: (row: CustomerModel) => joinField(row.addresses, 'city'),
    sortable: false
  },
  {
    name: 'addresses.state',
    required: false,
    label: t('state'),
    align: 'left',
    field: (row: CustomerModel) => joinField(row.addresses, 'state'),
    sortable: false
  },
  {
    name: 'addresses.zipCode',
    required: false,
    label: t('zipCode'),
    align: 'left',
    field: (row: CustomerModel) => joinField(row.addresses, 'zipCode'),
    sortable: false
  },
  {
    name: 'customer.state',
    required: false,
    label: t('phcState'),
    align: 'left',
    field: (row: CustomerModel) => row.state,
    sortable: false
  },
  {
    name: 'calls.last_category',
    required: false,
    label: t('lastCallResultCategory'),
    align: 'left',
    field: (row: CustomerModel) => (row.calls[0].category || 'no data') + ' at ' + helper.dateEst(row.calls[0].startedAt),
    sortable: false
  },
  {
    name: 'calls.last_operator',
    required: false,
    label: t('lastCallCSR'),
    align: 'left',
    field: (row: CustomerModel) => (row.calls[0].member?.email) + ' at ' + helper.dateEst(row.calls[0].startedAt),
    sortable: false
  },
  {
    name: 'calls.last_call_type',
    required: false,
    label: t('lastCallType'),
    align: 'left',
    field: (row: CustomerModel) => (row.calls[0].type) + ' at ' + helper.dateEst(row.calls[0].startedAt),
    sortable: false
  },
  {
    name: 'calls.no_calls_within',
    required: false,
    label: t('lastCallStart'),
    align: 'left',
    field: (row: CustomerModel) => row.lastCall && helper.dateEst(row.lastCall.startedAt),
    sortable: false
  },
  {
    name: 'orders.no_orders_within',
    required: false,
    label: t('lastOrderStart'),
    align: 'left',
    field: (row: CustomerModel) => row.lastOrder && helper.dateEst(row.lastOrder.createdAt),
    sortable: false
  },
  {
    name: 'grievance.last_not_resolved_category',
    required: false,
    label: t('lastGrievance'),
    align: 'left',
    field: (row: CustomerModel) => (row.grievances[0].category || 'no data') + '/' + row.grievances[0].status,
    sortable: false
  },
  {
    name: 'grievance.status',
    required: false,
    label: t('lastGrievance'),
    align: 'left',
    field: (row: CustomerModel) => (row.grievances[0].category || 'no data') + '/' + row.grievances[0].status,
    sortable: false
  }
])

const selected = ref([])
const { t } = useI18n()

const page = ref<number>(1)
function getSelectedString () {
  return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${params.customerPagination.totalItemCount}`
}

const isFieldFound = (fieldName: string) => !!params.queryBody.find((item: Expression) => item.field === fieldName)

const visibleColumns = computed(() => {
  const arr: string[] = []
  columns.value.forEach(item => {
    if (isFieldFound(item.name)) {
      arr.push(item.name)
    }
  })
  return arr
})

const joinField = (arr: any[], field: string) => {
  let str = ''
  arr.forEach((item) => {
    str = str + ' ' + item[field]
  })
  return str
}

const emit = defineEmits(['changePage'])

watch(() => page.value, value => {
  emit('changePage', value)
})

const { createMultiTaskAddDialog } = useTasks()

const createTasksForSelectedCustomers = () => {
  const customersIds = selected.value.map((item: CustomerModel) => item.id)
  createMultiTaskAddDialog(customersIds, {
    targetList: params.queryId || null
  })
}
</script>
