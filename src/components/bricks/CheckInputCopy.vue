<template>
  <q-input
    :model-value="props.modelValue"
    :disable="check"
  >
    <template #before>
      <q-checkbox
        v-model="check"
      />
    </template>
    <template #append>
      <q-btn
        flat
        :icon="copied ? 'task' : 'content_copy'"
        @click="copy"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { copyToClipboard, Notify, EventBus } from 'quasar'
import BUS_EVENT from 'src/types/bus-events'

const bus = inject('bus') as EventBus
bus.on(BUS_EVENT.CHECK_INPUT_COPIED, () => {
  copied.value = false
})

const props = defineProps<{
  modelValue: string
}>()

const check = ref(false)
const copied = ref(false)

const copy = () => {
  copyToClipboard(props.modelValue)
    .then(() => {
      Notify.create({
        message: 'Copied',
        color: 'positive',
        icon: 'done'
      })

      bus.emit(BUS_EVENT.CHECK_INPUT_COPIED)
      copied.value = true
    })
    .catch(() => {
      // fail
    })
}
</script>

<style scoped>

</style>
