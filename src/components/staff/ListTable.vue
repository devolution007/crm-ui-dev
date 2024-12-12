<template>
  <div class="q-mb-md">
    <q-btn
      color="secondary"
      text-color="primary"
      :to="{ name: 'staff-add', query: { facility: componentProps.facilityId } }"
      icon="add"
      :label="$t('add')"
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
    <template
      v-if="!componentProps.facilityId"
      #top
    >
      <div
        class="column items-stretch col-grow"
      >
        <div>
          <q-form
            ref="form"
            @submit="tableRef?.requestServerInteraction()"
          >
            <div class="row q-col-gutter-md">

              <div class="col-12 col-md-3">
                <q-input
                  v-model="filterBy.name"
                  dense
                  outlined
                  clearable
                  :label="$t('name')"
                  @update:model-value="tableRef?.requestServerInteraction()"
                  data-1p-ignore
                  debounce="300"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="filterBy.email"
                  dense
                  outlined
                  clearable
                  :label="$t('email')"
                  @update:model-value="tableRef?.requestServerInteraction()"
                  data-1p-ignore
                  debounce="300"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="filterBy.facilityIds"
                  dense
                  outlined
                  clearable
                  multiple
                  :options="facilities"
                  :label="$t('facilities')"
                  :loading="facilitiesLoading"
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  use-input
                  input-debounce="0"
                  @filter="facilityFilter"
                  @update:model-value="tableRef?.requestServerInteraction()"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  type="submit"
                  color="secondary"
                  text-color="primary"
                  icon="sym_o_search"
                  size="md"
                  round
                  :loading="loading"
                />
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </template>
    <template #header-cell-actions="scope">
      <q-th :props="scope">
        <span class="q-mr-md">{{ $t('active') }}</span>
        <span>{{ $t('actions') }}</span>
      </q-th>
    </template>
    <template #body-cell-actions="scope">
      <q-td :props="scope">
        <q-toggle
          :disable="loadings.includes(scope.row.id)"
          :model-value="scope.row.active"
          @update:model-value="toggleStaffActivity(scope.row.id)"
        >
          <q-inner-loading
            :showing="loadings.includes(scope.row.id)"
            color="primary"
          />
        </q-toggle>
        &nbsp;
        <q-btn
          :to="{ name: 'staff-edit', params: { staffId: scope.row.id }, query: { facility: componentProps.facilityId } }"
          :title="$t('edit')"
          color="secondary"
          flat
          round
          size="md"
          icon="edit_note"
        />
      </q-td>
    </template>
    <template #body-cell-note="scope">
      <q-td :props="scope">
        <div class="white-space-normal min-width-200">
          {{ scope.value }}
        </div>
      </q-td>
    </template>
    <template #body-cell-lastLoginDate="scope">
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
    <template #body-cell-facilities="scope">
      <q-td :props="scope">
        <div
          v-if="scope.value"
          class="white-space-normal min-width-200"
        >
          <div
            v-for="facility in scope.value.slice(0, 5)"
            :key="`facility${facility.id}`"
          >
            <q-btn
              :to="{ name: 'facility-view', params: { facilityId: facility.id } }"
              color="secondary"
              flat
              size="md"
              no-caps
              class="text-no-wrap"
            >
              <div class="flex no-wrap">
                <q-icon
                  name="business"
                  class="q-mr-sm"
                />
                <div>
                  {{ facility.name }}
                </div>
              </div>
            </q-btn>
          </div>
          <div v-if="scope.value.length > 5">
            <q-btn
              color="secondary"
              flat
              size="md"
              no-caps
              class="text-no-wrap"
              @click="showFullFacilitiesList(scope.value)"
            >
              Show all {{ scope.value.length }} facilities...
            </q-btn>
          </div>
        </div>
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
import { useI18n } from 'vue-i18n'
import { ref, computed, Ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { QTableRequestProps, StaffFilter } from 'src/types'
import StaffApi from 'src/api/StaffApi'
import { StaffInterface } from 'src/models/facility/StaffModel'
import { useFacilitiesList } from 'src/composables/useFacilitiesList'
import { Dialog, Notify, QTable } from 'quasar'
import usePagination from 'src/composables/usePagination'
import ImgSliderDialog from 'components/products/ImgSliderDialog.vue'
import { FacilityBasicInterface } from 'src/models/facility/FacilityModel'
import AssociatedFacilitiesDialog from 'components/staff/AssociatedFacilitiesDialog.vue'
import { helper } from 'boot/helper'
import { DATE_FORMAT, TIME_FORMAT } from 'src/types/formats'
const { facilities, facilitiesLoading, facilityFilter } = useFacilitiesList()
const { pagination, updateRowsNumber, totalPages, updateFromTableRequestProps: updPagination } = usePagination()

const { t } = useI18n()
const staffRepository: StaffApi = new StaffApi(api)
const tableRef = ref<QTable | null>(null)
const loading = ref<boolean>(false)
const page = ref<number>(1)

const filterBy = ref<StaffFilter>({
  facilityIds: []
})
const rows = ref(<StaffInterface[]>[])
const componentProps = defineProps<{
  facilityId?: number
}>()

const inactiveClassAuto = (row: StaffInterface) => {
  return row.active ? '' : 'text-inactive bg-inactive'
}
const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: (row: StaffInterface) => row.id,
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'title',
    required: true,
    label: t('title'),
    align: 'left',
    field: (row: StaffInterface) => row.title,
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'name',
    label: t('name'),
    align: 'left',
    field: 'name',
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'email',
    required: true,
    label: t('email'),
    align: 'left',
    field: (row: StaffInterface) => row.email,
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'phone',
    required: true,
    label: t('phone'),
    align: 'left',
    field: (row: StaffInterface) => row.phone,
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'prefered',
    required: true,
    label: t('preferred'),
    align: 'left',
    field: (row: StaffInterface) => row.preferredWayOfCommunication,
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'primary',
    required: true,
    label: t('primaryContact'),
    align: 'left',
    field: (row: StaffInterface) => row.primaryContact,
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'note',
    required: true,
    label: t('note'),
    align: 'left',
    field: (row: StaffInterface) => row.note,
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'facilities',
    label: t('facilities'),
    align: 'left',
    field: 'facilities',
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    name: 'lastLoginDate',
    label: t('lastLoginDate'),
    align: 'left',
    field: 'lastLoginDate',
    sortable: false,
    classes: inactiveClassAuto
  },
  {
    field: 'actions',
    name: 'actions',
    classes: 'sticky-cell right-0',
    headerClasses: 'sticky-cell right-0'
  }
])

if (componentProps.facilityId) {
  filterBy.value.facilityIds = [componentProps.facilityId]
}

const loadings: Ref<number[]> = ref([])
const toggleStaffActivity = async (id: number): Promise<void> => {
  loadings.value.push(id)
  try {
    await staffRepository.toggleActivation(id)
    tableRef.value?.requestServerInteraction()
  } catch (err) {
    Notify.create({
      message: 'Error',
      color: 'negative'
    })
  } finally {
    loadings.value = loadings.value.filter((i: number) => i !== id)
  }
}

const onRequest = async (props: QTableRequestProps): Promise<void> => {
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  try {
    loading.value = true

    const response = await staffRepository.getStaffList(page, filterBy.value, { [sortBy]: descending ? 'desc' : 'asc' }, rowsPerPage)

    rows.value.splice(0, rows.value.length, ...response.items)

    updPagination(props)

    updateRowsNumber(response.totalItemCount)
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

const showFullFacilitiesList = (facilities: FacilityBasicInterface[]): void => {
  Dialog.create({
    component: AssociatedFacilitiesDialog,
    componentProps: {
      facilities
    }
  })
}

onMounted(() => {
  tableRef.value?.requestServerInteraction()
})
</script>
