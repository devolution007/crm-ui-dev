<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.md"
    :full-height="$q.screen.lt.md"
    :persistent="isTaskFormDirty"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
      :class="{'column': $q.screen.lt.md, 'full-height': $q.screen.lt.md}"
      :style="modalCardStyles"
    >
      <q-form
        ref="formRef"
        @submit.prevent="onSubmitTask"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ cardTitle }}
          </div>
          <q-space />
          <tasks-changes-banner v-if="isTaskFormDirty" />

          <q-btn
            :loading="isSaving"
            icon="sym_o_save"
            color="primary"
            flat
            round
            dense
            type="submit"
            class="q-ml-lg"
          />
          <q-btn
            v-close-popup
            icon="sym_o_close"
            flat
            round
            dense
            class="q-ml-sm"
          />
        </q-card-section>
      </q-form>
      <q-card-section class="col">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-banner
              v-if="!!serverErrors.general"
              class="bg-negative text-white q-mb-md"
              dense
              rounded
            >
              {{ serverErrors.general }}
            </q-banner>

            <q-form
              @submit.prevent="onSubmitTask"
            >
              <q-input
                v-model="task.title"
                :label="$t('title')"
                :rules="[val => !!val || $t('fieldIsRequired')]"
                :error="!!serverErrors.title"
                :error-message="serverErrors.title"
              />

              <!-- todo: Call real status for banner showing -->
              <tasks-actuality-banner :task="taskOriginal" />

              <q-input
                v-model="task.description"
                :label="$t('description')"
                type="textarea"
                :rules="[val => !!val || $t('fieldIsRequired')]"
                :error="!!serverErrors.description"
                :error-message="serverErrors.description"
              />
            </q-form>

            <div
              v-if="props.id > 0"
              class=""
            >
              <q-tabs
                v-model="tab"
                align="left"
                class="max-content"
              >
                <q-tab
                  name="comments"
                  :label="$t('comments')"
                />
                <q-tab
                  name="activity"
                  :label="$t('activity')"
                />
              </q-tabs>
              <q-tab-panels
                v-model="tab"
                animated
              >
                <q-tab-panel
                  name="comments"
                  class="q-px-none"
                >
                  <tasks-comments-list
                    :task-id="props.id"
                    @error="onErrorHandler"
                  />
                </q-tab-panel>
                <q-tab-panel
                  name="activity"
                  class="q-px-none"
                >
                  <tasks-activity-list
                    :task-id="props.id"
                    @error="onErrorHandler"
                  />
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <tasks-fields-status-select v-model="task.status" />

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
            <tasks-fields-created-by
              :task="taskOriginal"
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

            <div class="flex justify-between items-center q-mt-md">
              <div class="text-body text-weight-bold">
                {{ $t('relatedEntities') }}
              </div>
              <tasks-related-controller
                v-model="relatedFieldsShown"
                :task="task"
              />
            </div>

            <tasks-fields-customer-select
              v-if="task.customer || relatedFieldsShown.customer"
              v-model="task.customer"
              :selected-details="taskOriginal?.customer"
              class="q-mb-sm"
            />

            <tasks-fields-target-list-select
              v-if="task.targetList"
              v-model="task.targetList"
              :selected-details="taskOriginal?.targetList"
              class="q-mb-sm"
            />

            <tasks-fields-facility-select
              v-if="task.facility || relatedFieldsShown.facility"
              v-model="task.facility"
              :selected-details="taskOriginal?.facility"
              class="q-mb-sm"
            />

            <tasks-fields-facility-staff-select
              v-if="task.facility"
              v-model="task.staff"
              :selected-details="taskOriginal?.staff"
              :facility-id="task.facility"
              class="q-mb-sm"
            />

            <tasks-fields-order-select
              v-if="task.order || relatedFieldsShown.order"
              v-model="task.order"
              :selected-details="taskOriginal?.order"
              class="q-mb-sm"
            />

            <tasks-fields-issue-select
              v-if="task.issue || relatedFieldsShown.issue"
              v-model="task.issue"
              :selected-details="taskOriginal?.issue"
              class="q-mb-sm"
            />

            <div class="flex justify-between q-pt-lg">
              <q-btn
                :label="$t('cancel')"
                @click="onDialogCancel"
              />
              <q-btn
                :loading="isSaving"
                color="primary"
                :label="$t('saveClose')"
                @click="saveAndClose"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-inner-loading
        :showing="taskOriginalLoading"
        :label="$t('pleaseWait')"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Notify, useDialogPluginComponent, useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { CustomTaskFormModel } from 'src/models/TaskModel'
import { useTasksStore } from 'stores/tasks-store'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios'
import { helper } from 'boot/helper'
import useTasks from 'src/composables/useTasks'
import { useModalCardStyles } from 'src/composables/useModalCardStyles'

const { task, serverErrors, catchValidationErrors, resetServerErrors, createTaskDialog } = useTasks()
const tasksStore = useTasksStore()
const route = useRoute()
const $q = useQuasar()

const props = withDefaults(defineProps<{
  // ...your custom props
  id: number
  preFilledData:() => Partial<CustomTaskFormModel>
}>(), {
  id: 0,
  preFilledData: () => ({})
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

watch(() => route.params.id, (id) => {
  console.log('id changed', id)
})

const cardTitle = computed(() => {
  return props.id === 0 ? 'Create task' : `Task #${props.id}`
})

const { modalCardStyles } = useModalCardStyles('large')

const taskOriginal = tasksStore.getEntryByID(props.id)
const taskOriginalLoading = tasksStore.getLoadingByID(props.id) // : Ref<boolean> = ref(false)

const tab = ref('comments')
const isSaving = ref(false)
const relatedFieldsShown = ref({
  customer: false,
  facility: false,
  order: false,
  issue: false
})

const isTaskFormDirty = computed(() => {
  const original = new CustomTaskFormModel(taskOriginal.value)
  for (const key in task.value) {
    if (task.value[key as keyof CustomTaskFormModel] !== original[key as keyof CustomTaskFormModel]) {
      return true
    }
  }
  return false
})

const properSaveApiMethodCall = async () => {
  if (props.id === 0) {
    return tasksStore.addEntry(helper.clone(task.value) as CustomTaskFormModel)
  } else {
    return tasksStore.patchEntry(props.id, helper.clone(task.value))
  }
}

const onSubmitTask = async (showAfterCreated = true) => {
  isSaving.value = true
  resetServerErrors()
  console.log('onSubmitTask')

  try {
    const result = await properSaveApiMethodCall()

    Notify.create({
      message: 'Changes were successfully saved',
      color: 'positive'
    })

    if (props.id === 0 && result.id) {
      onDialogOK(result.id)
      if (showAfterCreated) {
        createTaskDialog(result.id)
      }
    }
  } catch (e: unknown | AxiosError) {
    if (axios.isAxiosError(e)) {
      console.log('onSubmitTask error', e.response?.data)
      if (e?.response?.status === 422) {
        catchValidationErrors(e)
        $q.notify('Validation error. Please check the form')
      } else {
        onErrorHandler('Unknown error while saving task', e.response?.data?.message || undefined)
      }
    } else {
      onErrorHandler('Unknown error while saving task')
    }

    throw e
  } finally {
    isSaving.value = false
  }
}
const saveAndClose = async () => {
  onSubmitTask(false).then(() => {
    onDialogOK(taskOriginal.value)
  })
}

const onErrorHandler = (errorText: string, caption: string | undefined = undefined) => {
  Notify.create({
    message: errorText || 'Unknown error',
    color: 'negative',
    caption: caption || undefined
  })
}

const fillTaskFormFromOriginal = () => {
  console.log('fillTaskFormFromOriginal')
  task.value = new CustomTaskFormModel(taskOriginal.value)

  if (props.preFilledData) {
    task.value = Object.assign(task.value, props.preFilledData)
  }
}
watch(() => taskOriginal.value, (value) => {
  console.log('taskOriginal replaced', value)
  // task.value.customer = value?.customer?.id || null
  fillTaskFormFromOriginal()
})

onMounted(() => {
  fillTaskFormFromOriginal()

  if (props.id > 0) {
    tasksStore.fetchEntry(props.id)
  }
})
</script>
