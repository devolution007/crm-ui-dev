<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('customers') }}
      <template #actions>
        <q-btn
          v-if="callStore.isCallActive"
          color="secondary"
          text-color="primary"
          icon="sym_o_person_add"
          :label="$t('registerCustomer')"
          :to="{ name: 'customer-add' }"
          size="md"
        />
      </template>
    </bricks-page-title>
    <q-table
      ref="tableRef"
      v-model:pagination="pagination"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      :loading="loading"
      binary-state-sort
      :rows-per-page-options="[15, 25, 50, 100]"
      @request="onRequest"
    >
      <template #top>
        <div class="column items-stretch col-grow">
          <q-form
            class="row q-col-gutter-sm"
            style="width: 100%"
            @submit="tableRef.requestServerInteraction()"
          >
            <q-input
              v-model="filters.insuranceId"
              data-cy="customers-search-insurance-id-input"
              class="col-2"
              outlined
              dense
              clearable
              :label="$t('memberId')"
              :error-message="serverErrors.insuranceId"
              :error="!!serverErrors.insuranceId"
            />
            <q-input
              v-model="filters.name"
              data-cy="customers-search-firstname-input"
              class="col-2"
              outlined
              dense
              clearable
              :label="$t('firstName')"
              :error-message="serverErrors.name"
              :error="!!serverErrors.name"
            />
            <q-input
              v-model="filters.lastName"
              data-cy="customers-search-lastname-input"
              class="col-2"
              outlined
              dense
              clearable
              :label="$t('lastName')"
              :error-message="serverErrors.lastName"
              :error="!!serverErrors.lastName"
            />
            <q-input
              v-model="filters.birthdate"
              data-cy="customers-search-birthdate-input"
              class="col-2"
              outlined
              dense
              clearable
              mask="##/##/####"
              placeholder="MM/DD/YYYY"
              :label="$t('birthdate')"
              :error-message="serverErrors.birthdate"
              :error="!!serverErrors.birthdate"
            />
            <q-input
              v-model="filters.cardNumberLast"
              data-cy="customers-search-card-number-input"
              class="col-2"
              outlined
              dense
              clearable
              :label="$t('otcCardNumber')"
              :placeholder="$t('last5Digits')"
              :error-message="serverErrors.cardNumberLast"
              :error="!!serverErrors.cardNumberLast"
              data-1p-ignore
            />
            <q-input
              v-if="false"
              v-model="filter"
              data-cy="customers-search-input"
              class="col-grow q-mr-sm"
              dense
              debounce="300"
              clearable
              :placeholder="$t('searchByMemberIdFirstName')"
            />
            <div class="col-auto col-grow text-right">
              <q-btn
                v-if="isFiltersApplied"
                data-cy="customers-search-clear-btn"
                class="q-mr-sm"
                text-color="secondary"
                icon="sym_o_close"
                round
                size="md"
                @click="clearFilters"
              />
              <q-btn
                data-cy="customers-search-submit"
                color="secondary"
                text-color="primary"
                icon="sym_o_person_search"
                :loading="loading"
                type="submit"
                round
                size="md"
              />
            </div>
          </q-form>
        </div>
      </template>
      <template #header-cell="props">
        <q-th
          :props="props"
          @click="clearPreviousSortingOptional"
        >
          <q-icon
            v-if="props.col.sortable && sorting[props.col.name] && pagination.sortBy !== props.col.name"
            class="q-table__sort-icon--right"
            :name="sorting[props.col.name] === 'asc' ? 'sym_o_arrow_upward' : 'sym_o_arrow_downward'"
          />
          {{ props.col.label }}
        </q-th>
      </template>
      <template #body-cell-language="props">
        <q-td :props="props">
          <span class="text-h5">
            {{ getUnicodeFlagIcon(props.value === 'en' ? 'us' : props.value) }}
          </span>
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <customer-status :status="props.value" />
        </q-td>
      </template>
      <template #body-cell-noteForDisplay="scope">
        <q-td :props="scope">
          <div class="white-space-normal min-width-300">
            {{ scope.value }}
          </div>
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            data-cy="customer-view-profile-btn"
            icon="sym_o_badge"
            round
            :to="{ name: 'customer-details', params: { customerId: props.row.id } }"
          >
            <q-tooltip
              :delay="300"
              class="text-body2"
            >
              {{ $t('viewProfile') }}
            </q-tooltip>
          </q-btn>

          <customer-place-order-btn
            :disabled="! customerStore.isCustomerHasFeature(props.row, 'faxOrders')"
            :customer-id="props.row.id"
            type="fax"
            label=""
            round
          >
            <q-tooltip
              :delay="300"
              class="text-body2"
            >
              {{ $t('faxOrder') }}
            </q-tooltip>
          </customer-place-order-btn>

          <q-btn
            v-if="notIdentifiedYet"
            icon="sym_o_contact_phone"
            round
            color="primary"
            :loading="callStore.identifying === props.row.id"
            @click="callStore.identify({customerId: props.row.id})"
          >
            <q-tooltip
              :delay="300"
              anchor="bottom left"
              class="text-body2"
            >
              {{ $t('identifyForCurrentCall') }}
            </q-tooltip>
          </q-btn>
          <span v-else-if="callStore.isIdentifiedAsId(props.row.id)">
            <q-icon
              color="green"
              size="sm"
              name="sym_o_phone_in_talk"
            />
            <q-tooltip
              :delay="300"
              class="text-body2"
            >{{ $t('inTalk') }}</q-tooltip>
          </span>
        </q-td>
      </template>
      <template #pagination="scope">
        <bricks-table-pagination-buttons
          :scope="scope"
          :loading="loading"
        />
      </template>
    </q-table>
    <q-page-sticky
      position="bottom"
      :offset="[0, 18]"
    >
      <app-custom-pagination
        v-model="pagination.page"
        class="bg-page q-pa-sm rounded-borders shadow-1"
        :loading="loading"
        :total-pages="totalPages || 1"
        :total-item-count="pagination.rowsNumber || 0"
        @update:model-value="tableRef?.requestServerInteraction()"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, Ref, watch, inject } from 'vue'
import { api } from 'boot/axios'
import { EventBus, Notify, QTable, useMeta } from 'quasar'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import CustomerApi from 'src/api/CustomerApi'
import CustomerModel from 'src/models/CustomerModel'
import { useCall } from 'stores/call'
import { useI18n } from 'vue-i18n'
import { CustomerSortKey, QTableRequestProps, SortDirection, SortType } from 'src/types'
import { LocationQueryValue, useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from 'stores/customer-store'
import usePagination from 'src/composables/usePagination'
import BUS_EVENT from 'src/types/bus-events'
import CallModel, { CallBasic } from 'src/models/CallModel'
import useServerErrors2 from 'src/composables/useServerErrors2'
import useFilters from 'src/composables/useFilters'
const route = useRoute()
const router = useRouter()
const bus = inject('bus') as EventBus

useMeta({
  title: 'Customers'
})

const callStore = useCall()
const { t } = useI18n()

const tableRef = ref(<QTable>{})
const loading = ref(false)
const filter = ref('')

const { filters, isFiltersApplied, clearFilters } = useFilters({
  name: '',
  lastName: '',
  insuranceId: '',
  birthdate: '',
  cardNumberLast: '',
  search: ''
})

const { serverErrors, catchValidationErrors, resetServerErrors } = useServerErrors2({
  name: '',
  lastName: '',
  insuranceId: '',
  birthdate: '',
  cardNumberLast: ''
}, {
  unPrefix: 'filterBy'
})

const customersRepo = new CustomerApi(api)
const customerStore = useCustomerStore()
const { pagination, updateRowsNumber, totalPages, updateFromTableRequestProps: updPagination } = usePagination({
  sortBy: 'id',
  descending: true,
  rowsPerPage: 15
})

const columns = computed(() => [
  {
    name: 'insuranceId',
    field: 'insuranceId',
    required: true,
    label: t('memberId'),
    align: 'left',
    sortable: true
  },
  {
    name: 'firstName',
    field: 'firstName',
    label: t('firstName'),
    sortable: true
  },
  {
    name: 'lastName',
    field: 'lastName',
    label: t('lastName'),
    sortable: true
  },
  {
    field: 'gender',
    name: 'gender',
    label: t('gender')
  },
  {
    field: 'birthdateStr',
    name: 'birthday',
    label: t('dateOfBirth')
  },
  {
    field: 'langCode',
    name: 'language',
    label: t('language')
  },
  {
    field: 'status',
    name: 'status',
    label: t('status')
  },
  {
    field: 'actions',
    name: 'actions',
    label: t('actions')
  },
  {
    field: (row: CustomerModel) => row.noteForDisplay?.text || '',
    name: 'noteForDisplay',
    label: t('note'),
    hidden: true,
    align: 'left'
  }
])

const visibleColumns = computed(() => {
  const cols = [
    'insuranceId',
    'firstName',
    'lastName',
    'gender',
    'birthday',
    'language',
    'status',
    'actions'
  ]

  if (notIdentifiedYet.value) {
    cols.push('noteForDisplay')
  }

  return cols
})

const rows = ref(<CustomerModel[]>[])

const notIdentifiedYet = computed(() => callStore.call && !callStore.call?.customer)

// Reactive store for sorting info
const sorting: Ref<Record<CustomerSortKey, SortDirection> | Record<string, never>> = ref({})

async function onRequest (props: QTableRequestProps) {
  resetServerErrors()

  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  loading.value = true

  // Store requested sorting info
  sorting.value[sortBy as CustomerSortKey] = descending ? 'desc' : 'asc'

  // Note: we are sending a full set of collected sorting variations to the server
  try {
    const response = await customersRepo.getCustomers(page, rowsPerPage, sorting.value, filters.value)
    rows.value.splice(0, rows.value.length, ...response.items)
    updPagination(props)
    updateRowsNumber(response.totalItemCount)
  } catch (e) {
    if (!catchValidationErrors(e)) {
      console.error(e)
      Notify.create({
        message: t('errors.while_loading_data'),
        color: 'negative'
      })
    }
  }

  // ...and turn of loading indicator
  loading.value = false
}

const applyQuerySearch = (query: LocationQueryValue | LocationQueryValue[]) => {
  if (Array.isArray(query)) {
    query = query[0]
  }

  filters.value.search = query as string
}

onMounted(() => {
  // get initial data from server (1st page)
  applyQuerySearch(route.query?.search)
  tableRef.value.requestServerInteraction()
})

watch(() => route.query?.search, (newQuery, oldValue) => {
  applyQuerySearch(newQuery)
  tableRef.value.requestServerInteraction()
})

const clearPreviousSortingOptional = (e: MouseEvent) => {
  if (!e.shiftKey) {
    sorting.value = {}
  }
}

bus.on(BUS_EVENT.CALL_CUSTOMER_IDENTIFIED, (call: CallBasic, customerId: number) => {
  const routeCustomerId = Number(route?.params?.customerId)

  if (!routeCustomerId || isNaN(routeCustomerId) || routeCustomerId !== customerId) {
    router.push({
      name: 'customer-orders',
      params: {
        customerId
      }
    })
  }
})

</script>
