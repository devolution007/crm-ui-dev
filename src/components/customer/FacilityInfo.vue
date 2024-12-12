<template>
  <q-item dense>
    <q-item-section>
      <q-item-label>
        <q-btn
          dense
          no-caps
          unelevated
          :to="{ name: 'facility-view', params: { facilityId: props.facility.id } }"
          text-color="text-toner"
          class="q-mb-sm text-weight-bold"
        >
          <span class="block text-left">
            {{ props.facility.name }}
          </span>
        </q-btn>
        <address-output
          v-if="props.facility.address"
          :entry="props.facility.address"
        />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import FacilityModel from 'src/models/facility/FacilityModel'

const props = defineProps<{
  facility: FacilityModel
}>()
</script>
