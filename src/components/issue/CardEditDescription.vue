<template>
  <q-popup-edit
    v-if="!issueStore.loading"
    v-slot="scope"
    ref="popupEdit"
    :model-value="issueStore?.issue?.todo"
    buttons
    persistent
    :cover="false"
    label-set="Save"
    :validate="validate"
    @before-show="beforeShow"
  >
    <q-input
      v-model="scope.value"
      style="min-width: 300px"
      type="textarea"
      :rules="[val => (val && val.length <= 160) || 'Max 160 characters']"
      autofocus
      counter
      :error="!!serverErrors.todo"
      :error-message="serverErrors.todo"
      @keyup.enter.stop
    />
  </q-popup-edit>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios'
import { ref } from 'vue'
import { Notify, QPopupEdit } from 'quasar'
import { useIssueStore } from 'stores/issue-store'
import useServerErrors2 from 'src/composables/useServerErrors2'

const props = defineProps<{
  issueId: number
}>()

const emit = defineEmits<{
  (event: 'saved'): void
}>()

const issueStore = useIssueStore()
issueStore.loadIssue(props.issueId, true)

const properlySaved = ref(false)

const popupEdit = ref<QPopupEdit>()

const beforeShow = () => {
  properlySaved.value = false
  resetServerErrors()
}

const { catchValidationErrors, resetServerErrors, serverErrors } = useServerErrors2({
  todo: ''
})

/**
 * There is a little hack here. We need to keep the popup open until the server confirms that the note was saved.
 * (to prevent from accidentally closing the popup and losing the note when the server is returning an error)
 */
const validate = (value: string) => {
  if (properlySaved.value) {
    return true
  }

  save(value)
    .then(() => {
      properlySaved.value = true
      popupEdit.value?.set()

      emit('saved')
    })

  return properlySaved.value
}

const save = async (value: string) => {
  resetServerErrors()
  try {
    await issueStore.updateFields({
      todo: value
    })
  } catch (error: unknown) {
    catchValidationErrors(error)
    const axiosError = error as AxiosError
    if (axiosError.response && axiosError.response.data && axiosError.response.status === 422) {
      Notify.create('Validation error')
    }
    throw error
  }
}
</script>
