<template>
  <div class="hover-able">
    <q-select
      v-model="valueLocal"
      :use-input="valueLocal === null"
      :options="optionsCompiled"
      map-options
      emit-value
      :label="$t('customer')"
      clearable
      stack-label
      option-label="name"
      option-value="id"
      @filter="searchFn"
      @update:model-value="$emit('update:modelValue', valueLocal)"
    >
      <template #selected-item="scope: MySelectedItemScope">
        <div class="q-py-sm inline items-center">
          <div>
            <q-item-label>
              {{ scope.opt.name }}
              <q-chip
                v-if="scope.opt.insuranceId"
                class="q-ml-sm q-mr-none q-my-none"
                color="blue-grey-2"
                text-color="black"
                size="sm"
              >
                {{ scope.opt.insuranceId }}
              </q-chip>
            </q-item-label>
            <q-item-label
              class="text-toner"
              caption
            >
              <span
                v-if="scope.opt.email"
                class="q-mr-sm"
              >{{ scope.opt.email }}</span>
              {{ scope.opt.birthdateStr }}
            </q-item-label>
          </div>
        </div>
      </template>
      <template #option="scope: MyOptionScope">
        <q-item
          dense
          v-bind="scope.itemProps"
        >
          <q-item-section>
            <q-item-label>
              {{ scope.opt.name }}
              <q-chip
                v-if="scope.opt.insuranceId"
                class="q-ml-sm q-mr-none q-my-none"
                color="blue-grey-2"
                text-color="black"
                size="sm"
              >
                {{ scope.opt.insuranceId }}
              </q-chip>
            </q-item-label>
            <q-item-label caption>
              <span
                v-if="scope.opt.email"
                class="q-mr-sm"
              >{{ scope.opt.email }}</span>
              {{ scope.opt.birthdateStr }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <tasks-link-related
      v-if="valueLocal"
      :label="$t('openDetailsPage')"
      :to="{ name: 'customer-details', params: { customerId: valueLocal } }"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, Ref, computed } from 'vue'
import CustomerApi from 'src/api/CustomerApi'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'
import { SelectOptionScope, SelectSelectedItemScope } from 'src/types/quasar-add'
const customersRepo = new CustomerApi(api)
interface CustomerOption {
  id: number
  name: string
  email: string
  birthdateStr: string
  insuranceId: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MySelectedItemScope extends SelectSelectedItemScope {
  opt: CustomerOption
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface MyOptionScope extends SelectOptionScope {
  opt: CustomerOption
}

const valueLocal: Ref<number|null> = ref(null)
const options: Ref<CustomerOption[]> = ref([])

const router = useRouter()

const props = withDefaults(defineProps<{
  modelValue?: number|null
  selectedDetails?: Readonly<CustomerOption>|null
}>(), {
  modelValue: null,
  selectedDetails: null
})

const optionsCompiled = computed(() => {
  if (props.selectedDetails && !options.value.find((item) => item.id === props.selectedDetails?.id)) {
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

const searchFn = (val: string, update: (options: CustomerOption[]) => void, abort: () => void) => {
  console.log('searchFn', val)

  customersRepo.getCustomers(1, 15, {
    id: 'desc'
  }, {
    combined: val.toUpperCase()
  })
    .then((res) => {
      options.value = res.items.map((item) => {
        return {
          id: item.id,
          name: item.firstName + ' ' + item.lastName,
          email: item.email,
          birthdateStr: item.birthdateStr,
          insuranceId: item.insuranceId
        }
      })
      update(options.value)
    })
    .catch((err) => {
      console.log(err)
      abort()
    })
}

const openEntityPage = () => {
  const link = router.resolve({
    name: 'customer-details',
    params: { customerId: valueLocal.value }
  })
  window?.open(link.href, '_blank')
}
</script>

<style scoped>

</style>
