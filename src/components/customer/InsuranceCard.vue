<template>
  <q-item>
    <q-item-section
      v-if="props.index"
      side
      top
    >
      <q-icon
        v-if="card.active"
        name="sym_o_credit_score"
        color="primary"
      >
        <q-tooltip
          class="text-body2"
        >
          {{ $t('activeCardUsedForPayments') }}
        </q-tooltip>
      </q-icon>
      <q-icon
        v-if="card.status === -1"
        name="sym_o_credit_card_off"
        color="negative"
      >
        <q-tooltip
          class="text-body2"
        >
          {{ $t('cardIsExpired') }}
        </q-tooltip>
      </q-icon>
      <q-icon
        v-if="! card.active && card.status !== -1"
        name="sym_o_credit_card_off"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        {{ cardNumberView }}
      </q-item-label>
      <q-item-label
        v-if="card.promoName"
        :caption="! props.detailedView"
      >
        {{ card.promoName }}
      </q-item-label>
      <q-item-label
        v-if="props.detailedView && card.balanceRenewalPeriod"
        caption
      >
        Benefit period: {{ card.balanceRenewalPeriod }}
      </q-item-label>
      <q-item-label
        v-if="props.detailedView && card.balanceRollsOver"
        caption
      >
        Rollover: {{ card.balanceRollsOver }}
      </q-item-label>
    </q-item-section>
    <q-item-section
      v-if="stepControl === 1"
      side
    >
      <q-item-label>
        <q-btn
          size="md"
          :label="requestInfoBtnName"
          :loading="loading"
          @click="requestCardInfo"
        />
      </q-item-label>
    </q-item-section>
    <q-item-section
      v-if="stepControl === 2"
      side
    >
      <q-item-label style="max-width: 114px">
        <q-input
          v-model="cvv"
          dense
          hint="CVV"
          type="text"
          maxlength="4"
          :disable="loading"
          mask="####"
          autofocus
          @keyup.enter="requestCardInfo"
        >
          <template #append>
            <q-btn
              round
              dense
              flat
              icon="send"
              size="md"
              :loading="loading"
              @click="requestCardInfo"
            />
          </template>
        </q-input>
      </q-item-label>
    </q-item-section>
    <q-item-section
      v-if="stepControl === 3"
      side
    >
      <q-item-label>
        <q-btn
          :loading="loading"
          size="md"
          :label="balanceFormatted"
          icon-right="refresh"
          @click="requestCardInfo"
        />
      </q-item-label>
    </q-item-section>
    <q-item-section
      v-if="props.detailedView"
      side
    >
      <q-btn
        icon="more_vert"
        round
        size="md"
        :loading="loadingEdit"
      >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item
              v-if="!card.active"
              v-close-popup
              clickable
              @click="changeCardActivity(true)"
            >
              <q-item-section>{{ $t('makeActive') }}</q-item-section>
            </q-item>
            <q-item
              v-if="card.active"
              v-close-popup
              clickable
              @click="changeCardActivity(false)"
            >
              <q-item-section>{{ $t('makeInactive') }}</q-item-section>
            </q-item>
            <q-item
              clickable
              :disable="card.active"
            >
              <q-item-section>{{ $t('delete') }}</q-item-section>
              <q-menu
                v-if="! card.active"
                anchor="center middle"
                self="center middle"
              >
                <q-list style="min-width: 100px">
                  <q-item
                    v-close-popup
                    :active="true"
                    active-class="text-white bg-red-7"
                    clickable
                    @click="deleteEntry"
                  >
                    <q-item-section>{{ $t('areYouSureClickHereToConfirm') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
import CustomerModel from 'src/models/CustomerModel'

import { InsuranceCardModel } from 'src/models/InsuranceCardModel'
import { computed, ref } from 'vue'
import { useInsuranceCardsStore } from 'stores/insurance-cards-store'
import { AxiosError } from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = withDefaults(defineProps<{
  customer: CustomerModel,
  card: InsuranceCardModel,
  index: number | string | boolean,
  detailedView?: boolean
}>(), {
  index: false,
  detailedView: false
})

const cardsStore = useInsuranceCardsStore()

const needCvv = false // !!! Change this to true if you need to request CVV
const cvv = ref('')
const loading = ref(false)
const loadingEdit = ref(false)

const step = ref(1)
const stepControl = computed(() => {
  if (step.value === 1 && props.card.balance > 0) {
    return 3
  }
  return step.value
})

const balanceFormatted = computed(() => {
  return `$${props.card.balance}`
})

const cardNumberView = computed(() => {
  if (props.detailedView) {
    return props.card.maskedNumber
  }
  return props.card.maskedNumber.slice(-7)
})

const requestInfoBtnName = computed(() => {
  if (props.card.status === -1) {
    return 'Refresh'
  }
  return 'Load balance'
})

const requestCardInfo = async () => {
  if (step.value === 1 && needCvv) {
    step.value = 2
    return
  }
  loading.value = true
  await cardsStore.getCardInfo(props.card, cvv.value)
    .finally(() => {
      loading.value = false
    })

  step.value = 3
}

const deleteEntry = async () => {
  loadingEdit.value = true
  try {
    await cardsStore.deleteCard(props.card)
  } catch (e) {
    const error = e as AxiosError
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error deleting card'
    })
  } finally {
    loadingEdit.value = false
  }
}

const changeCardActivity = async (updatedValue: boolean) => {
  loadingEdit.value = true
  try {
    if (updatedValue) {
      await cardsStore.activateCard(props.card)
    } else {
      await cardsStore.deactivateCard(props.card)
    }
  } catch (e) {
    const error = e as AxiosError
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error activating card'
    })
  } finally {
    loadingEdit.value = false
  }
}
</script>
