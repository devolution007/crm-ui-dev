<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('contactRequestList') }}
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
      <template #header-cell="props">
        <app-sort
          v-model:sortBy="sortBy"
          :name="props.col.name"
          :label="props.col.label"
        />
      </template>
      <template #body-cell-insuranceId="props">
        <q-td :props="props">
          <AppLink
            v-if="props.row.order"
            :link="`/customers/${props.row.order.customer.id}/orders`"
            :label="props.row.order.customer.insuranceId "
          />
        </q-td>
      </template>
      <template #body-cell-orderId="props">
        <q-td :props="props">
          <AppLink
            v-if="props.row.order"
            :link="`/customers/${props.row.order.customer.id}/order/${props.row.order.id}`"
            :title="$t('goToOrder')"
            :label="props.row.order.id"
          />
        </q-td>
      </template>
      <template #body-cell-description="scope">
        <q-td :props="scope">
          <div class="white-space-normal">
            {{ scope.value }}
          </div>
        </q-td>
      </template>
      <template #body-cell-createdAt="scope">
        <q-td :props="scope">
          <div>{{ helper.dateEst(scope.value, DATE_FORMAT) }}</div>
          <div>{{ helper.dateEst(scope.value, TIME_FORMAT) }}</div>
        </q-td>
      </template>

      <template #top>
        <div class="column items-stretch col-grow">
          <q-form
            ref="form"
            class="row q-col-gutter-sm"
            style="width: 100%"
          >
            <q-input
              :model-value="filters.insuranceId"
              :error-message="serverErrors?.insuranceId"
              :error="!!serverErrors?.insuranceId"
              class="col q-pr-sm"
              outlined
              :label="$t('insuranceId')"
              dense
              clearable
              @change="filters.insuranceId=$event"
              @clear="filters.insuranceId=''"
            />
            <q-input
              :model-value="filters.name"
              :error-message="serverErrors?.name"
              :error="!!serverErrors?.name"
              class="col q-pr-sm"
              outlined
              :label="$t('name')"
              dense
              clearable
              @change="filters.name=$event"
              @clear="filters.name=''"
            />
            <q-input
              :model-value="filters.orderId"
              :error-message="serverErrors?.orderId"
              :error="!!serverErrors?.orderId"
              dense
              :label="$t('orderId')"
              outlined
              class="col q-pr-sm"
              clearable
              @change="filters.orderId=$event"
              @clear="filters.orderId=''"
            />
            <div class="col-auto col-grow text-right">
              <q-btn
                v-if="isFiltersApplied"
                data-cy="customers-search-clear-btn"
                class="q-mr-sm"
                text-color="secondary"
                icon="sym_o_close"
                round
                size="md"
                @click="clearFilters"
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
import { computed, ref, watchEffect } from 'vue'
import { useMeta } from 'quasar'
import { AxiosError } from 'axios'
import { useServerErrors } from 'src/composables/useServerErrors'
import { ContactRequestFilter, ContactRequestList, SortBy } from 'src/types'
import TaskApi from 'src/api/TaskApi'
import { api } from 'boot/axios'
import { useI18n } from 'vue-i18n'
import ContactRequestModel from 'src/models/ContactRequestModel'
import { helper } from 'boot/helper'
import { TIME_FORMAT, DATE_FORMAT } from 'src/types/formats'
import useFilters from 'src/composables/useFilters'

const { t } = useI18n()
const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    sortable: false,
    field: (row: ContactRequestModel) => row.id
  },
  {
    name: 'name',
    required: true,
    label: t('name'),
    align: 'left',
    sortable: false,
    field: (row: ContactRequestModel) => row.name
  },
  {
    name: 'createdAt',
    required: true,
    label: t('createdAt'),
    align: 'left',
    sortable: false,
    field: 'createdAt'
  },
  {
    name: 'insuranceId',
    required: true,
    label: t('memberId'),
    align: 'left',
    sortable: false
  },
  {
    name: 'orderId',
    required: true,
    label: t('orderId'),
    align: 'left',
    sortable: false
  },
  {
    name: 'email',
    required: true,
    label: t('email'),
    align: 'left',
    sortable: false,
    field: (row: ContactRequestModel) => row.email
  },
  {
    name: 'phone',
    required: true,
    label: t('phone'),
    align: 'left',
    sortable: false,
    field: (row: ContactRequestModel) => row.formattedPhone
  },
  {
    name: 'description',
    required: true,
    label: t('message'),
    align: 'left',
    sortable: false,
    field: (row: ContactRequestModel) => row.description
  }
])
const { serverErrors, processErrors } = useServerErrors()
const taskRepository: TaskApi = new TaskApi(api)
const page = ref<number>(1)
const loading = ref<boolean>(false)
const pagination = ref<ContactRequestList>({
  totalItemCount: 0,
  totalPages: 0,
  items: []
})

const { filters, isFiltersApplied, clearFilters } = useFilters({
  insuranceId: '',
  name: '',
  orderId: ''
})


const sortBy = ref<SortBy[]>([{ createdAt: 'desc' }])
useMeta({
  title: 'Contact Request List'
})
async function changePage (): Promise<void> {
  try {
    serverErrors.value = {}
    loading.value = true
    pagination.value = await taskRepository.getContactRequestItems(page.value, filters.value, sortBy.value)
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
