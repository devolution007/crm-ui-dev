<template>
  <q-page padding>
    <bricks-page-title>{{ $t('staffList') }}</bricks-page-title>
    <staff-list-table />
  </q-page>
</template>
<script setup lang="ts">
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

useMeta({
  title: t('staffList')
})
</script>
