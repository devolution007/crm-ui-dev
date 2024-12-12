<template>
  <q-page
    v-if="facility"
    padding
  >
    <bricks-top-back-button
      :label="$t('facilities')"
      :to="{ name: 'facility-list' }"
    />
    <bricks-page-title>{{ facility.name }} (#{{ route.params.facilityId }})</bricks-page-title>
    <q-card
      flat
      class="q-mb-md"
    >
      <q-card-section>
        <b>{{ $t('address') }}</b>:
        <address-output
          v-if="facility.address"
          :entry="facility.address"
          :full="true"
        />
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <b>{{ $t('phone') }}:</b> {{ facility.address?.phone }}
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <b>{{ $t('manager') }}:</b> {{ facility.manager?.name }}
      </q-card-section>
      <q-card-actions align="around">
        <q-btn
          v-show="false"
          flat
        >
          {{ $t('add') }}  {{ $t('new') }}
        </q-btn>
        <q-btn
          :to="`/facilities/${route.params.facilityId}/edit`"
          dense
          :label="$t('edit')"
          color="secondary"
          text-color="primary"
          icon="edit_note"
        />
      </q-card-actions>
    </q-card>

    <q-tabs
      v-model="tab"
      align="left"
      class="q-mb-md bg-transparent"
    >
      <q-tab
        name="staff"
        icon="diversity_3"
        :label="$t('staff')"
      />
      <q-tab
        name="customers"
        icon="elderly"
        :label="$t('members')"
      />
      <q-tab
        name="communicationLog"
        icon="forum"
        :label="$t('communicationLog')"
      />
      <q-tab
        name="report"
        icon="summarize"
        :label="$t('report')"
      />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      class="bg-transparent"
    >
      <q-tab-panel
        name="staff"
        class="q-pa-none"
      >
        <facility-tabs-staff :facility="facility" />
      </q-tab-panel>
      <q-tab-panel
        name="customers"
        class="q-pa-none"
      >
        <facility-tabs-customers :facility="facility" />
      </q-tab-panel>
      <q-tab-panel
        name="communicationLog"
        class="q-pa-none"
      >
        <facility-tabs-communication-log :facility="facility" />
      </q-tab-panel>
      <q-tab-panel
        name="report"
        class="q-pa-none"
      >
        <facility-tabs-report :facility="facility" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import FacilityModel from 'src/models/facility/FacilityModel'
import FacilityApi from 'src/api/FacilityApi'
const facilityRepository: FacilityApi = new FacilityApi(api)
const route = useRoute()
const loading = ref<boolean>(false)
const tab = ref('staff')
const facility = ref<FacilityModel|null>(null)

const props = defineProps({
  facilityId: {
    type: Number,
    required: true
  },
  enterTab: {
    type: String,
    required: false,
    default: 'staff'
  }
})

const init = async (facilityId: number) => {
  loading.value = true
  facility.value = await facilityRepository.getFacility(facilityId)
  loading.value = false

  if (props.enterTab) {
    tab.value = props.enterTab
  }
}

onMounted(async () => {
  await init(props.facilityId)
})

watch(() => props.facilityId, async (value) => {
  if (value) {
    await init(value)
  }
})
</script>
