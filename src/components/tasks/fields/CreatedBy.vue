<template>
  <div>
    <q-select
      :label="$t('createdBy')"
      :model-value="displayMember.id"
      :borderless="false"
      readonly
      dense
      map-options
      emit-value
      :options="options"
      :hide-dropdown-icon="true"
      option-value="id"
      option-label="name"
    >
      <template #selected-item="scope">
        <div class="q-py-sm flex items-center">
          <tools-member-indicator
            :member="scope.opt"
            :show-tooltip="false"
            class="q-mr-sm"
          />
          <div>
            <q-item-label>
              {{ scope.opt.firstName }} {{ scope.opt.lastName }}
            </q-item-label>
          </div>
        </div>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { TaskFullInterface } from 'src/models/TaskModel'
import { useAuthStore } from 'stores/auth-store'
const auth = useAuthStore()

const props = defineProps({
  task: {
    type: Object as PropType<TaskFullInterface|null>,
    required: false,
    default: null
  }
})

const displayMember = computed(() => {
  if (props.task === null) {
    return auth.user
  }

  return props.task.member
})

const options = computed(() => {
  if (props.task === null) {
    return [auth.user]
  }

  return [props.task.member]
})

</script>

<style scoped>

</style>
