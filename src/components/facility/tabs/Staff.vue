<template>
  <staff-list-table :key="`facilityStaff${props.facility.id}`" :facility-id="props.facility.id" />
</template>
<script setup lang="ts">
import { FacilityBasicInterface } from 'src/models/facility/FacilityModel'

const props = defineProps<{
  facility: FacilityBasicInterface
}>()
</script>
