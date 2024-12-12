<script setup lang="ts">
import OrganizationApi from 'src/api/OrganizationApi'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import IssueApi from 'src/api/IssueApi'
import { api } from 'boot/axios'
import { computed, onMounted, ref, watchEffect } from 'vue'
import IssueModel from 'src/models/IssueModel'
import { IssueList, IssuesFilter, SortBy } from 'src/types'
import { useServerErrors } from 'src/composables/useServerErrors'
import { useAttachment } from 'src/composables/useAttachment'
import { Notify, useMeta } from 'quasar'
import { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import { useI18n } from 'vue-i18n'
import { constants } from 'boot/constants'
import MemberApi from 'src/api/MemberApi'
import MemberModel, { MemberBasicInterface } from 'src/models/MemberModel'
import useColorIconConstEntries from 'src/composables/useColorIconConstEntries'
import { DATE_FORMAT, TIME_FORMAT } from 'src/types/formats'
import { TableCellSlotScope } from 'src/types/quasar-add'
import useIssueCategories from 'src/composables/useIssueCategories'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CsrCellScope extends TableCellSlotScope {
  value: MemberBasicInterface
}

const { issueCategories } = useIssueCategories()

const organizationRepository: OrganizationApi = new OrganizationApi(api)
const memberRepository: MemberApi = new MemberApi(api)
const issueRepository: IssueApi = new IssueApi(api)
const loading = ref<boolean>(false)
const page = ref<number>(1)
const sortBy = ref<SortBy[]>([{ createdAt: 'desc' }])
const filterBy = ref<IssuesFilter>({
  memberId: undefined,
  statuses: ['New', 'In progress']
})
const pagination = ref<IssueList>({
  totalItemCount: 0,
  totalPages: 0,
  items: []
})
const organizations = ref<InsuranceOrganizationModel[]>([])
const members = ref<MemberModel[]>([])
const { download } = useAttachment()
const { serverErrors, processErrors } = useServerErrors()
const { t } = useI18n()
const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
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
    name: 'resolvedBy',
    required: true,
    label: t('resolved'),
    align: 'left',
    field: 'resolvedBy',
    sortable: false
  },
  {
    name: 'status',
    required: true,
    label: t('status'),
    align: 'left',
    field: 'status',
    sortable: false
  },
  {
    name: 'priority',
    required: true,
    label: t('priority'),
    align: 'left',
    field: 'priority',
    sortable: false
  },
  {
    name: 'order',
    required: true,
    label: t('orderId'),
    align: 'left',
    sortable: false
  },
  {
    name: 'customer',
    required: true,
    label: t('customer'),
    align: 'left',
    field: 'customer',
    sortable: false
  },
  {
    name: 'category',
    required: true,
    label: t('category'),
    align: 'left',
    field: (row: IssueModel) => row.category,
    sortable: false
  },
  {
    name: 'todo',
    required: true,
    label: t('shortDescription'),
    align: 'left',
    field: 'todo',
    sortable: false
  },
  {
    name: 'createdBy',
    required: true,
    label: t('createdBy'),
    align: 'left',
    field: 'member',
    sortable: false
  }
])
const preparingToDownload = ref<boolean>(false)

useMeta({
  title: 'Issues'
})

async function changePage (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    pagination.value = await issueRepository.getIssues(page.value, filterBy.value, sortBy.value)
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    loading.value = false
  }
}

async function downloadCsvIssues () {
  preparingToDownload.value = true
  try {
    const attachment = await issueRepository.createCsvLink(filterBy.value)
    await download(attachment)
  } catch (err: Error | AxiosError) {
    Notify.create({
      message: 'Error while requesting data'
    })
  }
  preparingToDownload.value = false
}

watchEffect(async () => {
  await changePage()
})

onMounted(async () => {
  organizations.value = await organizationRepository.getOrganizations()
  members.value = await memberRepository.getMembersForThisOrganization()
})

const { getEntryByLabel: getIssueStatusByLabel } = useColorIconConstEntries(constants.ISSUE_STATUSES)
const { getEntryByLabel: getIssuePriorityByLabel } = useColorIconConstEntries(constants.ISSUE_PRIORITIES)
</script>
<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('issues') }}
      <template #actions>
        <q-btn
          color="secondary"
          text-color="primary"
          icon="sym_o_archive"
          :label="$t('exportToCsv')"
          size="md"
          :loading="preparingToDownload"
          @click="downloadCsvIssues"
        />
      </template>
    </bricks-page-title>
    <q-table
      ref="tableRef"
      binary-state-sort
      style="height: 800px"
      :rows-per-page-options="[0]"
      :rows="pagination.items"
      hide-pagination
      :loading="loading"
      :columns="columns"
    >
      <template #top>
        <div class="column items-stretch col-grow">
          <q-form
            ref="form"
            class="row"
          >
            <q-input
              :model-value="filterBy.orderId"
              :error-message="serverErrors?.orderId"
              :error="!!serverErrors?.orderId"
              dense
              :label="$t('orderId')"
              outlined
              class="col q-pr-sm"
              clearable
              @change="filterBy.orderId=$event"
              @clear="filterBy.orderId=null"
            />

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

            <app-date-picker
              v-model="filterBy.from"
              class="col q-pr-sm"
              :error-message="serverErrors?.from"
              :label="$t('from')"
            />

            <app-date-picker
              v-model="filterBy.to"
              class="col q-pr-sm"
              :error-message="serverErrors?.to"
              :label="$t('to')"
            />

            <q-select
              v-model="filterBy.category"
              :options="issueCategories"
              outlined
              multiple
              class="col q-pr-sm"
              option-value="name"
              option-label="name"
              option-disable="disabled"
              :label="$t('categories')"
              clearable
              dense
              emit-value
              map-options
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

            <q-select
              v-model="filterBy.statuses"
              :options="helper.parseObjectFromConstant(constants.ISSUE_STATUS_LIST)"
              option-value="text"
              option-label="value"
              outlined
              :label="$t('status')"
              class="col q-pr-sm"
              dense
              multiple
              clearable
              emit-value
              map-options
            />

            <q-select
              v-model="filterBy.organizationId"
              :error-message="serverErrors?.organizationId"
              :error="!!serverErrors?.organizationId"
              :options="organizations"
              option-value="id"
              option-label="name"
              outlined
              multiple
              :label="$t('organization')"
              class="col q-pr-sm"
              dense
              clearable
              emit-value
              map-options
            />
          </q-form>
        </div>
      </template>
      <template #header-cell="props">
        <app-sort
          v-model:sortBy="sortBy"
          :name="props.col.name"
          :label="props.col.label"
        />
      </template>
      <template #body-cell-order="scope">
        <q-td :props="scope">
          <q-btn
            v-if="scope.row.order"
            dense
            no-caps
            unelevated
            :to="{ name: 'customer-order-details', params: {
              customerId: scope.row.customer.id,
              orderId: scope.row.order.id
            } }"
          >
            <div>
              <q-icon
                name="sym_o_local_mall"
                size="sm"
                class="q-mr-sm"
              />
              <span>#{{ scope.row.order.id }}</span>
            </div>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-id="scope">
        <q-td :props="scope">
          <q-btn
            dense
            no-caps
            unelevated
            :to="{ name: 'customer-issue-details', params: { customerId: scope.row.customer.id, issueId: scope.row.id } }"
          >
            <div>
              <q-icon
                name="sym_o_problem"
                size="sm"
                class="q-mr-sm"
              />
              #{{ scope.row.id }}
            </div>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-status="scope">
        <q-td :props="scope.props">
          <q-chip
            :color="getIssueStatusByLabel(scope.value)?.color"
            :label="getIssueStatusByLabel(scope.value)?.label"
            text-color="dark"
          />
        </q-td>
      </template>
      <template #body-cell-createdAt="scope">
        <q-td :props="scope">
          <div>{{ helper.dateEst(scope.value, DATE_FORMAT) }}</div>
          <div>{{ helper.dateEst(scope.value, TIME_FORMAT) }}</div>
        </q-td>
      </template>
      <template #body-cell-priority="scope">
        <q-td :props="scope.props">
          <q-chip
            :color="getIssuePriorityByLabel(scope.value)?.color"
            :label="getIssuePriorityByLabel(scope.value)?.label"
            text-color="dark"
          />
        </q-td>
      </template>
      <template #body-cell-createdBy="scope: CsrCellScope">
        <q-td :props="scope">
          <tools-member-indicator
            v-if="scope.value"
            :member="scope.value"
          />
        </q-td>
      </template>
      <template #body-cell-todo="scope">
        <q-td :props="scope">
          <div class="min-width-300 white-space-pre">
            {{ scope.value }}
          </div>
        </q-td>
      </template>
      <template #body-cell-customer="scope">
        <q-td :props="scope">
          <bricks-btn-customer-link
            v-if="scope.value"
            :customer="scope.value"
          />
        </q-td>
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
