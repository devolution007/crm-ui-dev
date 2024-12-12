<template>
  <q-popup-edit
    v-slot="scope"
    ref="popupEdit"
    :model-value="props.modelValue"
    persistent
    :cover="false"
    label-set="Save"
    :validate="validate"
    @before-show="beforeShow"
  >
    <q-input
      v-model="scope.value"
      :type="props.inputType"
      autofocus
      counter
      :error="props.error"
      :error-message="props.errorMessage"
      @keyup.enter.stop
    />
    <div class="row justify-center no-wrap q-mt-md">
      <q-btn
        flat
        :label="$t('cancel')"
        @click.stop.prevent="scope.cancel"
      />

      <q-btn
        class="q-ml-md"
        flat
        :label="$t('save')"
        :loading="saving"
        @click.stop.prevent="scope.set"
      />
    </div>
  </q-popup-edit>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { QPopupEdit } from 'quasar'
import { InputFieldType } from 'src/types/quasar-add'

const props = withDefaults(defineProps<{
  modelValue?: string,
  save:(value: string) => Promise<unknown>,
  error?: boolean,
  errorMessage?: string,
  inputType?: InputFieldType
}>(), {
  modelValue: '',
  error: false,
  errorMessage: '',
  inputType: 'text'
})

const properlySaved = ref(false)
const popupEdit = ref<QPopupEdit>()
const saving = ref(false)

const beforeShow = () => {
  properlySaved.value = false
}

/**
 * There is a little hack here. We need to keep the popup open until the server confirms that the note was saved.
 * (to prevent from accidentally closing the popup and losing the note when the server is returning an error)
 */
const validate = (value: string) => {
  if (properlySaved.value) {
    return true
  }

  saving.value = true
  props.save(value)
    .then(() => {
      properlySaved.value = true
      popupEdit.value?.set()
    })
    .finally(() => {
      saving.value = false
    })

  return properlySaved.value
}

</script>
<style scoped>

</style>
