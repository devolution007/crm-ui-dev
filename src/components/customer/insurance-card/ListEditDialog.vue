<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.sm"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      :style="modalCardStyles"
    >
      <bricks-dialog-card-title>{{ $t('insuranceCards') }}</bricks-dialog-card-title>
      <q-card-section>
        <div class="q-pt-sm">
          <customer-insurance-cards-edit
            ref="insuranceCardsEdit"
            :customer="customer"
            @mounted="onEditorMounted"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import { useDialogPluginComponent } from 'quasar'
import { ref, Ref } from 'vue'
import CustomerModel from 'src/models/CustomerModel'
import { useModalCardStyles } from 'src/composables/useModalCardStyles'

const props = withDefaults(defineProps<{
  customer?: CustomerModel | null,
  callAdd?: boolean
}>(), {
  customer: null,
  callAdd: false
})

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

const insuranceCardsEdit: Ref<null | {
  initAddCard: () => void
}> = ref(null)

const { modalCardStyles } = useModalCardStyles('medium', 'sm')

const onEditorMounted = () => {
  if (props.callAdd) {
    insuranceCardsEdit.value?.initAddCard()
  }
}
</script>

<style scoped>

</style>
