<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMeta } from 'quasar'
import useDynamicRouteImportFailed from 'src/composables/useDynamicRouteImportFailed'
import { onMounted } from 'vue'

useMeta({
  titleTemplate: title => `${title} - OTCStores CRM`
})

const { bind: bindRouterFailure } = useDynamicRouteImportFailed()

onMounted(() => {
  bindRouterFailure()
})
</script>
