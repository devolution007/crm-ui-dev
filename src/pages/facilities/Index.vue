<template>
  <q-page padding>
    <bricks-page-title>{{ $t('facilityList') }}</bricks-page-title>
    <div class="q-mb-md">
      <q-btn
        v-if="authStore.user && isPermittedToAddFacility(authStore.user.role)"
        :to="{ name: 'facility-add' }"
        color="secondary"
        text-color="primary"
        icon="sym_o_add"
        :label="$t('add')"
        size="md"
      />
    </div>
    <q-table
      binary-state-sort
      style="height: 800px"
      :rows-per-page-options="[0]"
      :rows="pagination.items"
      hide-pagination
      :loading="loading"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            :to="{ name: 'facility-view', params: { facilityId: props.row.id } }"
            :label="$t('view')"
            color="secondary"
            text-color="primary"
            icon="sym_o_pageview"
            size="md"
          />
        </q-td>
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
import { FacilityFilter, FacilityList, SortBy } from 'src/types'
import { useServerErrors } from 'src/composables/useServerErrors'
import { AxiosError } from 'axios'
import MemberModel from 'src/models/MemberModel'
import { api } from 'boot/axios'
import MemberApi from 'src/api/MemberApi'
import FacilityApi from 'src/api/FacilityApi'
import FacilityReportModel from 'src/models/facility/FacilityReportModel'
import { useI18n } from 'vue-i18n'
import { useMeta } from 'quasar'
import FacilityModel from 'src/models/facility/FacilityModel'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
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
    field: (row: FacilityModel) => row.name,
    sortable: false
  },
  {
    name: 'manager',
    required: true,
    label: t('manager'),
    align: 'left',
    field: (row: FacilityModel) => row.manager?.name,
    sortable: false
  },
  {
    name: 'verified',
    required: true,
    label: t('verified'),
    align: 'left',
    field: (row: FacilityModel) => row.verified,
    format: (val: boolean) => val ? 'Yes' : 'No',
    sortable: false
  },
  {
    field: 'actions',
    name: 'actions',
    label: t('actions')
  }
])
const members = ref<MemberModel[]>([])
const page = ref<number>(1)
const loading = ref<boolean>(false)

const filterBy = ref<FacilityFilter>({
  memberId: undefined,
  name: undefined
})
const sortBy = ref<SortBy[]>([
  { name: 'asc' }
])
const pagination = ref<FacilityList>({
  totalItemCount: 0,
  totalPages: 0,
  items: []
})
const { serverErrors, processErrors } = useServerErrors()

useMeta({
  title: 'Facilities'
})
function isPermittedToAddFacility (role: number): boolean {
  return role === 32 || role === 4 || role === 8
}
async function changePage (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    pagination.value = await facilityRepository.getFacilities(page.value, filterBy.value, sortBy.value)
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
</script>
