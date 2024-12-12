<template>
  <q-page padding>
    <bricks-page-title>
      Facilities Member Stats
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
      :rows-per-page-options="[0]"
      :rows="pagination.items"
      hide-pagination
      :loading="loading"
      :columns="columns"
      @row-click="onRowClick"
    >
      <template #body-cell="props">
        <q-td
          :class="{
            verified: props.row.verified,
            'not-verified': !props.row.verified,
            'no-customers': !props.row.activeCustomers,
          }"
          :props="props"
        >
          {{ props.value }}
        </q-td>
      </template>
      <template #body-cell-activeCustomers="props">
        <q-td
          :class="{
            verified: props.row.verified,
            'not-verified': !props.row.verified,
            'no-customers': !props.row.activeCustomers,
          }"
          :props="props"
        >
          {{ props.row.activeCustomers }}
          <q-btn
            v-if="props.row.activeCustomers>0"
            :to="`/facilities/${props.row.id}`"
            color="primary"
            flat
            round
            :title="$t('goToMemberList')"
          />
        </q-td>
      </template>
      <template #top-row>
        <q-tr>
          <q-td colspan="2">
            Total
          </q-td>
          <q-td colspan="1">
            {{ pagination.meta.activeCustomers }}
          </q-td>
          <q-td colspan="1">
            {{ pagination.meta.servedMembers }}
          </q-td>
          <q-td colspan="1">
            {{ pagination.meta.servedMembersPrevMonth }}
          </q-td>
          <q-td
            v-for="column in columns.length - 5"
            colspan="1"
          />
        </q-tr>
      </template>
      <template #top>
        <div class="column items-stretch col-grow">
          <q-form
            ref="form"
            class="row"
          >
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
            <q-input
              :model-value="filterBy.name"
              :error-message="serverErrors?.name"
              :error="!!serverErrors?.name"
              dense
              class="col"
              :label="$t('facilityName')"
              outlined
              clearable
              @change="filterBy.name=$event"
              @clear="filterBy.name=null"
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
import { computed, onMounted, ref, watchEffect } from 'vue'
import { FacilityFilter, FacilityReportList } from 'src/types'
import { useServerErrors } from 'src/composables/useServerErrors'
import { AxiosError } from 'axios'
import MemberModel from 'src/models/MemberModel'
import { api } from 'boot/axios'
import MemberApi from 'src/api/MemberApi'
import FacilityApi from 'src/api/FacilityApi'
import FacilityReportModel from 'src/models/facility/FacilityReportModel'
import { useI18n } from 'vue-i18n'
import { QTable, useMeta } from 'quasar'
import { OrderBasicInterface } from 'src/models/OrderModel'
import { useRouter } from 'vue-router'
const { t } = useI18n()

const memberRepository: MemberApi = new MemberApi(api)
const facilityRepository: FacilityApi = new FacilityApi(api)

const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: (row: FacilityReportModel) => row.id,
    sortable: false
  },
  {
    name: 'name',
    required: true,
    label: t('facilityName'),
    align: 'left',
    field: (row: FacilityReportModel) => row.name,
    sortable: false
  },
  {
    name: 'activeCustomers',
    required: true,
    label: t('activeMembers'),
    align: 'left',
    field: (row: FacilityReportModel) => row.activeCustomers,
    sortable: false
  },
  {
    name: 'servedMembers',
    required: true,
    label: t('servedMembers'),
    align: 'left',
    field: (row: FacilityReportModel) => row.servedMembers,
    sortable: false
  },
  {
    name: 'servedMembersPrevMonth',
    required: true,
    label: t('servedMembersPrevMonth'),
    align: 'left',
    field: 'servedMembersPrevMonth',
    sortable: false
  },
  {
    name: 'manager',
    required: true,
    label: t('manager'),
    align: 'left',
    field: (row: FacilityReportModel) => row.managerName,
    sortable: false
  }
])

const members = ref<MemberModel[]>([])
const page = ref<number>(1)
const loading = ref<boolean>(false)

const filterBy = ref<FacilityFilter>({
  memberId: undefined,
  name: undefined,
  verified: true
})
const pagination = ref<FacilityReportList>({
  totalItemCount: 0,
  totalPages: 0,
  items: [],
  meta: {
    activeCustomers: 0,
    servedMembers: 0,
    servedMembersPrevMonth: 0
  }
})
const { serverErrors, processErrors } = useServerErrors()

useMeta({
  title: 'Facilities'
})

async function changePage (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    pagination.value = await facilityRepository.getFacilitiesReport(page.value, filterBy.value)
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    loading.value = false
  }
}
onMounted(async () => {
  members.value = await memberRepository.getMembersForThisOrganization()
})

watchEffect(async () => {
  await changePage()
})

const router = useRouter()
const onRowClick = (evt: PointerEvent, row: FacilityReportModel): void => {
  const target = evt.target as HTMLButtonElement | null
  if (target && (target.tagName === 'TD' || target.parentElement?.tagName === 'TD')) {
    router.push({
      name: 'facility-view',
      params: {
        facilityId: row.id
      }
    })
  }
}
</script>

<style scoped>
.no-customers {
  background: rgba(178, 176, 176, 0.58) !important;
}
.not-verified {
  background: rgba(252, 218, 229, 0.66);
}
</style>
