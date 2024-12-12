<template>
  <div class="q-mb-md">
    <q-btn
      color="secondary"
      text-color="primary"
      icon="sym_o_archive"
      :label="$t('exportToCsv')"
      :loading="preparingToDownload"
      size="md"
      @click="downloadCsvItems"
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
    <template #top>
      <q-form
        ref="form"
        class="row items-start col-9"
      >
        <q-input
          :model-value="filterBy.balance"
          :error-message="serverErrors?.balance"
          :error="!!serverErrors?.balance"
          dense
          type="number"
          class="col q-pr-sm"
          :label="$t('balanceMoreThen')"
          outlined
          clearable
          @change="filterBy.balance=$event"
          @clear="filterBy.balance=null"
        />

        <q-select
          v-model="filterBy.lastOrderType"
          :error-message="serverErrors?.lastOrderType"
          :error="!!serverErrors?.lastOrderType"
          :options="helper.parseObjectFromConstant(constants.ORDER_TYPES)"
          outlined
          multiple
          class="col q-pr-sm"
          option-value="text"
          option-label="value"
          :label="$t('lastOrderType')"
          clearable
          dense
          emit-value
          map-options
        />

        <app-date-picker
          v-model="filterBy.lastOrderedAt"
          class="col q-pr-sm"
          :error-message="serverErrors?.lastOrderedAt"
          :label="$t('lastOrderedAt')"
        />
      </q-form>
    </template>
    <template #body-cell-customer="scope">
      <q-td :props="scope">
        <bricks-btn-customer-link
          v-if="scope.value"
          :customer="scope.value"
          :show-name="true"
        />
      </q-td>
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
import { constants } from 'boot/constants'
import { helper } from 'boot/helper'
import { AxiosError } from 'axios'
import { computed, Ref, ref, watchEffect } from 'vue'
import { CustomerList, FacilityCustomerList, FacilityCustomersFilter } from 'src/types'
import { useServerErrors } from 'src/composables/useServerErrors'
import ReportApi from 'src/api/ReportApi'
import { api } from 'boot/axios'
import CustomerModel from 'src/models/CustomerModel'
import { useI18n } from 'vue-i18n'
import FacilityModel from 'src/models/facility/FacilityModel'
import { FacilityCustomer } from 'src/models/facility/FacilityCustomer'
import { useAttachment } from 'src/composables/useAttachment'

const props = defineProps<{
  facility: FacilityModel
}>()
const reportRepository = new ReportApi(api)
const page = ref<number>(1)
const loading = ref<boolean>(false)

const filterBy = ref<FacilityCustomersFilter>({
  facilityId: Number(props.facility.id),
  balance: undefined,
  lastOrderType: undefined,
  lastOrderedAt: undefined
})

const pagination = ref<FacilityCustomerList>({
  totalItemCount: 0,
  totalPages: 0,
  items: []
})
const { serverErrors, processErrors } = useServerErrors()
const { t } = useI18n()

const { download } = useAttachment()
const preparingToDownload: Ref<boolean> = ref(false)

const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: 'id',
    sortable: false
  },
  {
    name: 'customer',
    required: true,
    label: t('name'),
    align: 'left',
    field: (row: FacilityCustomer) => row,
    sortable: false
  },
  {
    name: 'insuranceId',
    required: true,
    label: t('insuranceId'),
    align: 'left',
    field: (row: FacilityCustomer) => row.insuranceId,
    sortable: false
  },
  {
    name: 'balance',
    required: true,
    label: t('balance'),
    align: 'left',
    field: (row: FacilityCustomer) => row.balance,
    format: (val: number) => `${val} $`,
    sortable: false
  },
  {
    name: 'notes',
    label: 'Order Notes',
    field: 'notes',
    align: 'left'
  }
])

async function changePage (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    pagination.value = await reportRepository.getActiveCustomersByFacility(page.value, filterBy.value)
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    loading.value = false
  }
}

watchEffect(async () => {
  await changePage()
})

const downloadCsvItems = async () => {
  preparingToDownload.value = true
  try {
    const attachment = await reportRepository.createActiveCustomersByFacilityCsv(filterBy.value)
    await download(attachment)
  } catch (e) {}
  preparingToDownload.value = false
}
</script>
