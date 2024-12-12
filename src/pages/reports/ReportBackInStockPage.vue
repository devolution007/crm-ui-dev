<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('backInStock') }}
      <template #actions>
        <q-btn
          color="secondary"
          text-color="primary"
          icon="sym_o_archive"
          :label="$t('exportToCsv')"
          size="md"
          @click="downloadCsvItems"
        />
      </template>
    </bricks-page-title>
    <q-table
      binary-state-sort
      style="height: 800px"
      :rows-per-page-options="[0]"
      :rows="pagination.items"
      hide-pagination
      :loading="loading"
      :columns="columns"
    >
      <template #body-cell-insuranceId="props">
        <q-td :props="props">
          <AppLink
            :label="props.row.customer.insuranceId "
            :link="`/customers/${props.row.customer.id}/orders`"
          />
        </q-td>
      </template>

      <template #top>
        <div class="column items-stretch col-grow">
          <q-form
            ref="form"
          >
            <div class="row">
              <q-input
                :model-value="filterBy.insuranceId"
                :error-message="serverErrors?.insuranceId"
                :error="!!serverErrors?.insuranceId"
                class="col q-pr-sm"
                outlined
                :label="$t('insuranceId')"
                dense
                clearable
                @change="filterBy.insuranceId=$event"
                @clear="filterBy.insuranceId=null"
              />

              <q-input
                :model-value="filterBy.sku"
                :error-message="serverErrors?.sku"
                :error="!!serverErrors?.sku"
                class="col q-pr-sm"
                outlined
                :label="$t('sku')"
                dense
                clearable
                @change="filterBy.sku=$event"
                @clear="filterBy.sku=null"
              />

              <q-select
                v-model="filterBy.memberId"
                :options="members"
                option-value="id"
                option-label="email"
                outlined
                :label="$t('member')"
                class="col q-pr-sm"
                dense
                clearable
                emit-value
                map-options
              />

              <app-date-picker
                v-model="filterBy.from"
                class="col q-pr-sm"
                :error-message="serverErrors?.from"
                :label="$t('requestedFrom')"
              />

              <app-date-picker
                v-model="filterBy.to"
                class="col q-pr-sm"
                :error-message="serverErrors?.to"
                :label="$t('requestedTo')"
              />
            </div>

            <div class="row">
              <q-select
                v-model="filterBy.organizationId"
                :error-message="serverErrors?.organizationId"
                :error="!!serverErrors?.organizationId"
                :options="organizations"
                option-value="id"
                option-label="name"
                outlined
                :label="$t('organization')"
                class="col q-pr-sm"
                dense
                multiple
                clearable
                emit-value
                map-options
              />
              <q-select
                v-model="filterBy.status"
                :error-message="serverErrors?.status"
                :error="!!serverErrors?.status"
                :options="$helper.parseObjectFromConstant(constants.SKU_STATUSES)"
                outlined
                option-value="text"
                option-label="value"
                :label="$t('status')"
                clearable
                emit-value
                map-options
                dense
                class="col q-mr-sm"
              />

              <q-select
                v-model="filterBy.types"
                multiple
                :error-message="serverErrors?.types"
                :error="!!serverErrors?.types"
                :options="['phone', 'sms', 'email']"
                outlined
                :label="$t('type')"
                clearable
                emit-value
                map-options
                dense
                class="col q-mr-lg"
              />

              <q-checkbox
                v-model="filterBy.isDone"
                :error-message="serverErrors?.isDone"
                :error="!!serverErrors?.isDone"
                class="col"
                dense
                clearable
                :label="$t('displayOnlyNotified')"
              />
            </div>
          </q-form>
        </div>
      </template>
    </q-table>
    <AppCustomPagination
      v-model="page"
      :loading="loading"
      :total-item-count="pagination.totalItemCount"
      :total-pages="pagination.totalPages"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { BackInStockFilter, BackInStockList, SortBy } from 'src/types'
import { useMeta } from 'quasar'
import { AxiosError } from 'axios'
import { useServerErrors } from 'src/composables/useServerErrors'
import BackInStockApi from 'src/api/BackInStockApi'
import { api } from 'boot/axios'
import OrganizationApi from 'src/api/OrganizationApi'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import MemberApi from 'src/api/MemberApi'
import MemberModel from 'src/models/MemberModel'
import BackInStockModel from 'src/models/BackInStockModel'
import { helper } from 'boot/helper'
import { constants } from 'boot/constants'
import { useAttachment } from 'src/composables/useAttachment'

const backInStockRepository: BackInStockApi = new BackInStockApi(api)
const organizationRepository: OrganizationApi = new OrganizationApi(api)
const memberRepository: MemberApi = new MemberApi(api)

const members = ref<MemberModel[]>([])
const page = ref<number>(1)
const loading = ref<boolean>(false)
const pagination = ref<BackInStockList>({
  totalItemCount: 0,
  totalPages: 0,
  items: []
})
const { t } = useI18n()
const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: (row: BackInStockModel) => row.id,
    sortable: false
  },
  {
    name: 'member',
    required: true,
    label: t('operator'),
    align: 'left',
    field: (row: BackInStockModel) => row.member?.name,
    sortable: false
  },
  {
    name: 'insuranceId',
    required: true,
    label: t('insuranceId'),
    align: 'left',
    field: (row: BackInStockModel) => row.customer.insuranceId,
    sortable: false
  },
  {
    name: 'customerName',
    required: true,
    label: t('customerName'),
    align: 'left',
    field: (row: BackInStockModel) => row.customer.name,
    sortable: false
  },
  {
    name: 'sku',
    required: true,
    label: t('sku') + ' #',
    align: 'left',
    field: (row: BackInStockModel) => row.product.sku,
    sortable: false
  },
  {
    name: 'title',
    required: true,
    label: t('productTitle'),
    align: 'left',
    field: (row: BackInStockModel) => row.product.name,
    sortable: false
  },
  {
    name: 'balance',
    required: true,
    label: t('balance'),
    align: 'left',
    field: (row: BackInStockModel) => row.customer.balance,
    format: (val: string) => val && '$ ' + val,
    sortable: false
  },
  {
    name: 'price',
    required: true,
    label: t('itemPrice'),
    align: 'left',
    field: (row: BackInStockModel) => row.product.skuDetails[0].price,
    format: (val: string) => '$ ' + val,
    sortable: false
  },
  {
    name: 'createdAt',
    required: true,
    label: t('dateOfRequest'),
    align: 'left',
    field: (row: BackInStockModel) => helper.dateEst(row.createdAt),
    sortable: false
  },
  {
    name: 'qty',
    required: true,
    label: t('inStockQuantity'),
    align: 'left',
    field: (row: BackInStockModel) => row.product.inStock,
    sortable: false
  }
])

const filterBy = ref<BackInStockFilter>({
  memberId: undefined,
  sku: undefined,
  organizationId: undefined,
  from: undefined,
  to: undefined,
  status: undefined,
  isDone: false,
  types: undefined
})
const sortBy = ref<SortBy[]>([{ createdAt: 'desc' }])
const { serverErrors, processErrors } = useServerErrors()
const organizations = ref<InsuranceOrganizationModel[]>([])
const preparingToDownload = ref<boolean>(false)
const { download } = useAttachment()

useMeta({
  title: 'Back In Stock Items'
})
async function changePage (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    pagination.value = await backInStockRepository.list(page.value, filterBy.value, sortBy.value)
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    loading.value = false
  }
}
watchEffect(async () => {
  await changePage()
})
async function downloadCsvItems () {
  preparingToDownload.value = true
  const attachment = await backInStockRepository.createCsvLink(filterBy.value)
  await download(attachment)
  preparingToDownload.value = false
}

onMounted(async () => {
  members.value = await memberRepository.getMembersForThisOrganization()
  organizations.value = await organizationRepository.getOrganizations()
})
</script>
