<template>
  <q-list v-if="! loading">
    <customer-insurance-card
      v-for="(card, key) in insuranceCards"
      :key="`card_${card.id}`"
      :card="card"
      :customer="props.customer"
      :index="key + 1"
    />
  </q-list>
  <tools-list-skeleton v-else />
</template>
<script setup lang="ts">
import CustomerModel from 'src/models/CustomerModel'

import { useInsuranceCardsStore } from 'stores/insurance-cards-store'
import { computed } from 'vue'

const props = defineProps<{
  customer: CustomerModel
}>()

const cardsStore = useInsuranceCardsStore()
const insuranceCards = computed(() => cardsStore.insuranceCards)
const loading = computed(() => cardsStore.loading)
</script>
