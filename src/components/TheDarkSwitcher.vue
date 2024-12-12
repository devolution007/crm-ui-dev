<template>
  <q-select
    v-model="darkModel"
    label="Dark mode"
    :options="options"
    emit-value
    map-options
    bottom-slots
  >
    <template #after>
      <q-icon
        :name="icon"
        class="cursor-pointer"
        @click="showDialogDescription"
      />
      <q-icon
        v-if="darkModel === 'auto'"
        color="warning"
        :name="$q.dark.isActive ? 'sym_o_dark_mode' : 'sym_o_light_mode'"
      />
    </template>
    <template #hint>
      Experimental feature.
      <a
        href="#"
        class="text-primary"
        @click.prevent="showDialogDescription"
      >Learn more</a>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

type OptionValue = 'auto' | 'on' | 'off'
type OptionType = {
  value: OptionValue
  label: string
}

const options: OptionType[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' }
]

const defaultOption = 'auto'
const darkModel: Ref<OptionValue> = ref(defaultOption)

const realValuesMap: {
  [key in OptionValue]: 'auto' | boolean
} = {
  auto: 'auto',
  on: true,
  off: false
}

const loadOptionValueFromSavedSettings = () => {
  const dark = localStorage.getItem('dark')
  if (dark === 'on' || dark === 'off' || dark === 'auto') {
    darkModel.value = dark
  } else {
    darkModel.value = defaultOption
  }
}

const saveOptionValueToSavedSettings = () => {
  localStorage.setItem('dark', darkModel.value)
}

const realValueFromOption = (optionValue: OptionValue): 'auto' | boolean => {
  return realValuesMap[optionValue]
}

const applyCurrentOption = () => {
  const realValue = realValueFromOption(darkModel.value)
  $q.dark.set(realValue)
}

watch(darkModel, () => {
  saveOptionValueToSavedSettings()
  applyCurrentOption()
})

onMounted(() => {
  loadOptionValueFromSavedSettings()
  applyCurrentOption()
})

const icon = computed(() => {
  const iconMap = {
    auto: 'sym_o_brightness_auto',
    on: 'sym_o_dark_mode',
    off: 'sym_o_light_mode'
  }

  return iconMap[darkModel.value]
})

const showDialogDescription = () => {
  $q.dialog({
    title: 'Dark Mode',
    message: `
      <p>
        Dark Mode is a supplemental mode that can be used to display mostly dark surfaces on the UI. The design reduces the light emitted by device screens while maintaining the minimum color contrast ratios required for readability.
      </p>
      <p>
        The advantages of Dark Mode are that:
      </p>
      <ul>
        <li>It enhances visual ergonomics by reducing eye strain</li>
        <li>Provides comfort of use at night or in dark environments</li>
        <li>It conserves battery power mainly if the device screen is OLED or AMOLED, thereby enabling device usage for longer periods without charging</li>
      </ul>
      <p>
        When 'Auto' is selected, the app will automatically switch to Dark Mode if the dark mode is preferred on the device settings.
      </p>
    `,
    html: true,
    ok: true
  })
}
</script>

<style scoped>

</style>
