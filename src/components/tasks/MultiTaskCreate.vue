<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.md"
    :full-height="$q.screen.lt.md"
    :persistent="isTaskFormDirty || submitting"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
    >
      <q-card-section>
        <div class="text-h6">
          {{ $t('createTasksWithSelectedCustomers') }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-banner
          v-if="!!serverErrors.general"
          class="bg-negative text-white q-mb-md"
          dense
          rounded
        >
          {{ serverErrors.general }}
        </q-banner>

        <q-input
          v-model="task.title"
          :label="$t('title')"
          :rules="[val => !!val || $t('fieldIsRequired')]"
          :error="!!serverErrors.title"
          :error-message="serverErrors.title"
        />

        <q-input
          v-model="task.description"
          :label="$t('description')"
          type="textarea"
          :rules="[val => !!val || $t('fieldIsRequired')]"
          :error="!!serverErrors.description"
          :error-message="serverErrors.description"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-body text-weight-bold q-mt-md">
          {{ $t('properties') }}
        </div>
        <tasks-fields-priority-select
          v-model="task.priority"
          class="q-mb-md"
        />
        <tasks-fields-category-select
          v-model="task.category"
          class="q-mb-md"
        />
        <tasks-fields-assigned-select
          v-model="task.assignedTo"
          class="q-mb-md"
        />

        <div class="q-mb-md">
          <div class="relative-position flex">
            <q-field
              dense
              borderless
              :label="$t('dueTo')"
              stack-label
              class="absolute full-width"
            />
          </div>

          <div class="q-pt-md row q-col-gutter-md">
            <bricks-date-picker
              v-model="task.dateBefore"
              class="col-7"
              :error="!!serverErrors.dateBefore"
              :error-message="serverErrors.dateBefore"
              @clear="task.timeBefore = ''"
              @updated="serverErrors.dateBefore = ''"
            />
            <bricks-time-picker
              v-if="task.dateBefore"
              v-model="task.timeBefore"
              class="col"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
          :label="$t('cancel')"
          @click="onDialogCancel"
        />
        <q-btn
          :label="t('createTasksMany', { count: customerIds?.length || 0 })"
          color="primary"
          @click="tasksCreate"
        />
      </q-card-actions>
      <q-inner-loading
        :showing="submitting"
        :label="$t('pleaseWait')"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import { Dialog, Notify, useDialogPluginComponent, useQuasar } from 'quasar'
import { CustomTaskFormModel } from 'src/models/TaskModel'
import useTasks from 'src/composables/useTasks'
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import { useTasksStore } from 'stores/tasks-store'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const { t } = useI18n()
const tasksStore = useTasksStore()
const { task, serverErrors, catchValidationErrors, resetServerErrors } = useTasks()

const submitting = ref(false)

const props = defineProps({
  // ...your custom props
  customerIds: {
    type: Array as () => number[],
    required: false,
    default: () => []
  },
  preFilledData: {
    type: Object as () => Partial<CustomTaskFormModel>,
    required: false,
    default: () => ({})
  }
})
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const isTaskFormDirty = computed(() => {
  const original = new CustomTaskFormModel()
  for (const key in task.value) {
    if (task.value[key as keyof CustomTaskFormModel] !== original[key as keyof CustomTaskFormModel]) {
      return true
    }
  }
  return false
})

if (props.preFilledData) {
  task.value = Object.assign(task.value, props.preFilledData)
}

const tasksCreate = async () => {
  submitting.value = true
  resetServerErrors()
  try {
    for (const customer of props.customerIds) {
      await tasksStore.addEntry({
        ...helper.clone(task.value),
        customer
      } as CustomTaskFormModel)
    }

    submitting.value = false
    Notify.create({
      message: 'Tasks created',
      color: 'positive'
    })
    onDialogOK()
  } catch (e: unknown | AxiosError) {
    if (axios.isAxiosError(e) && e?.response?.status === 422) {
      catchValidationErrors(e)
    } else {
      Notify.create({
        message: 'Unknown error while saving task',
        color: 'negative'
      })
    }
  } finally {
    submitting.value = false
  }
}

if (props.customerIds.length === 0) {
  Dialog.create({
    title: 'Unsupported mode',
    message: 'You can only create tasks for at least one customer'
  })
    .onDismiss(() => {
      onDialogCancel()
    })
}

</script>

<style scoped>

</style>
