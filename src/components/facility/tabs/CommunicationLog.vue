<template>
  <div class="row q-mb-md">
    <facility-add-log-form
      :facility="facility"
      @saved="changePage"
    />
  </div>
  <q-table
    :loading="loading"
    flat
    binary-state-sort
    style="height: 800px"
    :rows-per-page-options="[0]"
    :rows="pagination.items"
    hide-pagination
    :columns="columns"
  >
    <template #body="scope">
      <q-tr :props="scope">
        <q-td
          key="id"
          :props="scope"
        >
          {{ scope.row.id }}
        </q-td>
        <q-td
          key="datetime"
          :props="scope"
        >
          {{ $helper.dateEst(scope.row.datetime, DATE_FULL_FORMAT) }}
        </q-td>
        <q-td
          key="staff"
          :props="scope"
        >
          {{ scope.row.staff.name }}
        </q-td>
        <q-td
          key="member"
          :props="scope"
        >
          <tools-member-indicator
            :member="scope.row.member"
            :show-tooltip="true"
          />
        </q-td>
        <q-td
          key="channel"
          :props="scope"
        >
          {{ scope.row.channel }}
        </q-td>
        <q-td
          key="reason"
          :props="scope"
        >
          <div class="max300px white-space-normal min-width-200">{{ scope.row.reason }}</div>
        </q-td>
        <q-td
          key="result"
          :props="scope"
        >
          <span class="cursor-pointer inline-block white-space-pre min-width-200">{{ scope.row.result }}</span>
          <bricks-patch-editor
            :title="$t('editResult')"
            :model-value="scope.row.result"
            :save="async (value) => await patchCommunicationLog('result', value, scope.row.id)"
            :cover="true"
            :error="!!serverErrors.result"
            :error-message="serverErrors.result"
            input-type="textarea"
            @before-show="resetServerErrors"
          />
        </q-td>
        <q-td
          key="link"
          :props="scope"
        >
          <span>
            <span
              v-if="scope.row.link"
              class="cursor-pointer inline-block max300px overflow-hidden text-ellipsis"
            >
              {{ scope.row.link }}
            </span>
            <span
              v-else
              class="text-italic text-toner cursor-pointer"
            >{{ $t('setValue') }}</span>

            <bricks-patch-editor
              :title="$t('editLink')"
              :model-value="scope.row.link"
              :save="async (value) => await patchCommunicationLog('link', value, scope.row.id)"
              :cover="true"
              :error="!!serverErrors.link"
              :error-message="serverErrors.link"
              @before-show="resetServerErrors"
            />
          </span>

          <bricks-btn-external-link
            v-if="scope.row.link"
            class="q-ml-sm"
            :link="scope.row.link"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div class="row justify-center q-mt-md">
    <q-pagination
      v-model="page"
      :max="pagination.totalPages"
      max-pages="10"
    />
    <div class="q-ml-md">
      {{ $t('results') }}
      <q-badge
        v-if="helper.filterApplied && pagination.totalItemCount && !loading"
        align="top"
        color="green"
      >
        {{ pagination.totalItemCount }}
      </q-badge>
    </div>
  </div>
</template>
<script setup lang="ts">
import FacilityModel from 'src/models/facility/FacilityModel'
import { useI18n } from 'vue-i18n'
import { api } from 'boot/axios'
import { helper } from 'boot/helper'
import { computed, ref, toRaw, watchEffect } from 'vue'
import { FacilityCommunicationLogFilter, FacilityCommunicationLogList, SortBy } from 'src/types'
import FacilityApi from 'src/api/FacilityApi'
import CommunicationModel, { CommunicationLog } from 'src/models/facility/CommunicationModel'
import { AxiosError } from 'axios'
import { useServerErrors } from 'src/composables/useServerErrors'
import useServerErrors2 from 'src/composables/useServerErrors2'
import { Notify } from 'quasar'
import { DATE_FULL_FORMAT } from 'src/types/formats'

const facilityRepository: FacilityApi = new FacilityApi(api)
const props = defineProps<{
  facility: FacilityModel
}>()

const { processErrors } = useServerErrors()
const { catchValidationErrors, resetServerErrors, serverErrors } = useServerErrors2({
  result: '',
  link: ''
})
const page = ref<number>(1)
const loading = ref<boolean>(false)
const filterBy = ref<FacilityCommunicationLogFilter>({
  facilityId: Number(props.facility.id)
})
const sortBy = ref<SortBy[]>([
  { id: 'desc' }
])

const pagination = ref<FacilityCommunicationLogList>({
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
    field: (row: CommunicationModel) => row.id,
    sortable: false
  },
  {
    name: 'datetime',
    label: t('date'),
    align: 'left',
    field: 'datetime',
    sortable: false
  },
  {
    name: 'staff',
    required: true,
    label: t('staffRep'),
    align: 'left',
    field: (row: CommunicationModel) => row.staff.name,
    sortable: false
  },
  {
    name: 'member',
    required: true,
    label: t('member'),
    align: 'left',
    field: (row: CommunicationModel) => row.member.email,
    sortable: false
  },
  {
    name: 'channel',
    required: true,
    label: t('channel'),
    align: 'left',
    field: (row: CommunicationModel) => row.channel,
    sortable: false
  },
  {
    name: 'reason',
    required: true,
    label: t('reason'),
    align: 'left',
    field: (row: CommunicationModel) => row.reason,
    sortable: false
  },
  {
    name: 'result',
    required: true,
    label: t('result'),
    align: 'left',
    field: (row: CommunicationModel) => row.result,
    sortable: false
  },
  {
    name: 'link',
    required: true,
    label: t('link'),
    align: 'left',
    field: (row: CommunicationModel) => row.link,
    sortable: false
  }
])

const patchCommunicationLog = async (field: 'link' | 'result', value: string, id: number/* , row: CommunicationLog */): Promise<void> => {
  const patchData: Partial<CommunicationLog> = {}
  patchData[field] = value
  try {
    await facilityRepository.patchCommunicationLog(id, patchData)
    await changePage()
  } catch (err: unknown) {
    catchValidationErrors(err)

    throw err
  }
}

async function changePage (): Promise<void> {
  try {
    loading.value = true
    pagination.value = await facilityRepository.getCommunicationLog(page.value, filterBy.value, sortBy.value)
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    loading.value = false
  }
}

watchEffect(async () => {
  await changePage()
})
</script>
