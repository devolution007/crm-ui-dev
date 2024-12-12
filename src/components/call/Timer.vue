<template>
  <div
    v-if="seconds"
    class="flex no-wrap items-center call-timer-component mr-5"
  >
    <q-icon
      name="sym_o_timer"
      size="1.715em"
      class="q-mr-sm"
    />
    <div class="flex no-wrap items-center text-uppercase font-weight-bold">
      <q-chip square>
        <span v-if="days">
          {{ days }}d
          <span>&nbsp;:&nbsp;</span>
        </span>
        {{ hours }}
        <span>&nbsp;:&nbsp;</span>
        {{ minutes }}
        <span>&nbsp;:&nbsp;</span>
        {{ seconds }}
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
const props = defineProps({
  startTime: {
    type: String,
    required: true
  }
})

const minutes: Ref<string | null> = ref(null)
const seconds: Ref<string | null> = ref(null)
const hours: Ref<string | null> = ref(null)
const days: Ref<string | null> = ref(null)

const prettyTime = () => {
  const startTime = new Date(props.startTime)
  const distance = new Date().getTime() - startTime.getTime()
  const minutesInner = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const secondsInner = Math.floor((distance % (1000 * 60)) / 1000)
  const hoursInner = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const daysInner = Math.floor(distance / (1000 * 60 * 60 * 24))

  minutes.value = minutesInner < 10 ? '0' + minutesInner : minutesInner.toString()
  seconds.value = secondsInner < 10 ? '0' + secondsInner : secondsInner.toString()
  hours.value = hoursInner < 10 ? '0' + hoursInner : hoursInner.toString()
  days.value = daysInner < 1 ? null : daysInner.toString()
}

const timer = {
  pointer: null as number | null,
  start: (callback: () => void) => {
    timer.pointer = setInterval(callback, 1000) as unknown as number
  },
  stop: () => {
    if (timer.pointer) {
      clearInterval(timer.pointer)
    }
  }
}

onMounted(() => {
  timer.start(() => {
    prettyTime()
  })
})
onBeforeUnmount(() => {
  timer.stop()
})
</script>
