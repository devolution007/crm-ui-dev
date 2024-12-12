<template>
  <q-banner
    v-if="isChecked && !isActual"
    class="bg-amber-10 text-white"
  >
    <template #avatar>
      <q-icon
        name="report"
        color="white"
      />
    </template>
    {{ $t('attachedCustomerIsNotListedInTargetList') }} <br>
    {{ $t('taskBeingNotActual') }}
  </q-banner>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'
import { TaskFullInterface } from 'src/models/TaskModel'

const isChecked = ref(false)
const isActual = ref(null)

const props = defineProps({
  task: {
    type: Object as PropType<TaskFullInterface|null>,
    required: false,
    default: null
  }
})

onMounted(() => {
  if (props.task !== null) {
    // TODO: check if task is actual
    /* isChecked.value = true
    isActual.value = bool */
  }
})
</script>

<style scoped>

</style>
