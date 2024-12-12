<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('ordersSchedule') }}
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
      <q-select
        v-model="filterBy.facilityIds"
        :error-message="serverErrors?.facilityId"
        :error="!!serverErrors?.facilityId"
        :loading="facilitiesLoading"
        outlined
        clearable
        dense
        multiple
        class="col"
        :options="facilities"
        :label="$t('facilities')"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        use-input
        input-debounce="0"
        @filter="facilityFilter"
      />
    </q-form>
    <AppSkeletonTable v-if="loading" />
    <q-markup-table v-else>
      <thead class="bg-cyan">
        <tr>
          <th>{{ $t('id') }}</th>
          <th>{{ $t('nfName') }}</th>
          <th
            v-for="(monthName, key) in pagination.monthsNames"
            :key="key"
          >
            {{ monthName }}
          </th>
          <th>{{ $t('dedicatedOtcManager') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(schedule, key) in pagination.schedules"
          :key="key"
        >
          <td>
            {{ schedule['facility']['id'] }}
          </td>
          <td>{{ schedule['facility']['name'] }}</td>

          <td
            v-for="month in pagination.months"
            :key="month"
          >
            <template v-if="parseSchedule(schedule, month).length > 5">
              {{ $t('dateNotSpecified') }}
            </template>

            <template v-else-if="parseSchedule(schedule, month).length > 2">
              {{ parseSchedule(schedule, month).length }} {{ $t('times').toLocaleLowerCase() }}
            </template>

            <template v-else-if="parseSchedule(schedule, month).length > 0">
              <span
                v-for="({date, amount}) in parseSchedule(schedule, month)"
                :key="amount+date"
                :title="amount"
              >{{ date }}</span>
              <br>
            </template>

            <template v-else>
              -
            </template>
          </td>
          <td>{{ schedule.facility.manager?.name }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <AppCustomPagination
      v-model="page"
      :loading="loading"
      :total-item-count="pagination.totalItemCount"
      :total-pages="pagination.totalPages"
    />
  </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { FacilityOrdersScheduleFilter } from 'src/types'
import { useServerErrors } from 'src/composables/useServerErrors'
import { AxiosError } from 'axios'
import MemberModel from 'src/models/MemberModel'
import { api } from 'boot/axios'
import MemberApi from 'src/api/MemberApi'
import FacilityApi from 'src/api/FacilityApi'
import { useMeta } from 'quasar'
import { useFacilitiesList } from 'src/composables/useFacilitiesList'

const { facilities, facilityFilter, facilitiesLoading } = useFacilitiesList()
const memberRepository: MemberApi = new MemberApi(api)
const facilityRepository: FacilityApi = new FacilityApi(api)
const members = ref<MemberModel[]>([])
const page = ref<number>(1)
const loading = ref<boolean>(false)
const filterBy = ref<FacilityOrdersScheduleFilter>({
  memberId: undefined,
  facilityIds: []
})
const pagination = ref({
  totalItemCount: 0,
  totalPages: 0,
  items: [],
  monthsNames: null,
  schedules: [],
  months: []
})
const { serverErrors, processErrors } = useServerErrors()
useMeta({
  title: 'Orders Schedule'
})

function parseSchedule (schedule: any, month: number) {
  const arrayOfObjects: any = []
  Object.entries(schedule.dates[month] || []).forEach(([date, amount]) => {
    arrayOfObjects.push({
      date,
      amount
    })
  })
  return arrayOfObjects
}

async function changePage (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    pagination.value = await facilityRepository.ordersSchedule(page.value, filterBy.value)
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    loading.value = false
  }
}
watchEffect(async () => {
  await changePage()
})

onMounted(async () => {
  loading.value = true
  members.value = await memberRepository.getMembersForThisOrganization()
  loading.value = false
})

</script>
