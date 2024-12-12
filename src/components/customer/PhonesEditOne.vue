<template>
  <q-item>
    <q-item-section
      side
      top
    >
      {{ index }}.
    </q-item-section>
    <q-item-section top>
      <bricks-phone-input
        v-model="mutableEntry.phone"
        :disable="loading || loadingEntries.includes(mutableEntry.id) || (mutableEntry.type === 'registration' && ! authStore.hasAccessFeature('customer_phone_reg_edit'))"
        outlined
        :error="!!serverErrors.phone"
        :error-message="serverErrors.phone"
        @change="resetServerErrors"
      />
      <q-select
        v-if="mutableEntry.type !== 'registration'"
        v-model="mutableEntry.type"
        dense
        label="Type"
        :options="$constants?.PHONE_TYPES?.map((type: string) => ({value: type, label: type})).filter((type: {value: string}) => type.value !== 'registration')"
        emit-value
        :error="!!serverErrors.type"
        :error-message="serverErrors.type"
      />
      <q-select
        v-model="mutableEntry.callType"
        :disable="loading"
        dense
        :options="[
          {value: 'landline', label: 'Landline', icon: 'sym_o_house'},
          {value: 'mobile', label: 'Mobile', icon: 'sym_o_phone_android'},
        ]"
        map-options
        emit-value
        label="Call Type"
        :error="!!serverErrors.callType"
        :error-message="serverErrors.callType"
        @update:model-value="callTypeChange"
      >
        <template #option="scope: {itemProps: Object; opt: StringMap;}">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template #selected-item="scope: {opt: StringMap}">
          <div>
            <q-icon
              :name="scope.opt.icon"
            />
            {{ scope.opt.label }}
          </div>
        </template>
      </q-select>
      <div class="row">
        <q-item-section
          top
          side
        >
          <q-item-label caption>
            Is valid?
          </q-item-label>
          <q-toggle
            v-model="mutableEntry.isValid"
          />
        </q-item-section>
        <q-item-section
          top
          side
        >
          <q-item-label caption>
            Marketing calls?
          </q-item-label>
          <q-toggle
            v-model="mutableEntry.isAvailableCalls"
          />
        </q-item-section>
        <q-item-section
          top
          side
        >
          <q-item-label caption>
            SMS?
          </q-item-label>
          <q-toggle
            v-model="mutableEntry.isAvailableSms"
            :disable="mutableEntry.callType === 'landline'"
          />
        </q-item-section>
      </div>
    </q-item-section>
    <q-item-section
      side
      top
    >
      <div class="row items-center">
        <q-btn
          :loading="loading"
          icon="sym_o_save"
          size="md"
          @click="saveEntry"
        />
        <q-avatar
          v-if="mutableEntry.id && mutableEntry.type === 'registration'"
          size="md"
        >
          <span>Reg.</span>
          <q-tooltip
            class="text-body2"
            :delay="500"
          >
            This phone is used for registration (as login).
          </q-tooltip>
        </q-avatar>
        <q-btn
          v-if="mutableEntry.id && mutableEntry.type !== 'registration'"
          icon="more_vert"
          round
          size="md"
          :loading="loading"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                clickable
                :disable="mutableEntry.type === 'registration'"
              >
                <q-item-section>Delete</q-item-section>
                <q-menu
                  v-if="mutableEntry.type !== 'registration'"
                  anchor="center middle"
                  self="center middle"
                >
                  <q-list style="min-width: 100px">
                    <q-item
                      v-close-popup
                      :active="true"
                      active-class="text-white bg-red-7"
                      clickable
                      @click="deleteEntry"
                    >
                      <q-item-section>Are you sure? (click here to confirm)</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { helper } from 'boot/helper'
import { useCustomerStore } from 'stores/customer-store'
import { useAuthStore } from 'stores/auth-store'
import { AxiosError } from 'axios'
import { useQuasar } from 'quasar'
import PhoneModel from 'src/models/PhoneModel'
import { StringMap } from 'src/types'
import useServerErrors2 from 'src/composables/useServerErrors2'
const $q = useQuasar()

interface Props {
  item: PhoneModel
  index: number
}

const authStore = useAuthStore()
const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const props = withDefaults(defineProps<Props>(), {})

const mutableEntry = <Ref<PhoneModel>>ref(new PhoneModel())
const loading = ref(false)
const loadingEntries = <Ref<number[]>>ref([])

const { serverErrors, resetServerErrors, catchValidationErrors } = useServerErrors2({
  type: '',
  phone: '',
  category: '',
  callType: ''
})

const initValues = () => {
  mutableEntry.value = helper.clone(props.item) as PhoneModel
}
onMounted(() => {
  initValues()
})

const callTypeChange = (callType: string) => {
  if (callType === 'landline') {
    mutableEntry.value.isAvailableSms = false
  }
}

const deleteEntry = async () => {
  loading.value = true
  try {
    await customerStore.removePhone(mutableEntry.value.id, customer.value.id)
  } catch (e) {
    console.error(e)
    const error = e as AxiosError
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error deleting entry'
    })
  } finally {
    loading.value = false
  }
}

const saveEntry = async () => {
  loading.value = true
  resetServerErrors()

  const data = Object.assign({}, mutableEntry.value)
  try {
    if (data.id) {
      await customerStore.editPhone({ phone: data })
    } else {
      delete data.id
      await customerStore.addPhone({
        phone: data,
        customerId: customer.value.id
      })
    }
    $q.notify('Entry saved')
  } catch (error) {
    catchValidationErrors(error)
  }
  loading.value = false
}
</script>
