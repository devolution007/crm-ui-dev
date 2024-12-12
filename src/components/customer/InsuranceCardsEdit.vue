<template>
  <div class="q-mb-md">
    <q-btn
      icon="sym_o_add"
      color="secondary"
      text-color="primary"
      :label="$t('addCard')"
      @click="initAddCard"
    />
  </div>

  <q-list v-if="! loading">
    <customer-insurance-card
      v-for="(card, key) in insuranceCards"
      :key="`card_${card.id}`"
      :card="card"
      :customer="props.customer"
      :index="key + 1"
      :detailed-view="true"
    />
  </q-list>
  <tools-list-skeleton v-else />

  <app-dialog
    v-model="editShown"
    title="Add Insurance card"
    min-width="400"
  >
    <customer-insurance-card-form
      ref="editInsuranceCardForm"
      @saved="afterCardSaved"
    />
    <template #primary-action>
      <q-btn
        color="primary"
        label="Save"
        :loading="$refs.editInsuranceCardForm?.loading"
        :disable="! $refs.editInsuranceCardForm?.isFormReady"
        @click="$refs.editInsuranceCardForm?.submit"
      />
    </template>
  </app-dialog>
</template>
<script setup lang="ts">
import CustomerModel from 'src/models/CustomerModel'

import { useInsuranceCardsStore } from 'stores/insurance-cards-store'
import { computed, onMounted, Ref, ref } from 'vue'
import { QForm, useQuasar } from 'quasar'
import useCardChecker from 'src/composables/useCardChecker'

const $q = useQuasar()

const props = withDefaults(defineProps<{
  customer: CustomerModel,
  editModalShown?: boolean
}>(), {
  editModalShown: false
})

const emit = defineEmits(['mounted'])

interface InsuranceCardFormType extends QForm {
  loading: boolean,
  isFormReady: boolean
}

const cardsStore = useInsuranceCardsStore()
const insuranceCards = computed(() => cardsStore.insuranceCards)
const loading = computed(() => cardsStore.loading)
const editShown = ref(false)
const editInsuranceCardForm = <Ref<InsuranceCardFormType | null>> ref(null)

const initAddCard = () => {
  editShown.value = true
}

const { reset: resetLastCheckedCard } = useCardChecker()

const afterCardSaved = () => {
  editShown.value = false
  $q.notify('Card saved')
  resetLastCheckedCard()
}

defineExpose({
  initAddCard
})

onMounted(() => {
  emit('mounted')
})

</script>
