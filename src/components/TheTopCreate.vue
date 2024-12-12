<template>
  <q-btn
    class="q-mr-sm"
    icon="sym_o_add_task"
    @click="createTaskDialog(0)"
  >
    <span
      v-if="$q.screen.gt.md"
      class="q-ml-sm"
    >Add task</span>
  </q-btn>
</template>

<script setup lang="ts">
import useTasks from 'src/composables/useTasks'
const { createTaskDialog } = useTasks()

</script>
