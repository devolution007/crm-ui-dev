<template>
  <q-form
    ref="form"
    autocomplete="off"
    @submit.prevent="submit"
  >
    <customer-insurance-card-validation-form
      auto-submit
      input-class="q-mb-md"
      :card-number-error="!!serverErrors.cardNumber"
      :card-number-error-message="serverErrors.cardNumber"
      :cvv-error="!!serverErrors.cvv"
      :cvv-error-message="serverErrors.cvv"
      @check-success="onCardCheckSuccess"
      @update:model-number="serverErrors.cardNumber = ''"
      @update:model-cvv="serverErrors.cvv = ''"
    />

    <q-input
      v-model="mutableEntity.benefitName"
      :error="!!serverErrors.benefitName"
      :error-message="serverErrors.benefitName"
      label="Benefit name"
      class="q-mb-md"
      hint="Type in your benefit name as written on the S3 card"
    />

    <q-select
      v-model="mutableEntity.balanceRenewalPeriod"
      :options="balanceRenewalPeriods"
      :error="!!serverErrors.balanceRenewalPeriod"
      :error-message="serverErrors.balanceRenewalPeriod"
      label="Balance renewal period"
      class="q-mb-md"
      hint="Specify your balance renewal period"
    />

    <q-select
      v-model="mutableEntity.phcOrganizationId"
      :error="!!serverErrors.phcOrganizationId"
      :error-message="serverErrors.phcOrganizationId"
      label="Insurance organization"
      :options="phcOrganizations"
      :loading="phcOrganizationsLoading"
      map-options
      emit-value
      option-value="id"
      option-label="name"
      class="q-mb-md"
    />

    <p>My unused balance amounts roll over to the next period</p>
    <q-field
      :error="!!serverErrors.balanceRollsOver"
      :error-message="serverErrors.balanceRollsOver"
    >
      <q-radio
        v-model="mutableEntity.balanceRollsOver"
        val="Yes"
        label="Yes"
        class="q-mb-md"
      />
      <q-radio
        v-model="mutableEntity.balanceRollsOver"
        val="NO"
        label="No"
        class="q-mb-md"
      />
      <q-radio
        v-model="mutableEntity.balanceRollsOver"
        val="I don't know"
        label="I don't know"
        class="q-mb-md"
      />
    </q-field>
  </q-form>
</template>

<script setup lang="ts">

import { InsuranceCardDto, InsuranceCardInfoModel, InsuranceCardModel } from 'src/models/InsuranceCardModel'
import { computed, onMounted, Ref, ref } from 'vue'
import { ErrorContainer } from 'src/types/classes'
import usePhcOrganizations from 'src/composables/usePhcOrganizations'
import { QForm, QInput, useQuasar } from 'quasar'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import { useInsuranceCardsStore } from 'stores/insurance-cards-store'
import useCardChecker from 'src/composables/useCardChecker'

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'saved', entity: InsuranceCardModel): void
}>()

const props = withDefaults(defineProps<{
  loading?: boolean
}>(), {
  loading: false
})
const $q = useQuasar()

class IErr extends ErrorContainer {
  balanceRenewalPeriod = null
  balanceRollsOver = null
  number = null
  phcOrganizationId = null
  benefitName = null
}

const cardChecker = useCardChecker()

const serverErrors = <Ref<IErr>>ref(new ErrorContainer())

const mutableEntity: Ref<InsuranceCardDto> = ref(new InsuranceCardDto())
const loading = ref(false)
const balanceRenewalPeriods = ['Monthly', 'Quarterly', 'Semiannually']
const { phcOrganizations, loading: phcOrganizationsLoading } = usePhcOrganizations()
const cardsStore = useInsuranceCardsStore()

interface ICardFormInterface extends QForm {
  loading: boolean
}
const form = <Ref<ICardFormInterface>> ref()

const submit = async () => {
  if (!await form.value.validate()) {
    return
  }

  serverErrors.value = new IErr()

  loading.value = true
  try {
    const cardAdded = await cardsStore.addCard(mutableEntity.value)
    emit('saved', cardAdded)
  } catch (error: AxiosError | any) {
    if (error.response && error.response.data && error.response.status === 422) {
      serverErrors.value = Object.assign(new IErr(), helper.getFirstErrors(error.response.data))
      $q.notify('Validation error')
    }
  }
  loading.value = false
}

const isFormReady = computed(() => {
  return !!mutableEntity.value.cardNumber && !!mutableEntity.value.cvv
})

const onCardCheckSuccess = (cardInfo: InsuranceCardInfoModel, cardNumber: string, cvv: string) => {
  mutableEntity.value.cardNumber = cardNumber
  mutableEntity.value.cvv = cvv
}

onMounted(() => {
  if (cardChecker.lastResult.value) {
    mutableEntity.value.cardNumber = cardChecker.cardNumber.value
    mutableEntity.value.cvv = cardChecker.cvv.value
  }
})

defineExpose({
  loading,
  isFormReady,
  submit
})
</script>
