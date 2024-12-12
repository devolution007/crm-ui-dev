<template>
  <div class="fullscreen bg-dark-page text-center q-pa-md flex flex-center">
    <div>
      <q-img
        src="~assets/logo-dark.svg"
        style="max-width: 84px; min-width: 50px"
        class="cursor-pointer"
        @click="goToHome"
      />
      <div class=" text-white" style="font-size: 30vh">
        404
      </div>

      <div
        class="text-h2 text-white"
        style="opacity:.4"
      >
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        @click="goToHome"
        label="Go Dashboard"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goToHome = () => {
  router.push({ name: 'dashboard' })
}
</script>
