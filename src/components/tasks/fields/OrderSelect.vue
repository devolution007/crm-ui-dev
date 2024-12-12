<template>
  <div class="hover-able">
    <q-select
      v-model="valueLocal"
      :use-input="valueLocal === null"
      :options="optionsCompiled"
      map-options
      emit-value
      :label="$t('order')"
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
                class="q-ml-sm q-mr-none q-my-none"
                color="blue-grey-2"
                text-color="black"
                size="sm"
              >
                {{ scope.opt.statusName }}
              </q-chip>
            </q-item-label>
            <q-item-label
              class="text-toner"
              caption
            >
              <span
                class="q-mr-sm"
              >${{ scope.opt.price }}</span>
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
                class="q-ml-sm q-mr-none q-my-none"
                color="blue-grey-2"
                text-color="black"
                size="sm"
              >
                {{ scope.opt.statusName }}
              </q-chip>
            </q-item-label>
            <q-item-label caption>
              <span
                class="q-mr-sm"
              >${{ scope.opt.price }}</span>
              {{ $helper.dateEst(scope.opt.createdAt) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <tasks-link-related
      v-if="valueLocal"
      :label="$t('openOrderPage')"
      :to="{ name: 'order-details', params: { orderId: valueLocal } }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, Ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import OrderApi from 'src/api/OrderApi'

interface OrderOption {
  id: number
  createdAt: string
  price: string
  statusName: string
}

const ordersRepo = new OrderApi(api)

const valueLocal: Ref<number | null> = ref(null)
const options: Ref<OrderOption[]> = ref([])

const router = useRouter()

const props = withDefaults(defineProps<{
  modelValue?: number | null
  selectedDetails?: OrderOption | null
}>(), {
  modelValue: null,
  selectedDetails: null
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
  const link = router.resolve({
    name: 'order-details',
    params: { orderId: valueLocal.value }
  })
  window?.open(link.href, '_blank')
}

const searchFn = (val: string, update: (options: OrderOption[]) => void, abort: () => void) => {
  const filters = {
    orderId: null as number | null
  }
  if (!!val && !isNaN(parseInt(val))) {
    filters.orderId = parseInt(val)
  }
  ordersRepo.getOrders(1, filters, [{ createdAt: 'desc' }])
    .then((response) => {
      options.value = response.items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        price: item.price,
        statusName: item.statusName
      }))
      update(options.value)
    })
    .catch((err) => {
      console.log(err)
      abort()
    })
}
</script>
