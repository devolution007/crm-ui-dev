<template>
  <q-page padding>
    <bricks-page-title>{{ $t('associations') }}</bricks-page-title>
    <q-banner class="bg-primary text-white q-mb-md shadow-1">
      {{ $t('associationNotice') }}
    </q-banner>
    <q-table
      binary-state-sort
      style="height: 800px"
      :rows-per-page-options="[0]"
      :rows="profileFacilities"
      hide-pagination
      :loading="loading"
      :columns="columns"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-spinner v-if="facilitiesLoading" />
          <facility-association-form
            v-else
            :profile-facility-id="props.row.id"
            :name="props.row.name"
            :facilities-loading="facilitiesLoading"
            :facilities="facilities"
            :facility-filter="facilityFilter"
            @saved="loadProfileFacilities"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from 'boot/axios'
import FacilityApi from 'src/api/FacilityApi'
import { useI18n } from 'vue-i18n'
import { useMeta } from 'quasar'
import FacilityModel from 'src/models/facility/FacilityModel'
import { FacilityFilter, SortBy } from 'src/types'
const { t } = useI18n()
const facilityRepository: FacilityApi = new FacilityApi(api)
import { useFacilitiesList } from 'src/composables/useFacilitiesList'
const { facilities, facilitiesLoading, facilityFilter } = useFacilitiesList()
const columns = computed(() => [
  {
    name: 'name',
    required: true,
    label: t('facilityName'),
    align: 'left',
    field: (row: FacilityModel) => row.name,
    sortable: false
  },
  {
    field: 'actions',
    name: 'actions',
    label: t('actions')
  }
])
const filterBy = ref<FacilityFilter>({
  verified: false
})
const sortBy = ref<SortBy[]>([{ name: 'asc' }])
const loading = ref<boolean>(false)
const profileFacilities = ref<FacilityModel[]>([])

async function loadProfileFacilities () {
  loading.value = true
  const { items } = await facilityRepository.getProfileFacilities(filterBy.value, sortBy.value)
  profileFacilities.value = items
  loading.value = false
}

useMeta({
  title: 'Associations'
})

onMounted(async () => {
  await loadProfileFacilities()
})

</script>
