<template>
  <div style="min-width: 500px;">
    <q-list>
      <customer-emails-edit-one
        v-for="(email, key) in workingEntries"
        :key="`customer-email-row-${customer.id}-${email.id}-${key}`"
        :item="email"
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
import EmailModel from 'src/models/EmailModel'

interface Props {
  editModalShown?: boolean;
}

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const props = withDefaults(defineProps<Props>(), {
  editModalShown: false
})

const workingEntries = <Ref<EmailModel[]>>ref([])

const initValues = () => {
  workingEntries.value = helper.clone(customer.value.emails) as EmailModel[]
}

watch(() => customer.value.id, () => {
  initValues()
})
watch(() => customer.value.emails, () => {
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
  workingEntries.value.push(new EmailModel())
}
</script>
