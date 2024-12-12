<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class=""
      :class="{ 'bg-white': !$q.dark.isActive, 'bg-blue-9': $q.dark.isActive, 'text-primary': !$q.dark.isActive }">
      <q-toolbar>
        <q-btn flat dense round icon="sym_o_menu" :aria-label="$t('menu')" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center">
          <q-img v-if="!$q.dark.isActive" src="~assets/logo.png" style="max-width: 90px; min-width: 50px"
            class="cursor-pointer" @click="goToHome" />
          <q-img v-if="$q.dark.isActive" src="~assets/logo.png" style="max-width: 84px; min-width: 50px"
            class="cursor-pointer" @click="goToHome" />
        </q-toolbar-title>

        <q-space />
        <!-- <the-top-create /> -->
        <call-panel />
      </q-toolbar>
    </q-header>

    <q-drawer :model-value="leftDrawerMode !== 'closed'" show-if-above side="left"
      :mini="leftDrawerMode === 'mini' && miniState" :mini-to-overlay="leftDrawerMode === 'mini'" bordered
      @mouseover="drawerOverHandler" @mouseout="drawerOutHandler" @hide="leftDrawerMode = 'closed'">
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <div class="menu-inner">
          <app-member-card />
          <app-menu />
          <q-item class="q-mt-auto">
            <q-item-section>
              <app-version />
            </q-item-section>
          </q-item>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="false" reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <the-super-panel v-model="isSuperPanelOpened" />
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'
import useSuperPanel from 'src/composables/useSuperPanel'
import TheSuperPanel from 'components/TheSuperPanel.vue'
import { useRouter } from 'vue-router'

const leftDrawerMode = ref('mini')
const miniState = ref(true)

const { isOpen: isSuperPanelOpened } = useSuperPanel()

const smallScreenDrawerOpen = () => {
  if ($q.screen.lt.md) {
    miniState.value = false
    leftDrawerMode.value = 'open'
  }
}

const $q = useQuasar()
function toggleLeftDrawer() {
  // Has 3 positions: mini, open, closed
  switch (leftDrawerMode.value) {
    case 'mini':
      leftDrawerMode.value = 'open'
      break
    case 'open':
      leftDrawerMode.value = 'closed'
      break
    case 'closed':
      leftDrawerMode.value = 'mini'
      break
  }

  smallScreenDrawerOpen()

  saveLeftDrawerMode()
}

const saveLeftDrawerMode = () => {
  LocalStorage.set('leftDrawerMode', leftDrawerMode.value)
}

const restoreLeftDrawerMode = () => {
  const savedLeftDrawerMode = LocalStorage.getItem('leftDrawerMode')
  if (savedLeftDrawerMode !== null) {
    leftDrawerMode.value = savedLeftDrawerMode as string

    smallScreenDrawerOpen()
  }
}

onMounted(() => {
  restoreLeftDrawerMode()
})

const router = useRouter()
const goToHome = () => {
  router.push({ name: 'dashboard' })
}

const drawerOverHandler = () => {
  if (leftDrawerMode.value === 'mini') {
    miniState.value = false
  }
}
const drawerOutHandler = () => {
  if (leftDrawerMode.value === 'mini') {
    miniState.value = true
  }
}

</script>
<style scoped lang="scss">
.menu-inner {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 100%;
  padding-bottom: 2rem;
}
</style>
