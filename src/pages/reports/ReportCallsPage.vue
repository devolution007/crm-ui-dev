<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('calls') }}
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
      binary-state-sort
      style="height: 800px"
      :rows-per-page-options="[0]"
      :rows="pagination.items"
      hide-pagination
      :loading="loading"
      :columns="columns"
    >
      <template #body-cell-csr="scope">
        <q-td :props="scope">
          <member-indicator
            :member="scope.value"
          />
        </q-td>
      </template>

      <template #body-cell-orders="props">
        <q-td :props="props">
          <template
            v-for="(order, key) in props.row.orders"
            :key="key"
          >
            <div>
              <q-btn
                :label="order.id"
                :title="$t('goToOrder')"
                flat
                dense
                :to="{
                  name: 'customer-order-details',
                  params: {
                    customerId: order.customer.id,
                    orderId: order.id,
                  },
                }"
              />
            </div>
          </template>
        </q-td>
      </template>

      <template #body-cell-customer="scope">
        <q-td :props="scope">
          <q-btn
            flat
            icon="sym_o_badge"
            :label="scope.value.name"
            no-caps
            no-wrap
            :to="{ name: 'customer-details', params: { customerId: scope.value.id } }"
            padding="none"
          />
        </q-td>
      </template>

      <template #body-cell-issues="props">
        <q-td :props="props">
          <template
            v-for="(issue, key) in props.row.issues"
            :key="key"
          >
            <AppLink
              :label="issue.id "
              :title="$t('goToIssue')"
              link="todo"
            />
            &nbsp;
            <br v-if="++key % 3===0">
          </template>
        </q-td>
      </template>

      <template #top>
        <div class="column items-stretch col-grow">
          <q-form
            ref="form"
            class="row"
          >
            <q-input
              :model-value="filterBy.insuranceId"
              :error-message="serverErrors.insuranceId"
              :error="!!serverErrors.insuranceId"
              class="col q-pr-sm"
              outlined
              :label="$t('insuranceId')"
              dense
              clearable
              @change="filterBy.insuranceId=$event"
              @clear="filterBy.insuranceId=null"
            />
            <q-input
              :model-value="filterBy.orderId"
              :error-message="serverErrors.orderId"
              :error="!!serverErrors.orderId"
              dense
              :label="$t('orderId')"
              type="number"
              outlined
              class="col q-pr-sm"
              clearable
              @change="filterBy.orderId=$event"
              @clear="filterBy.orderId=null"
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
              v-model="filterBy.type"
              :options="helper.parseObjectFromConstant(constants.CALL_TYPES_LIST)"
              outlined
              class="col q-pr-sm"
              dense
              option-value="text"
              option-label="value"
              :label="$t('callType')"
              emit-value
              map-options
              clearable
            />
            <q-select
              v-model="filterBy.categories"
              :options="helper.parseObjectFromConstant(constants.CALL_CATEGORIES)"
              outlined
              multiple
              class="col q-pr-sm"
              option-value="text"
              option-label="value"
              :label="$t('categories')"
              clearable
              dense
              emit-value
              map-options
            />

            <app-date-picker
              v-model="filterBy.from"
              class="col q-pr-sm"
              :error-message="serverErrors.from"
              :label="$t('from')"
            />

            <app-date-picker
              v-model="filterBy.to"
              class="col q-pr-sm"
              :error-message="serverErrors.to"
              :label="$t('to')"
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
              class="col q-pr-sm"
              dense
              multiple
              clearable
              emit-value
              map-options
            />
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
import { onMounted, watchEffect, ref, computed } from 'vue'
import { api } from 'boot/axios'
import MemberApi from 'src/api/MemberApi'
import MemberModel from 'src/models/MemberModel'
import { CallList, CallsFilter, SortBy } from 'src/types'
import CallApi from 'src/api/CallApi'
import { helper } from 'boot/helper'
import { constants } from 'boot/constants'
import CallModel, { CallBasic, CallDetailed } from 'src/models/CallModel'
import { AxiosError } from 'axios'
import { useServerErrors } from 'src/composables/useServerErrors'
import { useI18n } from 'vue-i18n'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import OrganizationApi from 'src/api/OrganizationApi'
import { QTable, useMeta } from 'quasar'
import useServerErrors2 from 'src/composables/useServerErrors2'
import MemberIndicator from 'components/tools/MemberIndicator.vue'

const { t } = useI18n()
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
    name: 'csr',
    required: true,
    label: t('csr'),
    align: 'left',
    field: 'operator',
    sortable: false
  },
  {
    name: 'type',
    required: true,
    label: t('type'),
    align: 'left',
    field: 'type',
    sortable: false
  },
  {
    name: 'startedAt',
    required: true,
    label: t('startedAt'),
    align: 'left',
    field: (row: CallDetailed) => helper.dateEst(row.startedAt),
    sortable: false
  },
  {
    name: 'currentDuration',
    required: true,
    label: t('duration'),
    align: 'left',
    field: (row: CallDetailed) => helper.secondsToDuration(row.currentDuration, 'HH:mm:ss'),
    sortable: false
  },
  {
    name: 'plan',
    required: true,
    label: t('plan'),
    align: 'left',
    field: (row: CallDetailed) => row.user?.insurancePlan?.name,
    sortable: false
  },
  {
    name: 'category',
    required: true,
    label: t('category'),
    align: 'left',
    field: 'categoryText',
    sortable: false
  },
  {
    name: 'customer',
    required: true,
    label: t('member'),
    align: 'left',
    field: 'user',
    sortable: false
  },
  {
    name: 'orders',
    required: true,
    label: t('orders'),
    align: 'left',
    sortable: false
  },
  {
    name: 'note',
    required: false,
    label: t('note'),
    align: 'left',
    field: (row: CallDetailed) => row.resolution,
    sortable: false
  },
  {
    name: 'issues',
    required: false,
    label: t('issues'),
    align: 'left',
    sortable: false
  }
])
const callRepository: CallApi = new CallApi(api)
const organizationRepository: OrganizationApi = new OrganizationApi(api)
const memberRepository: MemberApi = new MemberApi(api)
const page = ref<number>(1)
const form = ref(null)

const loading = ref<boolean>(false)

const filterBy = ref<CallsFilter>({
  memberId: null,
  categories: [],
  type: null,
  insuranceId: null,
  orderId: null,
  from: null,
  to: null,
  organizationId: null
})
const pagination = ref<CallList>({
  totalItemCount: 0,
  totalPages: 0,
  items: []
})
const members = ref<MemberModel[]>([])
const { serverErrors, resetServerErrors, catchValidationErrors } = useServerErrors2({
  insuranceId: '',
  orderId: '',
  from: '',
  to: '',
  organizationId: ''
})
const organizations = ref<InsuranceOrganizationModel[]>([])

useMeta({
  title: 'Calls'
})

async function changePage (): Promise<void> {
  resetServerErrors()
  try {
    loading.value = true
    pagination.value = await callRepository.getCalls(page.value, filterBy.value, { id: 'desc' })
  } catch (err: unknown) {
    catchValidationErrors(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  members.value = await memberRepository.getMembersForThisOrganization()
  organizations.value = await organizationRepository.getOrganizations()
})

watchEffect(async () => {
  await changePage()
})
</script>
