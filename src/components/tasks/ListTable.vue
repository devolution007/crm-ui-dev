<template>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    v-model:selected="selected"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    binary-state-sort
    :rows-per-page-options="[14, 25, 50, 100]"
    separator="horizontal"
    :selection="selectionMode"
    @request="onRequest"
    @selection="handleSelection"
    @row-click="handleRowClick"
  >
    <template #top>
      <div class="column items-stretch col-grow">
        <div class="q-table__title q-mb-md">
          {{ $t('tasks') }}
        </div>
        <q-form
          ref="formRef"
          class="row q-col-gutter-sm items-center"
          style="width: 100%"
          @submit="tableRef.requestServerInteraction()"
        >
          <div class="col">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 row items-stretch">
                <q-select
                  v-model="filters.assignedTo"
                  class="col-grow"
                  dense
                  outlined
                  :options="assignedToItems"
                  :label="$t('filterByAssignee')"
                  map-options
                  emit-value
                  :loading="membersLoading"
                  @update:model-value="formRef.submit()"
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption>
                          {{ scope.opt.description }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #selected-item="scope">
                    <q-item
                      dense
                      class="q-pa-none q-py-sm"
                    >
                      <q-item-section>
                        <q-item-label class="text-body2">
                          {{ scope.opt.label }}
                          <span
                            v-if="authStore.user?.id === scope.opt.value"
                            class="q-ml-xs text-italic"
                          >(me)</span>
                        </q-item-label>
                        <q-item-label caption>
                          {{ scope.opt.description }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 row items-stretch">
                <q-select
                  v-model="filters.status"
                  class="col-grow"
                  dense
                  outlined
                  :options="statuses"
                  :label="$t('filterByStatus')"
                  map-options
                  emit-value
                  multiple
                  use-chips
                  @update:model-value="formRef.submit()"
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>
                          <q-chip
                            :color="scope.opt.color"
                            :selected="scope.selected"
                            text-color="dark"
                          >
                            {{ scope.opt.label }}
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #selected-item="scope">
                    <div class="q-pt-sm q-pb-xs q-pr-xs">
                      <q-chip
                        class="q-ma-none"
                        removable
                        :tabindex="scope.tabindex"
                        :color="scope.opt.color"
                        text-color="dark"
                        @remove="scope.removeAtIndex(scope.index)"
                      >
                        {{ scope.opt.label }}
                      </q-chip>
                    </div>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 row items-stretch">
                <q-select
                  v-model="filters.category"
                  class="col-grow"
                  dense
                  outlined
                  :options="categoriesWithNotAssingedOption"
                  :label="$t('filterByCategory')"
                  map-options
                  emit-value
                  multiple
                  use-chips
                  @update:model-value="formRef.submit()"
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>
                          <q-chip
                            class="q-ma-none text-body2"
                            :color="scope.opt.color"
                            :selected="scope.selected"
                          >
                            {{ scope.opt.label }}
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #selected-item="scope">
                    <div class="q-pt-sm q-pb-xs q-pr-xs">
                      <q-chip
                        class="q-ma-none text-body2"
                        removable
                        :tabindex="scope.tabindex"
                        :color="scope.opt.color"
                        @remove="scope.removeAtIndex(scope.index)"
                      >
                        {{ scope.opt.label }}
                      </q-chip>
                    </div>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 row">
                <q-input
                  v-model="filters.title"
                  dense
                  outlined
                  clearable
                  :label="$t('search')"
                  @update:model-value="tableRef?.requestServerInteraction()"
                  data-1p-ignore
                  debounce="300"
                />
              </div>
            </div>
          </div>
          <div class="q-ml-auto col-12 col-sm-6 col-md-4 col-lg-3">
            <q-btn
              type="button"
              round
              :text-color="(selectionMode !== 'none') ? 'secondary' : 'primary'"
              :color="(selectionMode !== 'none') ? 'primary' : 'secondary'"
              icon="sym_o_library_add_check"
              :disable="selected.length > 0"
              @click="toggleSelectionMode"
              size="md"
            />
            <q-btn
              class="q-ml-sm"
              color="secondary"
              text-color="primary"
              icon="sym_o_archive"
              :label="$t('exportToCsv')"
              :loading="preparingToDownload"
              size="md"
              @click="downloadCsvItems"
            />
            <q-btn
              class="q-ml-sm"
              color="secondary"
              text-color="primary"
              round
              icon="sym_o_refresh"
              :loading="loading"
              type="submit"
              size="md"
            />
          </div>
        </q-form>
      </div>
    </template>
    <template #body-cell-dateBefore="props">
      <q-td :props="props">
        <span v-if="props.row.dateBefore">{{ $helper.dateUtc(props.row.dateBefore, DATE_FORMAT) }}</span>
        <span v-else>-</span>
        <span
          v-if="props.row.timeBefore"
          class="q-ml-xs"
        >{{ $helper.dateUtc(props.row.timeBefore, TIME_FORMAT) }}</span>
      </q-td>
    </template>
    <template #body-cell-assignedTo="props">
      <q-td :props="props">
        <tools-member-indicator :member="props.value" />
      </q-td>
    </template>
    <template #body-cell-customerName="props">
      <q-td :props="props">
        <span>{{ props?.value?.name || 'N/A' }} </span>
      </q-td>
    </template>
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-chip
          square
          :color="getTaskStatus(props.value).color"
          text-color="dark"
        >
          {{ getTaskStatus(props.value).label }}
        </q-chip>
      </q-td>
    </template>
    <template #body-cell-category="props">
      <q-td :props="props">
        <span>{{ taskCategory(props.value).label }}</span>
      </q-td>
    </template>
    <template #body-cell-priority="props">
      <q-td :props="props">
        <q-chip
          square
          :color="taskPriority(props.value).color"
          text-color="dark"
          :icon="taskPriority(props.value).icon"
        >
          {{ taskPriority(props.value).label }}
        </q-chip>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">

import { computed, onMounted, reactive, Ref, ref, watch } from 'vue'
import { Dialog, DialogChainObject, QForm, QTable, useQuasar } from 'quasar'
import { QTableRequestProps, SortBy, TasksFilter } from 'src/types'
import { useMembersStore } from 'stores/members-store'
import useTaskStatuses from 'src/composables/useTaskStatuses'
import { useAuthStore } from 'stores/auth-store'
import { api } from 'boot/axios'
import TaskApi from 'src/api/TaskApi'
import { TaskLEInterface } from 'src/models/TaskModel'
import { DATE_FORMAT, TIME_FORMAT } from 'src/types/formats'
import useTaskPriorities from 'src/composables/useTaskPriorities'
import useTaskCategories from 'src/composables/useTaskCategories'
import useRangeMultiselect from 'src/composables/useRangeMultiselect'
import { constants } from 'boot/constants'
import { useRouter } from 'vue-router'
import { useTasksStore } from 'stores/tasks-store'
import { useAttachment } from 'src/composables/useAttachment'

const router = useRouter()

const { fullListAsOptions: membersOptions, fetchFullList: fetchMembersAttempt, isLoadingList: membersLoading } = useMembersStore()
fetchMembersAttempt()
const { statuses, getStatusByValue: getTaskStatus } = useTaskStatuses()
const { getPriorityByValue: taskPriority } = useTaskPriorities()
const { categories, getCategoryByValue: taskCategory } = useTaskCategories()

const authStore = useAuthStore()
const tasksStore = useTasksStore()

const tableRef = ref(<QTable>{})
const formRef = ref(<QForm>{})
const loading = ref(false)

const filtersDefault: TasksFilter = {
  assignedTo: authStore.user?.id || null,
  status: [0, 20],
  category: [1],
  title: ''
}

const filters: TasksFilter = reactive({
  ...filtersDefault
})

const assignedToSystemItems = [
  {
    value: 'null',
    label: 'Not assigned'
  }, {
    value: -1,
    label: 'Any assignee'
  }
]

const notAssigndCategory = [
  {
    value: 'null',
    label: 'None',
    code: '',
  }
]
const { download } = useAttachment()
const preparingToDownload: Ref<boolean> = ref(false)
const assignedToItems = computed(() => [...assignedToSystemItems, ...membersOptions.value])
const categoriesWithNotAssingedOption = computed(() => [...notAssigndCategory, ...categories])

const pagination = ref({
  sortBy: 'dateBefore',
  descending: false,
  page: 1,
  rowsPerPage: 14,
  rowsNumber: <number | undefined>-1
})

const listRepo = new TaskApi(api)
const sorting: Ref<SortBy[]> = ref([])
const rows = ref(<TaskLEInterface[]>[])
const selectionMode = ref('none')
const { selected, handleSelection } = useRangeMultiselect(tableRef)
// const selected = ref([])

const columns = computed(() => [
  {
    name: 'id',
    field: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    sortable: true
  },
  {
    name: 'title',
    field: 'title',
    label: 'Task',
    align: 'left'
  },
  {
    name: 'customerName',
    field: 'customer',
    label: 'Customer Name',
    align: 'left',
    sortable: true
  },
  {
    name: 'assignedTo',
    field: 'assignedTo',
    label: 'Assignee',
    align: 'center'
  },
  {
    name: 'dateBefore',
    field: 'dateBefore',
    align: 'left',
    label: 'Due To',
    sortable: true
  },
  {
    name: 'priority',
    field: 'priority',
    label: 'Priority',
    align: 'right',
    sortable: true
  },
  {
    name: 'category',
    field: 'category',
    label: 'Category',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    field: 'status',
    label: 'Status',
    align: 'right',
    sortable: true
  }
])

async function onRequest (props: QTableRequestProps) {
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  loading.value = true

  const sorting: Record<string, 'asc' | 'desc'> = {}
  sorting[sortBy] = descending ? 'desc' : 'asc'
  try {
    const response = await listRepo.getList(page, filters, sorting, rowsPerPage)

    pagination.value.rowsNumber = response.totalItemCount

    rows.value.splice(0, rows.value.length, ...response.items)
  } catch (e) {
    console.error(e)
  } finally {
    // ...and turn of loading indicator
    loading.value = false
  }

  // don't forget to update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
}

const handleRowClick = (evt: PointerEvent, row: TaskLEInterface, index: number) => {
  router.push({
    name: 'task',
    params: {
      taskId: row.id
    }
  })
}

const toggleSelectionMode = () => {
  if (selectionMode.value === 'none') {
    selectionMode.value = 'multiple'
  } else {
    selectionMode.value = 'none'
  }
}
const selectedTasksLabel = computed(() => {
  if (selected.value.length === 1) {
    return '1 task selected'
  } else {
    return `${selected.value.length} tasks selected`
  }
})

const $q = useQuasar()
let bottomSheet: DialogChainObject | null = null
watch(selected, (val) => {
  if (val.length > 0) {
    onSelected()
  } else {
    bottomSheet?.hide()
  }
})

const onSelected = () => {
  if (bottomSheet) {
    bottomSheet.update({
      message: selectedTasksLabel.value
    })
    return
  }

  bottomSheet = $q.bottomSheet({
    message: selectedTasksLabel.value,
    seamless: true,
    actions: [
      {},
      {
        label: 'Change status',
        icon: 'sym_o_rebase_edit',
        id: 'chStatus'
      },
      {
        label: 'Cancel selection',
        id: 'cancel'
      }
    ]
  }).onOk(action => {
    bottomSheet = null
    if (action.id !== 'cancel') {
      onSelected()
    }

    switch (action.id) {
      case 'chStatus':
        onMassChangeStatusAttempt()
        break
      case 'cancel':
        selected.value = []
        break
    }
  }).onCancel(() => {
    bottomSheet = null
  })
}

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})

const onMassChangeStatusAttempt = () => {
  Dialog.create({
    message: 'Are you sure you want to change status for the all selected tasks?' +
      '<br /><br />' +
      'Please select a new status:',
    html: true,
    options: {
      type: 'radio',
      model: '',
      items: constants.TASK_STATUSES,
      isValid: val => val !== ''
    },
    cancel: 'No, I changed my mind',
    ok: {
      label: 'Confirm',
      color: 'negative'
    }
  }).onOk(async (status) => {
    loading.value = true
    const ids = selected.value.map((task: TaskLEInterface) => task.id)
    listRepo.massUpdate(ids, { status })
      .then(() => {
        tableRef.value.requestServerInteraction()
      })
      .catch((e) => {
        console.error(e)
      })
    selected.value = []
  })
}

/* tasksStore.$subscribe((mutation) => {
  if (mutation.type === 'direct' && mutation.storeId === 'tasks') {
    tableRef.value.requestServerInteraction()
  }
}) */



const downloadCsvItems = async () => {
  preparingToDownload.value = true
  try {
    const attachment = await listRepo.createTaskCsv()
    await download(attachment)
  } catch (e) {}
  preparingToDownload.value = false
}

const refresh = () => {
  tableRef.value.requestServerInteraction()
}

defineExpose({
  refresh
})
</script>

<style scoped lang="scss">
.q-field.col-grow :deep(.q-field__inner) {
  display: flex;
  flex-direction: row;

  & > .q-field__control {
    flex-grow: 1;
  }
}
</style>
