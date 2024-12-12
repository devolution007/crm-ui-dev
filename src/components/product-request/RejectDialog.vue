<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.md"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
    >
      <q-form
        ref="form"
        @submit.prevent="submit"
      >
        <bricks-dialog-card-title>
          {{ $t('rejectProductRequest') }}
        </bricks-dialog-card-title>
        <q-card-section>
          <div class="q-pt-sm">
            <q-input
              outlined
              :model-value="props.requestId"
              :label="$t('id')"
              readonly
              class="q-mb-md"
              :error-message="serverErrors.id"
              :error="!!serverErrors.id"
            />
            <q-input
              v-model="comment"
              outlined
              type="textarea"
              :rules="[(v) => !!v || 'Field is required']"
              :label="$t('comment')"
              class="q-mb-md"
              :error-message="serverErrors.comment"
              :error="!!serverErrors.comment"
            />
          </div>
        </q-card-section>
        <q-card-actions align="between">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="onDialogCancel"
          />
          <q-btn
            color="primary"
            type="submit"
            class="float-right"
            :loading="submitting"
            :label="$t('save')"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import { useDialogPluginComponent } from 'quasar'
import useServerErrors2 from 'src/composables/useServerErrors2'
import { ref } from 'vue'
import { api } from 'boot/axios'
import ProductRequestApi from 'src/api/ProductRequestApi'

const props = defineProps<{
  requestId: number
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const {
  serverErrors,
  catchValidationErrors,
  resetServerErrors
} = useServerErrors2({
  id: '',
  comment: ''
})

const submitting = ref(false)
const comment = ref('')

const repository: ProductRequestApi = new ProductRequestApi(api)

const submit = async () => {
  resetServerErrors()
  submitting.value = true

  try {
    await repository.reject(props.requestId, comment.value)
    onDialogOK()
  } catch (err) {
    catchValidationErrors(err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>

</style>
