<script setup lang="ts">

import { useDialogPluginComponent } from 'quasar'
import { FacilityBasicInterface } from 'src/models/facility/FacilityModel'
import { useModalCardStyles } from 'src/composables/useModalCardStyles'

const props = defineProps<{
  facilities: FacilityBasicInterface[]
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
const { modalCardStyles } = useModalCardStyles('large', 'sm')

</script>

<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.md"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      :style="modalCardStyles"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ $t('associatedFacilities') }}
        </div>
        <q-space />
        <q-btn
          v-close-popup
          icon="sym_o_close"
          flat
          round
          dense
        />
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4" v-for="facility in props.facilities">

            <q-btn
              :to="{ name: 'facility-view', params: { facilityId: facility.id } }"
              color="secondary"
              flat
              size="md"
              no-caps
              class="text-no-wrap full-width"
            >
              <div class="flex no-wrap full-width ">
                <q-icon
                  name="business"
                  class="q-mr-sm"
                />
                <div class="full-width overflow-hidden text-left text-ellipsis ">
                  {{ facility.name }}
                </div>
              </div>
              <q-tooltip
                :delay="300"
                class="text-body2">
                {{ facility.name }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
