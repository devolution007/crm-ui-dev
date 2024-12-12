<template>
  <q-page padding>
    <!-- content -->

    <h3>Brand colors</h3>
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Light Theme</div>
      </q-card-section>
      <q-card-section>
        <brand-colors />
      </q-card-section>
    </q-card>
    <q-card dark class="body--dark">
      <q-card-section>
        <div class="text-h6">Dark Theme</div>
      </q-card-section>
      <q-card-section>
        <brand-colors />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BrandColors from 'components/ui-kit/BrandColors.vue'
export default defineComponent({
  components: { BrandColors }
  // name: 'PageName'
})
</script>
