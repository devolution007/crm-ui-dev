<template>
  <q-page padding>
    <bricks-page-title>{{ $t('dashboard') }}</bricks-page-title>
    <tasks-list-table ref="table" />
  </q-page>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { useMeta } from 'quasar'
import useTasks from 'src/composables/useTasks'
import { useRouter } from 'vue-router'
import ListTable from 'components/refund/ListTable.vue'
const router = useRouter()
useMeta({
  title: 'Dashboard'
})

const table: Ref<typeof ListTable | null> = ref(null)
const { createTaskDialog } = useTasks()

const props = defineProps({
  // ...your custom props
  taskId: {
    type: Number,
    required: false,
    default: 0
  }
})

const callTaskDialog = (id: number | undefined = undefined) => {
  if (!id) {
    id = props.taskId
  }
  if (id > 0) {
    createTaskDialog(id)
      .onOk(() => {
        table.value?.refresh()
      })
      .onCancel(() => {
        table.value?.refresh()
      })
      .onDismiss(() => {
        router.push({
          name: 'dashboard'
        })
      })
  }
}

watch(() => props.taskId, (id) => {
  callTaskDialog(id)
})
callTaskDialog()

</script>
