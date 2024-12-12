<template>
  <div class="q-mb-md">
    <q-btn
      color="secondary"
      text-color="primary"
      :to="{ name: 'add-broker-agency' }"
      icon="add"
      :label="$t('createNewAgency')"
      size="md"
    />
  </div>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    flat
    binary-state-sort
    :rows-per-page-options="[10, 25, 50, 100]"
    @request="onRequest"
  >
    <template #header-cell-actions="scope">
      <q-th :props="scope">
        <span class="q-mr-md">{{ $t('edit') }}</span>
      </q-th>
    </template>
    <template #body-cell-createdAt="scope">
      <q-td :props="scope">
        <template v-if="scope.value">
          <div>{{ helper.dateEst(scope.value, DATE_FORMAT) }}</div>
          <div>{{ helper.dateEst(scope.value, TIME_FORMAT) }}</div>
        </template>
        <div v-else>
          {{ $t('never') }}
        </div>
      </q-td>
    </template>
    <template #body-cell-updatedAt="scope">
      <q-td :props="scope">
        <template v-if="scope.value">
          <div>{{ helper.dateEst(scope.value, DATE_FORMAT) }}</div>
          <div>{{ helper.dateEst(scope.value, TIME_FORMAT) }}</div>
        </template>
        <div v-else>
          {{ $t('never') }}
        </div>
      </q-td>
    </template>
    <template #body-cell-actions="scope">
      <q-td :props="scope">
        <q-btn
          :title="$t('edit')"
          :to="{ name: 'edit-broker-agency', params: { brokerAgency: scope.row.id } }"
          color="secondary"
          flat
          round
          size="md"
          icon="edit_note"
        />
        <q-btn
          :title="$t('brokersInThisAgency')"
          :to="{ name: 'brokers-list', query: { brokerAgency: scope.row.id, status: 1 } }"
          color="secondary"
          flat
          round
          size="md"
          icon="person_search"
        />
      </q-td>
    </template>
    <template #pagination="scope">
      <bricks-table-pagination-buttons
        :scope="scope"
        :loading="loading"
      />
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
</template>

<script setup lang="ts">

import { Notify, QTable } from 'quasar'
import usePagination from 'src/composables/usePagination'
import { ref, computed, onMounted } from 'vue'
import { BrokerAgencies, QTableRequestProps } from 'src/types'
import { useI18n } from 'vue-i18n'
import { api } from 'boot/axios'
import BrokersApi from 'src/api/BrokersApi'
import { helper } from 'boot/helper'
import { DATE_FORMAT, TIME_FORMAT } from 'src/types/formats'
const { t } = useI18n()
const { pagination, updateRowsNumber, totalPages, updateFromTableRequestProps: updPagination } = usePagination()
const rows = ref<BrokerAgencies[]>([])
const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: (row: BrokerAgencies) => row.id,
    sortable: false
  },
  {
    name: 'name',
    required: true,
    label: t('name'),
    align: 'left',
    field: (row: BrokerAgencies) => row.name,
    sortable: true
  },
  {
    name: 'createdAt',
    required: true,
    label: t('createdAt'),
    align: 'left',
    field: (row: BrokerAgencies) => row.createdAt,
    sortable: false
  },
  {
    name: 'updatedAt',
    required: true,
    label: t('updatedAt'),
    align: 'left',
    field: (row: BrokerAgencies) => row.updatedAt,
    sortable: false
  },
  {
    field: 'actions',
    name: 'actions',
    classes: 'right-0',
    headerClasses: 'right-0'
  }
])
const loading = ref<boolean>(false)
const tableRef = ref<QTable | null>(null)
const brokerRepository: BrokersApi = new BrokersApi(api)

const onRequest = async (props: QTableRequestProps): Promise<void> => {
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  try {
    loading.value = true

    const offset = (page - 1) * rowsPerPage

    const response = await brokerRepository.getBrokerAgenciesList([], [{ name: sortBy, direction: descending ? 'desc' : 'asc' }], offset, rowsPerPage)

    rows.value.splice(0, rows.value.length, ...response.data)

    updPagination(props)

    updateRowsNumber(response.meta.totalItemCount)
  } catch (err: unknown) {
    console.error(err)
    Notify.create({
      message: 'Error',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  tableRef.value?.requestServerInteraction()
})
</script>

<style scoped>

</style>
