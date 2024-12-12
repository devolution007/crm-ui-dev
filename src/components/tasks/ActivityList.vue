<template>
  <div class="q-px-lg q-pb-md">
    <q-inner-loading
      :showing="loading"
      :label="$t('pleaseWait')"
    />
    <q-timeline color="secondary">
      <q-timeline-entry
        v-for="entry in entriesList"
        :key="`tl-entry${entry.guid}`"
      >
        <template #subtitle>
          {{ $helper.fromNow(entry.createdAt) }}
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="text-body2"
          >
            {{ $helper.dateTz(entry.createdAt) }} ({{ $helper.localTimezone() }})
          </q-tooltip>
        </template>
        <template #default>
          <div class="q-mb-sm">
            <tools-member-indicator
              :member="entry.member"
              :show-name="true"
            />
          </div>
          <div v-if="entry.eventDescription && entry.changes.length === 0">
            {{ entry.eventDescription }}
          </div>
          <template v-else>
            <div
              v-for="(change, index) in entry.changes"
              :key="`entry-log-${entry.guid}_${change.field}`"
              class="q-mb-sm"
            >
              <div class="q-mb-sm">
                <span v-if="entry.changes.length > 1">{{ (index + 1) }}. </span>
                {{ $t('changed') }} <strong>{{ change.field }}</strong>
              </div>

              <div v-if="change.field === 'description'">
                <tasks-activity-entry-multiline type="old">
                  <pre
                    class="q-ma-none white-space-pre-line text-grey line-height-1"
                  >{{ change.old }}</pre>
                </tasks-activity-entry-multiline>
                <div>
                  <q-icon name="arrow_downward" />
                </div>
                <tasks-activity-entry-multiline type="new">
                  <pre class="q-ma-none white-space-pre-line line-height-1">{{ change.new }}</pre>
                </tasks-activity-entry-multiline>
              </div>

              <!--              <tasks-activity-entry-customer
                v-else-if="change.field === 'customer'"
                :change="change"
              />

              <tasks-activity-entry-staff
                v-else-if="change.field === 'staff'"
                :change="change"
              />-->

              <tasks-activity-entry-common
                v-else
                :change="change"
              />
            </div>
          </template>
        </template>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">

import { onMounted, Ref, ref, watch } from 'vue'
import TaskApi from 'src/api/TaskApi'
import { api } from 'boot/axios'
import axios, { AxiosError } from 'axios'
import { ActivityEntryInterface } from 'src/models/TaskModel'
import { useTasksStore } from 'stores/tasks-store'

const props = defineProps({
  taskId: {
    type: Number,
    required: false,
    default: 0
  }
})
const emit = defineEmits(['error'])

const loading = ref(false)
const entriesList: Ref<ActivityEntryInterface[]> = ref([])
const tasksStore = useTasksStore()

const refreshEntries = async (silent = false) => {
  if (!props.taskId) {
    return
  }

  if (!silent) {
    entriesList.value = []
    loading.value = true
  }
  try {
    entriesList.value = await (new TaskApi(api)).getActivity(props.taskId)
  } catch (e: unknown | AxiosError) {
    if (axios.isAxiosError(e) && e.response?.data?.detail) {
      emit('error', e.response?.data?.detail)
    } else {
      emit('error', 'Something went wrong')
    }

    console.error(e)
  } finally {
    loading.value = false
  }
}
const taskOriginal = tasksStore.getEntryByID(props.taskId)

watch(() => props.taskId, () => {
  if (props.taskId) {
    refreshEntries()
  } else {
    entriesList.value = []
  }
})

watch(() => taskOriginal.value, (value) => {
  refreshEntries(true)
})

onMounted(() => {
  refreshEntries()
})
</script>

<style scoped>

</style>
