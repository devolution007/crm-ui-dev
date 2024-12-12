<template>
  <q-select
    v-model="locale"
    :options="localeOptions"
    :label="$t('language')"
    borderless
    emit-value
    map-options
    options-dense
    style="min-width: 150px"
  />
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'

export default {
  setup () {
    const { locale } = useI18n({ useScope: 'global' })

    watch(() => locale.value, (value) => {
      localStorage.setItem('locale', value.toString())
    })

    return {
      locale,
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'es', label: 'Español' }
      ]
    }
  }
}
</script>
