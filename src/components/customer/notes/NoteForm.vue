<template>
  <q-form
    ref="form"
    autocomplete="off"
    @submit.prevent="submit"
  >
    <q-input
      v-model="note.text"
      label="Note"
      type="textarea"
      :rules="[val => !!val || 'Note is required']"
      :error="!!serverErrors.text"
      :error-message="serverErrors.text"
    />
    <q-btn
      v-show="props.showSubmit"
      type="submit"
      color="primary"
      :label="$t('save')"
      :loading="loading"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { QForm } from 'quasar'
import { useCustomerStore } from 'stores/customer-store'
import useServerErrors2 from 'src/composables/useServerErrors2'

const props = withDefaults(defineProps<{
  customerId: number,
  showSubmit?: boolean
}>(), {
  showSubmit: true
})

const emit = defineEmits(['saved'])

const form: Ref<QForm | null> = ref(null)
const loading = ref(false)
const note = ref({
  text: ''
})
const cStore = useCustomerStore()
cStore.init(props.customerId)

const {
  serverErrors,
  catchValidationErrors,
  resetServerErrors
} = useServerErrors2({
  text: ''
})

const submit = async () => {
  loading.value = true
  resetServerErrors()
  try {
    const noteAdded = await cStore.addNote({
      text: note.value.text
    })
    emit('saved', noteAdded)
  } catch (e) {
    catchValidationErrors(e)
  }
  loading.value = false
}

defineExpose({
  submit,
  loading
})
</script>

<style scoped>

</style>
