<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('brokers') }}
    </bricks-page-title>
    <brokers-brokers-list
      :broker-agency="brokerAgency"
      :status="status"
    />
  </q-page>
</template>

<script setup lang="ts">

import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useMeta({
  title: t('brokers')
})

defineProps({
  brokerAgency: {
    type: Number,
    required: false,
    default: undefined
  },
  status: {
    type: Number,
    required: false,
    default: undefined
  }
})

</script>

<style scoped>

</style>
