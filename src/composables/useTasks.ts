import { Ref, ref } from 'vue'
import { Dialog, DialogChainObject } from 'quasar'
import OneTask from 'components/tasks/OneTask.vue'
import MultiTaskCreate from 'components/tasks/MultiTaskCreate.vue'
import { CustomTaskFormModel } from 'src/models/TaskModel'
import useServerErrors2 from 'src/composables/useServerErrors2'

export default function useTasks () {
  const {
    serverErrors,
    catchValidationErrors,
    resetServerErrors
  } = useServerErrors2({
    general: '',
    dateBefore: '',
    title: '',
    description: ''
  })

  const task: Ref<CustomTaskFormModel> = ref({
    title: '',
    description: '',
    status: 0,
    priority: 0,
    category: null,
    dateBefore: '',
    timeBefore: '',
    assignedTo: null,
    customer: null,
    facility: null,
    order: null,
    targetList: null,
    issue: null,
    staff: null
  })
  return {
    task,
    serverErrors,
    catchValidationErrors,
    resetServerErrors,
    createTaskDialog (id: number, preFilledData: Partial<CustomTaskFormModel> = {}): DialogChainObject {
      return Dialog.create({
        component: OneTask,
        componentProps: {
          id, preFilledData
        }
      })
    },

    /**
     * Create dialog for creating multiple tasks for selected customers
     * Can be pre-filled with data
     * @param customerIds
     * @param preFilledData
     * @example createMultiTaskAddDialog([12, 385], {targetList: 4})
     */
    createMultiTaskAddDialog (customerIds: number[], preFilledData: Partial<CustomTaskFormModel> = {}): DialogChainObject {
      return Dialog.create({
        component: MultiTaskCreate,
        componentProps: {
          customerIds,
          preFilledData
        }
      })
    }
  }
}
