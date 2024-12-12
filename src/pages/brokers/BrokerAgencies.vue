<script setup lang="ts">
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

useMeta({
  title: t('brokerAgencies')
})
</script>

<template>
  <q-page padding>
    <bricks-page-title>
      {{ $t('brokerAgencies') }}
    </bricks-page-title>
    <brokers-broker-agencies-list />
  </q-page>
</template>

<style scoped>

</style>
