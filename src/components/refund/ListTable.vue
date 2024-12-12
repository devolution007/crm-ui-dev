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
    separator="cell"
    @request="onRequest"
  >
    <template #top>
      <div class="column items-stretch col-grow">
        <q-form
          class="row q-col-gutter-sm"
          style="width: 100%"
          @submit="tableRef.requestServerInteraction()"
        >
          <div class="col">
            <div class="row q-col-gutter-sm">
              <div class="col-1">
                <q-input
                  v-model="filters.refundId"
                  dense
                  outlined
                  debounce="300"
                  clearable
                  label="Refund #"
                />
              </div>
              <div class="col-1">
                <q-input
                  v-model="filters.orderId"
                  dense
                  outlined
                  debounce="300"
                  clearable
                  label="Order #"
                />
              </div>
              <div class="col-2">
                <q-select
                  v-model="filters.reasons"
                  dense
                  outlined
                  :options="$constants.REFUND_REASONS"
                  label="Reasons"
                  clearable
                  multiple
                  map-options
                  emit-value
                  use-chips
                />
              </div>
              <div class="col-2">
                <app-date-picker
                  v-model="filters.returnWindow"
                  label="Return Window"
                />
              </div>
              <div class="col-2">
                <q-select
                  v-model="filters.organizations"
                  dense
                  outlined
                  :options="organizationsOptions"
                  label="Organizations"
                  clearable
                  multiple
                  map-options
                  emit-value
                  use-chips
                />
              </div>
              <div class="col-2">
                <q-select
                  v-model="filters.refundRequestedBy"
                  dense
                  outlined
                  :options="membersOptions"
                  label="Requested By"
                  clearable
                  multiple
                  map-options
                  emit-value
                  use-chips
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption>
                          {{ scope.opt.description }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-4">
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <app-date-picker
                      v-model="filters.refundRequestedOnFrom"
                      label="Requested On From"
                    />
                  </div>
                  <div class="col">
                    <app-date-picker
                      v-model="filters.refundRequestedOnTo"
                      label="Requested On To"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="q-ml-auto col-auto">
            <q-btn
              v-if="filtersHasValue"
              color="secondary"
              text-color="blue-8"
              icon="sym_o_clear"
              type="button"
              label="Clear"
              @click="clearFilters"
            />
            <q-btn
              class="q-ml-sm"
              color="secondary"
              text-color="primary"
              icon="sym_o_search"
              type="submit"
              size="md"
              round
              :loading="loading"
            />
          </div>
        </q-form>
      </div>
    </template>
    <template #body-cell-id="props">
      <q-td :props="props">
        <q-btn
          text-color="primary"
          size="md"
          :to="{ name: 'refund-details', params: { refundId: props.value } }"
        >
          {{ props.value }}
        </q-btn>
      </q-td>
    </template>
    <template #body-cell-orderId="props">
      <q-td :props="props">
        <q-btn
          text-color="primary"
          size="md"
          :to="{ name: 'customer-order-details', params: { orderId: props.value.id,
                                                           customerId: props.value.customer?.id} }"
        >
          {{ props.value.id }}
        </q-btn>
      </q-td>
    </template>
    <template #body-cell-price="props">
      <q-td :props="props">
        $ {{ props.value }}
      </q-td>
    </template>
    <template #body-cell-createdAt="props">
      <q-td :props="props">
        {{ $helper.dateEst(props.value) }}
      </q-td>
    </template>
    <template #body-cell-reasons="props">
      <q-td :props="props">
        <div
          v-for="reason in props.value"
          :key="`refListReason${props.row.id}_${reason}`"
        >
          {{ $constants.REFUND_REASONS.find((r) => r.value === reason).label }}
        </div>
      </q-td>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          label="Details"
          color="blue-grey-1"
          text-color="blue-grey-8"
          size="md"
          :to="{ name: 'refund-details', params: { refundId: props.row.id } }"
        >
          <q-badge
            v-if="props.row.refundableRows"
            color="red"
            rounded
            floating
          />
        </q-btn>
      </q-td>
    </template>
    <template #body-cell-performer="props">
      <q-td :props="props">
        <q-avatar
          color="primary"
          text-color="white"
          size="sm"
          font-size="12px"
        >
          {{ props.value.firstName[0] }}{{ props.value.lastName[0] }}
        </q-avatar>
        {{ props.value.name }}
      </q-td>
    </template>
    <template #header-cell-attachments>
      <q-th>
        <q-icon name="sym_o_perm_media" />
      </q-th>
    </template>
    <template #body-cell-attachments="props">
      <q-td :props="props">
        <app-attachments-btn-download
          v-if="props.value && props.value.length > 0"
          :attachments="props.value"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">

import { computed, onMounted, reactive, Ref, ref } from 'vue'
import { RefundsFilter, SortBy } from 'src/types'
import { useI18n } from 'vue-i18n'
import { api } from 'boot/axios'
import RefundApi from 'src/api/RefundApi'
import { QTable } from 'quasar'
import RefundListEntryModel from 'src/models/RefundListEntryModel'
import { useOrganizationsStore } from 'stores/organizations-store'
import { useMembersStore } from 'stores/members-store'
const { t } = useI18n()

const { fullListAsOptions: organizationsOptions, fetchFullList: fetchOrganizationsAttempt } = useOrganizationsStore()
fetchOrganizationsAttempt()

const { fullListAsOptions: membersOptions, fetchFullList: fetchMembersAttempt } = useMembersStore()
fetchMembersAttempt()

const tableRef = ref(<QTable>{})
const loading = ref(false)

const filtersDefault: RefundsFilter = {
  orderId: null,
  refundId: null,
  reasons: [],
  returnWindow: null,
  refundRequestedOnFrom: null,
  refundRequestedOnTo: null,
  refundRequestedBy: [],
  organizations: []
}

const filters: RefundsFilter = reactive({
  ...filtersDefault
})

const filtersHasValue = computed(() => {
  return Object.values(filters).some((v) => {
    if (Array.isArray(v)) {
      return v.length > 0
    }
    return v !== null && v !== undefined && v !== ''
  })
})

const clearFilters = () => {
  Object.assign(filters, filtersDefault)
  tableRef.value.requestServerInteraction()
}

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: <number | undefined>-1
})

const columns = computed(() => [
  {
    name: 'id',
    field: 'id',
    required: true,
    label: 'Refund ID',
    align: 'left',
    sortable: true
  },
  {
    name: 'orderId',
    field: 'order',
    label: 'Order ID'
  },
  {
    name: 'price',
    field: 'price',
    label: 'Refund Amount'
  },
  {
    name: 'reasons',
    field: 'reasons',
    align: 'left',
    label: 'Reasons'
  },
  {
    name: 'createdAt',
    field: 'createdAt',
    align: 'left',
    label: 'Requested On',
    sortable: true
  },
  {
    name: 'attachments',
    field: 'attachments',
    label: 'Attachments',
    align: 'center'
  },
  {
    name: 'performer',
    field: 'performer',
    label: 'Requested By',
    align: 'left'
  },
  {
    field: 'actions',
    name: 'actions',
    label: t('actions')
  }
])

const listRepo = new RefundApi(api)
const sorting: Ref<SortBy[]> = ref([])
const rows = ref(<RefundListEntryModel[]>[])

async function onRequest (props: any) {
  console.log('requested')
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  loading.value = true

  // Store requested sorting info
  const sortEntry = {} as SortBy
  sortEntry[sortBy] = descending ? 'desc' : 'asc'
  sorting.value = [
    sortEntry
  ]
  // Note: we are sending a full set of collected sorting variations to the server
  try {
    const response = await listRepo.getList(page, filters, sorting.value, rowsPerPage)

    pagination.value.rowsNumber = response.totalItemCount

    rows.value.splice(0, rows.value.length, ...response.items)
  } catch (e) {
    console.error(e)
  } finally {
    // ...and turn of loading indicator
    loading.value = false
  }

  // don't forget to update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
}

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})
</script>
