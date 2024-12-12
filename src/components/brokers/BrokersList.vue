<template>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :rows="rows"
    :columns="columns"
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
          <q-select
            v-model="filters.brokerAgency"
            :options="brokerAgencies.options.value"
            class="col-4"
            outlined
            dense
            clearable
            option-value="id"
            option-label="name"
            emit-value
            map-options
            use-input
            :label="$t('brokerAgency')"
            :error-message="serverErrors.brokerAgency"
            :error="!!serverErrors.brokerAgency"
            input-debounce="0"
            @filter="brokerAgencies.filterFn"
          />
          <q-select
            v-model="filters.role"
            :options="BROKER_ROLES_CONSTANTS"
            option-value="value"
            option-label="label"
            class="col-3"
            outlined
            dense
            clearable
            emit-value
            map-options
            :label="$t('role')"
            :error-message="serverErrors.role"
            :error="!!serverErrors.role"
          />
          <q-select
            v-model="filters.status"
            :options="brokerStatuses"
            option-value="value"
            option-label="label"
            emit-value
            class="col-2"
            outlined
            dense
            clearable
            map-options
            :label="$t('status')"
            :error-message="serverErrors.status"
            :error="!!serverErrors.status"
          />
          <div class="col-auto col-grow text-right">
            <q-btn
              v-if="isFiltersApplied"
              data-cy="brokers-search-clear-btn"
              class="q-mr-sm"
              text-color="secondary"
              icon="sym_o_close"
              round
              size="md"
              @click="clearFilters"
            />
            <q-btn
              data-cy="brokers-search-submit"
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
    <template #pagination="scope">
      <bricks-table-pagination-buttons
        :scope="scope"
        :loading="loading"
      />
    </template>
    <template #body-cell-role="props">
      <q-td :props="props">
        {{ $t(getBrokerRoleName(props.value)) }}
      </q-td>
    </template>
    <template #header-cell-pwc="props">
      <q-th :props="props">
        {{ $t('PWC') }}
        <q-tooltip>
          {{ $t('preferredWayOfCommunication') }}
        </q-tooltip>
      </q-th>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Notify, QTable } from 'quasar'
import { api } from 'boot/axios'
import { useI18n } from 'vue-i18n'
import useFilters from 'src/composables/useFilters'
import BrokersApi from 'src/api/BrokersApi'
import usePagination from 'src/composables/usePagination'
import { Broker, BrokersFilters, BrokersSortBy, QTableRequestProps, BrokerRole } from 'src/types'
import useServerErrors2 from 'src/composables/useServerErrors2'
import { useBrokerAgenciesList } from 'src/composables/useBrokerAgenciesList'
import useOptionsFilter from 'src/composables/useOptionsFilter'
import { constants } from 'src/boot/constants'
import { useRouter } from 'vue-router'

const brokerAgencies = useOptionsFilter(useBrokerAgenciesList().list, 'name')

const tableRef = ref(<QTable>{})
const { t } = useI18n()
const loading = ref(false)

const { serverErrors, catchValidationErrors, resetServerErrors } = useServerErrors2({
  brokerAgency: undefined,
  role: undefined,
  status: undefined
})

const props = defineProps({
  brokerAgency: {
    type: Number,
    required: false,
    default: undefined
  },
  status: {
    type: Number,
    required: false,
    default: undefined
  }
})

function getBrokerRoleName (role: number) {
  switch (role) {
    case 1:
      return 'supervisorBroker'

    case 2:
      return 'brokersManager'

    default:
      return 'brokerAgent'
  }
}

const BROKER_ROLES_CONSTANTS = constants.BROKER_ROLES.map((el: BrokerRole) => ({ ...el, label: t(getBrokerRoleName(el.value)) })) as BrokerRole[]

const brokerStatuses = [
  {
    label: t('inactive'),
    value: 0
  },
  {
    label: t('active'),
    value: 1
  }
]

const { filters, isFiltersApplied, clearFilters, toFilterArray } = useFilters({
  brokerAgency: undefined as number | undefined,
  role: undefined as number | undefined,
  status: undefined as number | undefined
}, {
  onClear () {
    tableRef.value.requestServerInteraction()
  }
})

const brokersRepo = new BrokersApi(api)
const { pagination, updateRowsNumber, totalPages, updateFromTableRequestProps: updPagination } = usePagination({
  sortBy: 'id',
  descending: true,
  rowsPerPage: 15
})

const columns = computed(() => [
  {
    name: 'id',
    field: 'id',
    label: t('id'),
    align: 'left',
    sortable: true
  },
  {
    name: 'name',
    field: 'name',
    label: t('name'),
    align: 'left',
    sortable: true
  },
  {
    name: 'email',
    field: 'email',
    label: t('email'),
    align: 'left',
    sortable: false
  },
  {
    name: 'phone',
    field: 'phone',
    label: t('phone'),
    align: 'left',
    sortable: false
  },
  {
    name: 'role',
    field: 'role',
    label: t('role'),
    align: 'left',
    sortable: false
  },
  {
    name: 'pwc',
    field: 'preferredWayOfCommunication',
    label: 'PWC',
    align: 'left',
    sortable: false
  },
  {
    name: 'note',
    field: 'note',
    label: t('note'),
    align: 'left',
    sortable: false
  }
]
)

const rows = ref<Array<Broker>>([])

async function onRequest (props: QTableRequestProps) {
  resetServerErrors()
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination
  try {
    loading.value = true
    const offset = (page - 1) * rowsPerPage
    const response = await brokersRepo.getBrokersList(toFilterArray() as BrokersFilters[], [{
      name: sortBy as BrokersSortBy['name'],
      direction: descending ? 'desc' : 'asc'
    }], offset, rowsPerPage)
    rows.value.splice(0, rows.value.length, ...response.data)
    updPagination(props)
    updateRowsNumber(response.meta.totalItemCount)
  } catch (err) {
    if (!catchValidationErrors(err)) {
      console.error(err)
      Notify.create({
        message: 'Error',
        color: 'negative'
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.status && props.brokerAgency) {
    filters.value.status = props.status
    filters.value.brokerAgency = props.brokerAgency
  }
  tableRef.value.requestServerInteraction()
  const router = useRouter()
  router.replace({ query: undefined })
})
</script>

<style scoped>

</style>
