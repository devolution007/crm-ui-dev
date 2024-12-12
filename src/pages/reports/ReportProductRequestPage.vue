<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('productRequests') }}
      <template #actions>
        <q-btn
          color="secondary"
          text-color="primary"
          icon="sym_o_archive"
          :label="$t('exportToCsv')"
          size="md"
          @click="$q.notify('Not implemented yet')"
        />
      </template>
    </bricks-page-title>
    <q-table
      ref="tableRef"
      v-model:pagination="pagination"
      binary-state-sort
      row-key="id"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :rows-per-page-options="[5, 10, 25, 50, 100]"
      @request="onRequest"
      @row-click="onRowClick"
    >
      <template #top>
        <div class="column items-stretch col-grow">
          <q-form
            ref="formRef"
            class="row q-col-gutter-md"
            @submit="tableRef?.requestServerInteraction()"
          >
            <div class="col">
              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="filterBy.insuranceId"
                  :error-message="serverErrors.insuranceId"
                  :error="!!serverErrors.insuranceId"
                  class="col-6 col-md-3 col-lg-2"
                  outlined
                  :label="$t('insuranceId')"
                  dense
                  clearable
                  @change="formRef?.submit()"
                  @clear="formRef?.submit()"
                />

                <q-input
                  :model-value="filterBy.productName"
                  :error-message="serverErrors.productName"
                  :error="!!serverErrors.productName"
                  dense
                  :label="$t('productName')"
                  outlined
                  class="col-6 col-md-3 col-lg-2"
                  clearable
                  @change="filterBy.productName=$event"
                  @clear="filterBy.productName=null"
                />

                <q-select
                  v-model="filterBy.memberId"
                  :options="members"
                  option-value="id"
                  option-label="email"
                  outlined
                  :label="$t('member')"
                  class="col-6 col-md-3 col-lg-2"
                  dense
                  clearable
                  emit-value
                  map-options
                />

                <q-select
                  v-model="filterBy.resolution"
                  :error-message="serverErrors.resolution"
                  :error="!!serverErrors.resolution"
                  :options="constants.PRODUCT_REQUEST_RESOLUTIONS"
                  outlined
                  :label="$t('resolution')"
                  class="col-6 col-md-3 col-lg-2"
                  dense
                  clearable
                  multiple
                  emit-value
                  map-options
                />

                <q-select
                  v-model="filterBy.organizationId"
                  :error-message="serverErrors.organizationId"
                  :error="!!serverErrors.organizationId"
                  :options="organizations"
                  option-value="id"
                  option-label="name"
                  outlined
                  :label="$t('organization')"
                  class="col-6 col-md-3 col-lg-4"
                  dense
                  clearable
                  multiple
                  emit-value
                  map-options
                  use-chips
                />

                <bricks-date-picker-range
                  v-model:from="filterBy.createdAtFrom"
                  v-model:to="filterBy.createdAtTo"
                  :label="$t('createdAt')"
                  class="col-6 col-md-5 col-lg-4"
                  outlined
                  dense
                  clearable
                />

                <bricks-date-picker-range
                  v-model:from="filterBy.processedAtFrom"
                  v-model:to="filterBy.processedAtTo"
                  :label="$t('processedAt')"
                  class="col-6 col-md-5 col-lg-4"
                  outlined
                  dense
                  clearable
                />
              </div>
            </div>

            <div class="col-auto">
              <q-btn
                type="submit"
                color="secondary"
                text-color="primary"
                icon="sym_o_search"
                size="md"
                round
                :loading="loading"
              />
            </div>
          </q-form>
        </div>
      </template>
      <template #body-cell-insuranceId="scope: MyTableCellSlotScope">
        <q-td :props="scope">
          <q-btn
            v-if="scope.row.customer"
            dense
            no-caps
            unelevated
            :to="{ name: 'customer-details', params: { customerId: scope.row.customer.id } }"
          >
            <div>
              <q-icon
                name="sym_o_badge"
                size="sm"
                class="q-mr-sm"
              />
              <span v-if="scope.row.customer.insuranceId">{{ scope.row.customer.insuranceId }}</span>
              <span v-else>{{ scope.row.customer.name }}</span>
            </div>
            <q-tooltip
              :delay="300"
              class="text-body2"
            >
              {{ $t('viewProfile') }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-csr="scope: CsrCellScope">
        <q-td :props="scope">
          <tools-member-indicator
            v-if="scope.value"
            :member="scope.value"
          />
        </q-td>
      </template>
      <template #body-cell-createdAt="scope">
        <q-td :props="scope">
          <div>{{ helper.dateEst(scope.value, DATE_FORMAT) }}</div>
          <div>{{ helper.dateEst(scope.value, TIME_FORMAT) }}</div>
        </q-td>
      </template>
      <template #body-cell-processedAt="scope">
        <q-td :props="scope">
          <template v-if="scope.value">
            <div>{{ helper.dateEst(scope.value, DATE_FORMAT) }}</div>
            <div>{{ helper.dateEst(scope.value, TIME_FORMAT) }}</div>
          </template>
        </q-td>
      </template>
      <template #body-cell-link="props">
        <q-td
          :props="props"
        >
          <bricks-btn-external-link
            v-if="props.row.link"
            :link="props.row.link"
          />
        </q-td>
      </template>
      <template #body-cell-status="scope: MyTableCellSlotScope">
        <q-td :props="scope">
          <q-chip
            v-if="scope.value.value !== constants.PRODUCT_REQUEST_STATUS_DONE_CODE"
            square
            :color="scope.value.color"
            text-color="dark"
          >
            {{ scope.value.label }}
          </q-chip>
          <q-chip
            v-else
            square
            :color="getResolutionByValue(scope.row.resolution)?.color || 'primary'"
            text-color="dark"
            :icon="getResolutionByValue(scope.row.resolution)?.icon || 'sym_o_checkmark'"
          >
            {{ getResolutionByValue(scope.row.resolution).label }}
          </q-chip>
        </q-td>
      </template>
      <template #body-cell-actions="scope">
        <q-td :props="scope">
          <product-request-status-actions
            :product-request="scope.row"
            @saved="tableRef?.requestServerInteraction()"
          />
        </q-td>
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
import { computed, inject, onMounted, Ref, ref } from 'vue'
import { ProductRequestFilter, QTableRequestProps } from 'src/types'
import { api } from 'boot/axios'
import MemberApi from 'src/api/MemberApi'
import MemberModel, { MemberBasicInterface } from 'src/models/MemberModel'
import { helper } from 'boot/helper'
import { useI18n } from 'vue-i18n'
import { constants } from 'boot/constants'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import OrganizationApi from 'src/api/OrganizationApi'
import { Dialog, EventBus, Notify, QForm, QTable, useMeta } from 'quasar'
import { DATE_FORMAT, TIME_FORMAT } from 'src/types/formats'
import useColorIconConstEntries from 'src/composables/useColorIconConstEntries'
import usePagination from 'src/composables/usePagination'
import useServerErrors2 from 'src/composables/useServerErrors2'
import { TableCellSlotScope } from 'src/types/quasar-add'
import ProductRequestApi from 'src/api/ProductRequestApi'
import { ProductRequestInterface } from 'src/models/ProductRequest'
import BUS_EVENT from 'src/types/bus-events'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MyTableCellSlotScope extends TableCellSlotScope {
  row: ProductRequestInterface
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CsrCellScope extends TableCellSlotScope {
  value: MemberBasicInterface
}

const { t } = useI18n()
const bus = inject('bus') as EventBus

const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    sortable: false,
    field: 'id'
  },
  {
    name: 'insuranceId',
    required: true,
    label: t('memberId'),
    align: 'left',
    sortable: false
  },
  {
    name: 'csr',
    required: true,
    label: t('csr'),
    align: 'left',
    field: 'member',
    sortable: false
  },
  {
    name: 'createdAt',
    required: true,
    label: t('createdAt'),
    align: 'left',
    field: 'createdAt',
    sortable: false
  },
  {
    name: 'processedAt',
    required: true,
    label: t('processedAt'),
    align: 'left',
    field: 'processedAt',
    sortable: false
  },
  {
    name: 'productName',
    required: true,
    label: t('productName'),
    align: 'left',
    field: 'productName',
    sortable: false,
    style: 'max-width: 190px; white-space: normal'
  },
  {
    name: 'productSku',
    required: true,
    label: t('productSku'),
    align: 'left',
    sortable: false,
    field: (row: ProductRequestInterface) => row.product?.sku || ''
  },
  {
    name: 'link',
    required: true,
    label: t('link'),
    align: 'left',
    sortable: false
  },
  {
    name: 'status',
    required: true,
    label: t('status'),
    align: 'left',
    sortable: false,
    field: (row: ProductRequestInterface) => getStatusByValue(row.status)
  },
  {
    name: 'comment',
    required: true,
    label: t('comment'),
    align: 'left',
    sortable: false,
    field: 'comment'
  },
  {
    field: 'actions',
    name: 'actions',
    label: t('actions'),
    classes: 'sticky-cell right-0',
    align: 'left',
    headerClasses: 'sticky-cell right-0'
  }
])
const filterBy: Ref<ProductRequestFilter> = ref({
  insuranceId: null,
  resolution: null,
  memberId: null,
  productName: null,
  createdAtFrom: '',
  createdAtTo: '',
  processedAtFrom: '',
  processedAtTo: '',
  organizationId: null
})

const rows: Ref<ProductRequestInterface[]> = ref([])
const { pagination, updateRowsNumber, totalPages, updateFromTableRequestProps: updPagination } = usePagination({
  sortBy: 'createdAt',
  rowsPerPage: 10
})

const { getEntryByValue: getStatusByValue } = useColorIconConstEntries(constants.PRODUCT_REQUEST_STATUSES)
const { getEntryByValue: getResolutionByValue } = useColorIconConstEntries(constants.PRODUCT_REQUEST_RESOLUTIONS)
const { serverErrors, resetServerErrors, catchValidationErrors } = useServerErrors2({
  insuranceId: '',
  productName: '',
  resolution: '',
  memberId: '',
  createdAtFrom: '',
  createdAtTo: '',
  processedAtFrom: '',
  processedAtTo: '',
  organizationId: ''
})
const tableRef = ref<QTable | null>(null)
const formRef = ref<QForm | null>(null)
const memberRepository: MemberApi = new MemberApi(api)
const organizationRepository: OrganizationApi = new OrganizationApi(api)
const productRequestRepository: ProductRequestApi = new ProductRequestApi(api)
const loading = ref<boolean>(false)
const members = ref<MemberModel[]>([])
const organizations = ref<InsuranceOrganizationModel[]>([])

useMeta({
  title: 'Product Request List'
})

const onRequest = async (props: QTableRequestProps): Promise<void> => {
  resetServerErrors()
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  try {
    loading.value = true

    const response = await productRequestRepository.getList(page, filterBy.value, { [sortBy]: descending ? 'desc' : 'asc' }, rowsPerPage)

    rows.value.splice(0, rows.value.length, ...response.items)

    updPagination(props)

    updateRowsNumber(response.totalItemCount)
  } catch (err: unknown) {
    catchValidationErrors(err)
    console.error(err)
    Notify.create({
      message: 'Error',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

const onRowClick = (evt: PointerEvent, row: ProductRequestInterface): void => {
  const target = evt.target as HTMLButtonElement | null
  if (target && (target.tagName === 'TD' || target.parentElement?.tagName === 'TD')) {
    Dialog.create({
      title: t('productRequest') + ' ' + t('description'),
      message: row.description
    })
  }
}

onMounted(async () => {
  members.value = await memberRepository.getMembersForThisOrganization()
  organizations.value = await organizationRepository.getOrganizations()
  tableRef.value?.requestServerInteraction()
})

bus.on(BUS_EVENT.PRODUCT_REQUEST_CREATED, () => {
  tableRef.value?.requestServerInteraction()
})
</script>
