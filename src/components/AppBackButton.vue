<template>
  <q-btn
    fab
    icon="arrow_back"
    class="text-no-wrap"
    color="toner"
    @click="doNavigate"
    @mouseover="showLabel = true"
    @mouseleave="showLabel = false"
  >
    <q-tooltip
      anchor="center right"
      self="center left"
      :offset="[18, 18]"
      class="text-body2"
    >
      {{ props.label }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  to: {
    type: Object,
    required: false,
    default: null
  },
  label: {
    type: String,
    required: false,
    default: 'Return'
  },
  enableHistory: {
    type: Boolean,
    required: false,
    default: false
  }
})

const showLabel = ref(false)
const router = useRouter()

const doNavigate = () => {
  const hasHistory = router.options.history.state.back
  if (props.enableHistory && hasHistory) {
    router.back()
  } else {
    router.push(props.to)
  }
}
</script>
