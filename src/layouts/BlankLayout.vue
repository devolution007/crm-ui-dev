<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="bg-default row justify-center">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  // name: 'LayoutName',

  setup () {
    const leftDrawer = ref(false)
    return { leftDrawer }
  }
})
</script>
