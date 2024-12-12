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
          {{ $t('createProductRequest') }}
        </bricks-dialog-card-title>
        <q-card-section>
          <q-input
            v-model="productName"
            :rules="[(v) => !!v || 'Field is required']"
            :label="$t('productName')"
            :error-message="serverErrors.productName"
            :error="!!serverErrors.productName"
          />
          <q-input
            v-model="description"
            type="textarea"
            :label="$t('description')"
            :error-message="serverErrors.description"
            :error="!!serverErrors.description"
          />
          <q-input
            v-model="link"
            hint="https://example.com"
            :error-message="serverErrors.link"
            :error="!!serverErrors.link"
            :label="$t('link')"
          />
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

import { EventBus, useDialogPluginComponent } from 'quasar'
import useServerErrors2 from 'src/composables/useServerErrors2'
import { inject, ref } from 'vue'
import { api } from 'boot/axios'
import ProductRequestApi from 'src/api/ProductRequestApi'
import BUS_EVENT from 'src/types/bus-events'

const props = defineProps<{
  customerId: number
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const bus = inject('bus') as EventBus

const {
  serverErrors,
  catchValidationErrors,
  resetServerErrors
} = useServerErrors2({
  productName: '',
  description: '',
  link: ''
})

const productName = ref('')
const description = ref('')
const link = ref('')

const submitting = ref(false)

const repository: ProductRequestApi = new ProductRequestApi(api)

const submit = async () => {
  resetServerErrors()
  submitting.value = true

  try {
    const item = await repository.create({
      customerId: props.customerId,
      productName: productName.value,
      description: description.value,
      link: link.value
    })
    bus.emit(BUS_EVENT.PRODUCT_REQUEST_CREATED, item)
    onDialogOK(item)
  } catch (err) {
    catchValidationErrors(err)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>

</style>
