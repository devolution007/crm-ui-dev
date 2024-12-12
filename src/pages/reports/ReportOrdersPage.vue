<template>
  <app-dialog v-model="notesDialog" :title="$t('note')" min-width="400">
    {{ note }}
  </app-dialog>
  <app-dialog v-model="attachmentsDialog" :title="$t('attachments')" min-width="400">
    <q-list bordered separator>
      <q-item v-for="(attachment, i) in attachments" :key="i" v-ripple clickable :title="$t('clickToDownload')"
        @click="helper.downloadAttachment(attachment)">
        <q-item-section>
          {{ attachment.name }}
        </q-item-section>
        <q-item-section avatar>
          <q-btn download dense color="primary" icon="download" size="10px" />
        </q-item-section>
      </q-item>
    </q-list>
  </app-dialog>
  <q-page padding>
    <bricks-page-title>
      {{ $t('orders') }}
      <template #actions>
        <q-btn color="secondary" text-color="primary" icon="sym_o_archive" :label="$t('exportToCsv')" size="md"
          :loading="preparingToDownload" @click="downloadCsvOrders" />
      </template>
    </bricks-page-title>
    <q-table ref="tableRef" v-model:pagination="pagination" binary-state-sort row-key="id"
      :rows-per-page-options="[10, 15, 25, 50, 100]" :rows="rows" :loading="loading" :columns="columns"
      @request="onRequest" @row-click="onRowClick">

      <template #body-cell-id="scope">
        <q-td :props="scope">
          <q-btn :label="scope.value" :title="$t('goToOrder')" flat dense :to="{
            name: 'customer-order-details',
            params: {
              customerId: scope.row.customer.id,
              orderId: scope.value,
            },
          }" />
        </q-td>
      </template>
      <template #body-cell-customer-name="scope">
        <q-td :props="scope">
          <q-btn flat icon="sym_o_badge" :label="scope.value.name" no-caps no-wrap
            :to="{ name: 'customer-details', params: { customerId: scope.value.id } }" padding="none" />
        </q-td>
      </template>
      <template #body-cell-customer-email="scope">
        <q-td :props="scope">
          <q-btn :label="scope.value.email" no-caps no-wrap
            :to="{ name: 'customer-details', params: { customerId: scope.value.id } }" padding="none" />
        </q-td>
      </template>

      <template #body-cell-insuranceId="scope">
        <q-td :props="scope">
          <q-btn v-if="scope.value.insuranceId" flat :label="scope.value.insuranceId" no-caps no-wrap
            :to="{ name: 'customer-details', params: { customerId: scope.value.id } }" padding="none" />
        </q-td>
      </template>

      <template #body-cell-note="props">
        <q-td :props="props">
          <q-btn v-if="props.row.noteForPostman" icon="open_in_new"
            @click="(notesDialog = true) && (note = props.row.noteForPostman)" />
        </q-td>
      </template>

      <template #body-cell-attachments="scope">
        <q-td :props="scope">
          <q-btn v-if="scope.row.attachments.length" icon="open_in_new"
            @click="(attachmentsDialog = true) && (attachments = scope.row.attachments)">
            <q-badge floating color="green">
              {{ scope.row.attachments.length }}
            </q-badge>
          </q-btn>
        </q-td>
      </template>

      <template #body-cell-trackingNumber="scope">
        <q-td :props="scope">
          <order-track-button v-if="scope.value" :tracking-code="scope.value" :tracking-link="scope.row.trackingLink" />
        </q-td>
      </template>

      <template #top>
        <div class="column items-stretch col-grow">
          <q-form ref="form" class="row" @submit="tableRef?.requestServerInteraction()">
            <q-input :model-value="filterBy.firstName" :error-message="serverErrors.firstName"
              :error="!!serverErrors.firstName" class="col-2 q-pr-sm" outlined :label="$t('firstName')" dense clearable
              @change="filterBy.firstName = $event" @clear="filterBy.firstName = null" />

            <q-input :model-value="filterBy.lastName" :error-message="serverErrors.lastName"
              :error="!!serverErrors.lastName" class="col-2 q-pr-sm" outlined :label="$t('lastName')" dense clearable
              @change="filterBy.lastName = $event" @clear="filterBy.lastName = null" />

            <q-input :model-value="filterBy.insuranceId" :error-message="serverErrors.insuranceId"
              :error="!!serverErrors.insuranceId" class="col-2 q-pr-sm" outlined :label="$t('insuranceId')" dense
              clearable @change="filterBy.insuranceId = $event" @clear="filterBy.insuranceId = null" />

            <q-input :model-value="filterBy.orderId" :error-message="serverErrors.orderId"
              :error="!!serverErrors.orderId" dense :label="$t('orderId')" type="text" outlined class="col-2 q-pr-sm"
              clearable @change="filterBy.orderId = $event" @clear="filterBy.orderId = null" />

            <q-input :model-value="filterBy.trackingNumber" :error-message="serverErrors.trackingNumber"
              :error="!!serverErrors.trackingNumber" dense :label="$t('trackingNumber')" outlined class="col-2 q-pr-sm"
              clearable @change="filterBy.trackingNumber = $event" @clear="filterBy.trackingNumber = null" />

            <q-select v-model="filterBy.status" :error-message="serverErrors.status" :error="!!serverErrors.status"
              :options="helper.parseObjectFromConstant(constants.ORDER_STATUSES)" option-value="value"
              option-label="text" outlined :label="$t('status')" class="col-2 q-pr-sm" dense clearable multiple
              emit-value map-options />

            <q-select v-model="filterBy.orderType" :error-message="serverErrors.orderType"
              :error="!!serverErrors.orderType" :options="helper.parseObjectFromConstant(constants.ORDER_TYPES)"
              outlined multiple class="col-2 col-lg-1 q-pr-sm" option-value="text" option-label="value"
              :label="$t('type')" clearable dense emit-value map-options />

            <q-select v-model="filterBy.carrier" :error-message="serverErrors.carrier" :error="!!serverErrors.carrier"
              :options="constants.CARRIER_NAMES_LIST" outlined multiple class="col-2 col-lg-1 q-pr-sm"
              option-value="text" option-label="value" :label="$t('carrier')" clearable dense emit-value map-options />

            <q-select v-model="filterBy.organizationId" :error-message="serverErrors.organizationId"
              :error="!!serverErrors.organizationId" :options="organizations" option-value="id" option-label="name"
              outlined :label="$t('organization')" class="col-2 q-pr-sm" dense clearable emit-value map-options
              @update:model-value="form?.submit()">
              <template #selected-item="scope">
                <div class="ellipsis">
                  {{ scope.opt.name }}
                </div>
              </template>
            </q-select>

            <q-select v-model="filterBy.facilityId" :error-message="serverErrors.facilityId"
              :error="!!serverErrors.facilityId" :options="facilities" option-value="id" option-label="name" outlined
              :label="$t('facility')" class="col-2 q-pr-sm" :loading="facilitiesLoading" dense clearable emit-value
              map-options @update:model-value="form?.submit()">
              <template #selected-item="scope">
                <div class="ellipsis">
                  {{ scope.opt.name }}
                </div>
              </template>
            </q-select>

            <bricks-date-picker-range v-model:from="filterBy.orderFrom" v-model:to="filterBy.orderTo"
              :label="$t('createdAt')" class="col-6 col-md-5 col-lg-4" outlined dense clearable />
            <div class="col-auto q-pl-sm">
              <q-btn type="submit" color="secondary" text-color="primary" icon="sym_o_search" size="md" round
                :loading="loading" />
            </div>
          </q-form>
        </div>
      </template>
    </q-table>

    <q-page-sticky position="bottom" :offset="[0, 18]">
      <app-custom-pagination v-model="pagination.page" class="bg-page q-pa-sm rounded-borders shadow-1"
        :loading="loading" :total-pages="totalPages || 1" :total-item-count="pagination.rowsNumber || 0"
        @update:model-value="tableRef?.requestServerInteraction()" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref } from 'vue'
import { api } from 'boot/axios'
import { OrdersFilter, QTableRequestProps } from 'src/types'
import { helper } from 'boot/helper'
import { constants } from 'boot/constants'
import OrderApi from 'src/api/OrderApi'
import AttachmentModel from 'src/models/AttachmentModel'
import { useI18n } from 'vue-i18n'
import { format, Notify, QForm, QTable, useMeta } from 'quasar'
import { OrderBasicInterface } from 'src/models/OrderModel'
import { useOrderTypes } from 'src/composables/useOrderTypes'
import { useAttachment } from 'src/composables/useAttachment'
import usePagination from 'src/composables/usePagination'
import useServerErrors2 from 'src/composables/useServerErrors2'
import { useRouter } from 'vue-router'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import OrganizationApi from 'src/api/OrganizationApi'
import useReusableFacilitiesList from 'src/composables/useReusableFacilitiesList'
const { download } = useAttachment()

const { capitalize } = format
const { labelByType: orderLabel } = useOrderTypes()
const { t } = useI18n()
const router = useRouter()
const rows = ref<OrderBasicInterface[]>([])
const { pagination, updateRowsNumber, totalPages, updateFromTableRequestProps: updPagination } = usePagination({
  rowsPerPage: 15,
  page: 1,
  sortBy: 'createdAt'
})
const tableRef = ref<QTable | null>(null)
const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: 'id',
    sortable: true
  },

  {
    name: 'customer-name',
    required: true,
    label: t('customerName'),
    align: 'left',
    field: 'customer',
    sortable: false
  },
  {
    name: 'insuranceId',
    required: true,
    label: t('memberId'),
    align: 'left',
    field: (row: OrderBasicInterface) => row.customer,
    sortable: false
  },
  {
    name: 'orderType',
    required: true,
    label: t('orderType'),
    align: 'left',
    field: (row: OrderBasicInterface) => capitalize(orderLabel(row.type)) || `${row.type}`,
    sortable: false
  },
  {
    name: 'createdAt',
    required: true,
    label: t('orderDate'),
    align: 'left',
    field: (row: OrderBasicInterface) => helper.dateEst(row.createdAt),
    sortable: true
  },
  {
    name: 'orderStatus',
    required: true,
    label: t('orderStatus'),
    align: 'left',
    field: (row: OrderBasicInterface) => row.statusName,
    sortable: false
  },
  {
    name: 'orderTotal',
    required: true,
    label: t('orderTotal'),
    align: 'left',
    field: (row: OrderBasicInterface) => row.price,
    sortable: false
  },
  {
    name: 'note',
    required: true,
    label: t('note'),
    align: 'left',
    field: (row: OrderBasicInterface) => row.noteForPostman,
    sortable: false
  },
  {
    name: 'attachments',
    required: true,
    label: t('attachments'),
    align: 'left',
    field: (row: OrderBasicInterface) => row.attachments.length,
    sortable: false
  },
  {
    name: 'carrier',
    required: true,
    label: t('carrier'),
    align: 'left',
    sortable: false,
    field: (row: OrderBasicInterface) => row.carrierName
  },
  {
    name: 'trackingNumber',
    field: 'trackingNumber',
    required: true,
    label: t('trackingInfo'),
    align: 'left',
    sortable: false
  },
  {
    name: 'customer-email',
    required: true,
    label: t('Created By'),
    align: 'left',
    field: 'customer',
    sortable: false
  },
  {
    name: 'deliveryDate',
    required: true,
    label: t('deliveryDate'),
    align: 'left',
    field: (row: OrderBasicInterface) => row.deliveryDate ? helper.dateEst(row.deliveryDate, 'MM/DD/YYYY') : '-',
    sortable: false
  }
])
const orderRepository: OrderApi = new OrderApi(api)
const organizationRepository: OrganizationApi = new OrganizationApi(api)
const { facilities, loading: facilitiesLoading } = useReusableFacilitiesList()
const notesDialog = ref<boolean>(false)
const attachmentsDialog = ref<boolean>(false)
const loading = ref<boolean>(false)
const note = ref<string | null>(null)
const form: Ref<QForm | null> = ref(null)
const attachments = ref<AttachmentModel[]>([])
const filterBy = ref<OrdersFilter>({
  status: [],
  period: null,
  orderType: [],
  carrier: [],
  firstName: null,
  lastName: null,
  insuranceId: null,
  orderId: null,
  trackingNumber: null,
  orderFrom: undefined,
  orderTo: undefined
})
const organizations = ref<InsuranceOrganizationModel[]>([])

const { serverErrors, resetServerErrors, catchValidationErrors } = useServerErrors2({
  firstName: '',
  lastName: '',
  insuranceId: '',
  orderId: '',
  trackingNumber: '',
  status: '',
  orderType: '',
  carrier: '',
  orderFrom: '',
  orderTo: '',
  organizationId: '',
  facilityId: ''
}, {
  unPrefix: 'filterBy'
})

useMeta({
  title: 'Orders'
})

const preparingToDownload = ref<boolean>(false)

async function downloadCsvOrders() {
  preparingToDownload.value = true
  try {
    const attachment = await orderRepository.createCsvLink(filterBy.value, { [pagination.value.sortBy]: pagination.value.descending ? 'desc' : 'asc' },)
    await download(attachment)
  } catch (e) {

  }
  preparingToDownload.value = false
}

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

    const response = await orderRepository.getOrders(page, filterBy.value, { [sortBy]: descending ? 'desc' : 'asc' }, rowsPerPage)
    console.log(response);

    rows.value.splice(0, rows.value.length, ...response.items as unknown as OrderBasicInterface[])

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

const onRowClick = (evt: PointerEvent, row: OrderBasicInterface): void => {
  const target = evt.target as HTMLButtonElement | null
  if (target && (target.tagName === 'TD' || target.parentElement?.tagName === 'TD')) {
    router.push({
      name: 'customer-order-details',
      params: {
        customerId: row.customer.id,
        orderId: row.id
      }
    })
  }
}

onMounted(async () => {
  tableRef.value?.requestServerInteraction()
  organizations.value = await organizationRepository.getOrganizations()
})
</script>
