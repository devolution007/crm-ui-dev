<template>
  <q-input
    ref="cardNumberInput"
    v-model="cardNumber"
    :class="props.inputClass"
    label="Card number"
    :error="!!serverErrors.cardNumber || props.cardNumberError"
    :error-message="cardNumberServerErrorComputed"
    mask="####-####-####-#####"
    :unmasked-value="true"
    :rules="cardNumberRules"
    lazy-rules
    :loading="isLoading"
    :hint="cardSuccessHint || 'Enter 16- or 17-digit card number'"
    data-1p-ignore
    data-cy="card-number-input"
    @update:model-value="numberInput"
    @focus="resetServerErrors"
  />

  <q-input
    ref="cardCvvInput"
    v-model="cvv"
    :class="props.inputClass"
    label="Security code"
    :error="!!serverErrors.cvv || props.cvvError"
    :error-message="cvvServerErrorComputed"
    hint="Enter 3- or 4-digit security code"
    mask="####"
    :unmasked-value="true"
    :rules="cvvRules"
    lazy-rules
    data-1p-ignore
    data-cy="card-cvv-input"
    @update:model-value="cvvInput"
    @focus="resetServerErrors"
  />

  <slot
    v-if="props.showSubmit"
    name="primary"
  >
    <q-btn
      :label="props.submitLabel"
      :color="props.submitColor"
      :loading="isLoading"
      @click="submit"
    />
  </slot>
  <slot name="extra-fields" />
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, toRaw, watch } from 'vue'
import { ErrorContainer } from 'src/types/classes'
import { helper } from 'boot/helper'
import { QForm, QInput } from 'quasar'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import useCardChecker from 'src/composables/useCardChecker'
const { t } = useI18n()

const {
  cardNumber, cvv, check
} = useCardChecker()
const isLoading = ref(false)
const cardNumberInput = <Ref<QInput | null>> ref(null)
const cardCvvInput = <Ref<QInput | null>> ref(null)
const cardSuccessHint = ref('')

class IErr extends ErrorContainer {
  cardNumber = null
  cvv = null
}
const serverErrors = <Ref<IErr>>ref(new ErrorContainer())

const props = withDefaults(defineProps<{
  loading?: boolean,
  inputClass?: string,
  submitLabel?: string,
  submitColor?: string,
  showSubmit?: boolean,
  modelNumber?: string,
  modelCvv?: string,
  autoSubmit?: boolean,
  cardNumberError?: boolean,
  cardNumberErrorMessage?: string,
  cvvError?: boolean,
  cvvErrorMessage?: string,
}>(), {
  loading: false,
  inputClass: '',
  submitLabel: 'Continue',
  submitColor: 'primary',
  showSubmit: false,
  modelNumber: '',
  modelCvv: '',
  autoSubmit: false,
  cardNumberError: false,
  cardNumberErrorMessage: '',
  cvvError: false,
  cvvErrorMessage: ''
})

const emit = defineEmits([
  'check-result', 'check-success', 'check-failure', 'input-filled', 'input-filled-values', 'loading-start', 'loading-end',
  'update:modelNumber', 'update:modelCvv'
])

const cardNumberRules = [
  (v: string) => !!v || 'Card number is required',
  (v: string) => [16, 17].includes(v.length) || 'Card number must be 16 or 17 digits',
  (v: string) => /^\d+$/.test(v) || 'Card number must be numeric'
]

const cvvRules = [
  (v: string) => [0, 3, 4].includes(v.length) || 'Security code must be 3 or 4 digits',
  (v: string) => (/^\d+$/.test(v) || v === '') || 'Security code must be numeric'
]

const initValues = () => {
  if (props.modelNumber) {
    cardNumber.value = toRaw(props.modelNumber)
  }
  if (props.modelCvv) {
    cvv.value = toRaw(props.modelCvv)
  }
}
onMounted(() => {
  initValues()
})

const numberInput = (v: string) => {
  emit('update:modelNumber', v)

  if (isValidAndFilled.value) {
    if (props.autoSubmit) {
      submit()
    }
  }
}
const cvvInput = (v: string) => {
  emit('update:modelCvv', v)

  if (isValidAndFilled.value) {
    if (props.autoSubmit) {
      submit()
    }
  }
}

const isValidAndFilled = computed(() => {
  return cardNumber.value !== '' && cvv.value !== '' &&
    cardNumber.value.length === 17 && cvv.value.length === 4 &&
    cardNumberInput.value?.validate() && cardCvvInput.value?.validate()
})

const submit = async () => {
  if (isLoading.value) {
    return
  }
  isLoading.value = true
  emit('loading-start')
  try {
    const result = await check()
    emit('check-result', result)
    emit('check-success', result, cardNumber.value, cvv.value)
    cardSuccessHint.value = `Balance: $${result.balance}`
  } catch (error: AxiosError | unknown) {
    emit('check-result', null)
    if (axios.isAxiosError(error) && error?.response?.status === 422) {
      serverErrors.value = Object.assign(new IErr(), helper.getFirstErrors(error.response.data))
      emit('check-failure', error, serverErrors.value)
    }
  } finally {
    isLoading.value = false
    emit('loading-end')
  }
}

watch(isValidAndFilled, (status) => {
  emit('input-filled', status)

  if (status) {
    emit('input-filled-values', cardNumber.value, cvv.value)

    if (props.autoSubmit) {
      submit()
    }
  }
})

const cardNumberServerErrorComputed = computed(() => {
  if (props.cardNumberErrorMessage && props.cardNumberError) {
    return t(props.cardNumberErrorMessage)
  }
  if (!serverErrors.value.cardNumber) {
    return ''
  }
  return t(serverErrors.value.cardNumber as string)
})

const cvvServerErrorComputed = computed(() => {
  if (props.cvvErrorMessage && props.cvvError) {
    return props.cvvErrorMessage
  }
  if (!serverErrors.value.cvv) {
    return ''
  }
  return t(serverErrors.value.cvv as string)
})

const resetServerErrors = () => {
  serverErrors.value = new IErr()
  cardSuccessHint.value = ''
}

export interface CardValidationForm extends QForm {
  submit: () => void
  isLoading: boolean
}

defineExpose({
  submit,
  isLoading
})

</script>
