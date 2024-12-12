<template>
  <div style="min-width: 500px;">
    <q-list>
      <customer-phones-edit-one
        v-for="(phone, key) in workingEntries"
        :key="`customer-phone-row-${customer.id}-${phone.id}-${key}`"
        :item="phone"
        :index="key + 1"
      />
      <q-item>
        <q-btn
          icon="sym_o_add_box"
          @click="addEntry"
        />
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { helper } from 'boot/helper'
import { useCustomerStore } from 'stores/customer-store'
import PhoneModel from 'src/models/PhoneModel'

interface Props {
  editModalShown?: boolean;
}

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const props = withDefaults(defineProps<Props>(), {
  editModalShown: false
})

const workingEntries = <Ref<PhoneModel[]>>ref([])

const initValues = () => {
  const entries = helper.clone(customer.value.phones) as PhoneModel[]
  workingEntries.value = entries.sort((a, b) => {
    if (a.type === 'registration' && a.type !== 'registration') {
      return 1
    }
    return a.id - b.id
  })
}

watch(() => customer.value.id, () => {
  initValues()
})
watch(() => customer.value.phones, () => {
  initValues()
})

watch(() => props.editModalShown, () => {
  if (props.editModalShown) {
    initValues()
  }
})

onMounted(() => {
  initValues()
})

const addEntry = () => {
  workingEntries.value.push(new PhoneModel())
}
</script>
