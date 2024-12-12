<template>
  <q-table
    v-model:pagination="pagination"
    flat
    :title="$t('storedQueries')"
    style="height: 800px"
    :rows="mutableQueries"
    :columns="columns"
    :filter="filter"
  >
    <template #top-right>
      <q-input
        v-model="filter"
        borderless
        dense
        debounce="300"
        :placeholder="$t('search')"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #body-cell-action="props">
      <q-td :props="props">
        <q-btn
          icon="delete"
          :title="$t('delete')"
          color="negative"
          dense
          rounded
          flat
          size="12px"
          @click="deleteQuery(props.row.id)"
        />

        <q-btn
          icon="edit"
          :title="$t('edit')"
          color="positive"
          dense
          rounded
          flat
          size="12px"
          @click="emit('editQuery', props.row.query, props.row.name, props.row.id)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import TargetListModel from 'src/models/TargetListModel'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import TargetListApi from 'src/api/TargetListApi'
import { api } from 'boot/axios'

const targetListRepository: TargetListApi = new TargetListApi(api)
const { t } = useI18n()

const pagination = ref({
  rowsPerPage: 25
})
const columns = computed(() => [
  {
    name: 'id',
    required: true,
    label: t('id'),
    align: 'left',
    field: (row: TargetListModel) => row.id,
    sortable: false
  },
  {
    name: 'name',
    required: true,
    label: t('name'),
    align: 'left',
    field: (row: TargetListModel) => row.name,
    sortable: false
  },
  {
    name: 'member',
    required: true,
    label: t('operator'),
    align: 'left',
    field: (row: TargetListModel) => row.member.name,
    sortable: false
  },
  {
    name: 'action',
    required: true,
    label: t('action'),
    align: 'left',
    sortable: false
  }
])
const filter = ref('')
const params = defineProps<{
  modelValue: TargetListModel[]
}>()

const mutableQueries = ref<TargetListModel[]>(params.modelValue)
const emit = defineEmits(['editQuery'])
function deleteQuery (id: number) {
  targetListRepository.remove(id)
  mutableQueries.value = mutableQueries.value.filter((item:TargetListModel) => item.id !== id)
}
watch(() => params.modelValue, value => {
  mutableQueries.value = value
})
</script>
