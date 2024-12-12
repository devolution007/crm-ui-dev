<template>
  <div class="hover-able">
    <q-select
      v-model="valueLocal"
      :use-input="valueLocal === null"
      :options="optionsCompiled"
      map-options
      emit-value
      :label="$t('issue')"
      clearable
      stack-label
      option-label="name"
      option-value="id"
      @filter="searchFn"
      @update:model-value="$emit('update:modelValue', valueLocal)"
    >
      <template #selected-item="scope">
        <div class="q-py-sm inline items-center">
          <div>
            <q-item-label>
              #{{ scope.opt.id }}
              <q-chip
                v-if="scope.opt.category"
                class="q-ml-sm q-mr-none q-my-none"
                color="blue-grey-2"
                text-color="black"
                size="sm"
              >
                {{ scope.opt.category }}
              </q-chip>
            </q-item-label>
            <q-item-label
              class="text-toner"
              caption
            >
              {{ $helper.dateEst(scope.opt.createdAt) }}
            </q-item-label>
          </div>
        </div>
      </template>
      <template #option="scope">
        <q-item
          dense
          v-bind="scope.itemProps"
        >
          <q-item-section>
            <q-item-label>
              #{{ scope.opt.id }}
              <q-chip
                v-if="scope.opt.category"
                class="q-ml-sm q-mr-none q-my-none"
                color="blue-grey-2"
                text-color="black"
                size="sm"
              >
                {{ scope.opt.category }}
              </q-chip>
            </q-item-label>
            <q-item-label caption>
              {{ $helper.dateEst(scope.opt.createdAt) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <tasks-link-related
      v-if="valueLocal"
      :label="$t('openIssuePage')"
      @click="$q.notify('Not implemented yet')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, Ref, watch } from 'vue'
import { api } from 'boot/axios'
import IssueApi from 'src/api/IssueApi'
import { Notify } from 'quasar'

interface IssueOption {
  id: number
  createdAt: string
  category: string
}

const issuesRepo = new IssueApi(api)

const valueLocal: Ref<number | null> = ref(null)
const options: Ref<IssueOption[]> = ref([])

const props = defineProps({
  modelValue: {
    type: Number as PropType<number | null>,
    required: false,
    default: null
  },
  selectedDetails: {
    type: Object as PropType<IssueOption>,
    required: false,
    default: null
  }
})

const optionsCompiled = computed(() => {
  if (props.selectedDetails && !options.value.find((item) => item.id === props.selectedDetails.id) && valueLocal.value === props.selectedDetails.id) {
    return options.value.concat([props.selectedDetails])
  }
  return options.value
})

defineEmits(['update:modelValue'])

watch(() => props.modelValue, (value) => {
  valueLocal.value = value
})

onMounted(() => {
  valueLocal.value = props.modelValue
})

const openEntityPage = () => {
  Notify.create({
    message: 'Not implemented yet'
  })
  /* const link = router.resolve({
    name: 'issue-details',
    params: { orderId: valueLocal.value }
  })
  window?.open(link.href, '_blank') */
}

const searchFn = (val: string, update: (options: IssueOption[]) => void, abort: () => void) => {
  const filters = {
    ids: undefined as number[] | undefined
  }
  if (!!val && !isNaN(parseInt(val))) {
    filters.ids = [parseInt(val)]
  }
  issuesRepo.getIssues(1, filters, { createdAt: 'desc' }, 15)
    .then((response) => {
      options.value = response.items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        category: item.category
      }))
      update(options.value)
    })
    .catch((err) => {
      console.log(err)
      abort()
    })
}
</script>
