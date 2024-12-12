<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductApi from 'src/api/ProductApi'
import { api } from 'boot/axios'
import axios from 'axios'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const catalogRepo = new ProductApi(api)

const loadSyncInfo = async () => {
  pending.value = true
  try {
    const info = await catalogRepo.getSyncInfo()
    lastSync.value = info.lastSync
    if (!info.inProgress && inProgress.value) {
      $q.notify('Sync finished')
    }
    inProgress.value = info.inProgress
    ready.value = true
  } finally {
    pending.value = false
  }
}

const startSync = async () => {
  pending.value = true
  try {
    const data = await catalogRepo.syncCatalog()
    if (data.status === 'ok') {
      inProgress.value = true
      runProgressCheckTimer()
    }
  } catch (e: unknown | AxiosError) {
    $q.notify('Failed to start sync')
    if (axios.isAxiosError(e)) {
      const serverErrors = helper.getFirstErrors(e.response?.data || {}) as { [key: string]: string }
      if (serverErrors.general) {
        $q.notify({
          message: serverErrors.general,
          color: 'negative'
        })
      }
    }
  } finally {
    pending.value = false
  }
}

const ready = ref(false)
const pending = ref(false)
const lastSync = ref<string | null>(null)
const inProgress = ref(false)

const runProgressCheckTimer = () => {
  setTimeout(async () => {
    if (inProgress.value) {
      await loadSyncInfo()
      runProgressCheckTimer()
    }
  }, 10000)
}

onMounted(() => {
  loadSyncInfo().then(() => {
    runProgressCheckTimer()
  })
})
</script>

<template>
  <q-page padding>
    <bricks-page-title>{{ $t('catalogSync') }}</bricks-page-title>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8 col-lg-5">
        <q-card>
          <q-card-section>
            <div v-if="ready">
              <div
                v-if="lastSync"
                class="q-mb-lg"
              >
                Last catalog sync: {{ $helper.dateEst(lastSync) }} (EST)
              </div>
              <q-btn
                v-if="!inProgress"
                color="primary"
                label="Start sync"
                :loading="pending"
                @click="startSync"
              />
              <div v-if="inProgress">
                <q-spinner-gears
                  color="primary"
                  size="40px"
                  class="q-mt-md"
                />
                <div class="text-h6 q-mt-md">
                  Sync in progress...
                </div>
              </div>
            </div>
            <div v-else>
              <q-skeleton />

              <q-skeleton
                type="QBtn"
                class="q-mt-md"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

</style>
