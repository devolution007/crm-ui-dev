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
      <bricks-dialog-card-title>{{ $t('addNote') }}</bricks-dialog-card-title>
      <q-card-section>
        <customer-notes-note-form
          ref="form"
          :customer-id="props.customerId"
          :show-submit="false"
          @saved="onDialogOK"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Save"
          :loading="$refs.form?.loading"
          @click="$refs.form?.submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import { useDialogPluginComponent } from 'quasar'
import { useModalCardStyles } from 'src/composables/useModalCardStyles'
import { ref } from 'vue'

const props = defineProps<{
  customerId: number,
}>()

const form = ref(null)

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const { modalCardStyles } = useModalCardStyles('medium', 'sm')
</script>

<style scoped>

</style>
