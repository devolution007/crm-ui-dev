<template>
  <q-item>
    <q-item-section
      side
      top
    >
      {{ index }}.
      <q-item-label v-if="mutableEntry.reg">
        Reg.
        <q-tooltip
          class="text-body2"
          :delay="500"
        >
          This email is used for registration (as login).
        </q-tooltip>
      </q-item-label>
    </q-item-section>
    <q-item-section top>
      <q-input
        v-model="mutableEntry.value"
        :rules="[
          (v: string) => !!v || 'E-mail is required',
          (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ]"
        :disable="loading || (mutableEntry.reg && ! authStore.hasAccessFeature('customer_email_reg_edit'))"
        outlined
        aria-autocomplete="none"
        label="Email"
        placeholder="Email"
      />
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
            Marketing?
          </q-item-label>
          <q-toggle
            v-model="mutableEntry.allowMarketing"
          />
        </q-item-section>
      </div>
    </q-item-section>
    <q-item-section
      side
      top
    >
      <div class="row">
        <q-btn
          :loading="loading"
          icon="sym_o_save"
          size="md"
          @click="saveEntry"
        />
        <q-btn
          icon="more_vert"
          round
          size="md"
          :loading="loading"
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                clickable
                :disable="mutableEntry.reg"
              >
                <q-item-section>Delete</q-item-section>
                <q-menu
                  v-if="! mutableEntry.reg"
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

import EmailModel from 'src/models/EmailModel'
import { StringMap } from 'src/types'
import { onMounted, ref, Ref } from 'vue'
import { helper } from 'boot/helper'
import { AxiosError } from 'axios'
import { EmailEditDto } from 'src/models/customer/EmailEditDto'
import { EmailAddDto } from 'src/models/customer/EmailAddDto'
import { useQuasar } from 'quasar'
import { useCustomerStore } from 'stores/customer-store'
import { useAuthStore } from 'stores/auth-store'

const $q = useQuasar()

interface Props {
  item: EmailModel
  index: number
}

interface IErr extends StringMap {
  value: string | null
}

const props = withDefaults(defineProps<Props>(), {})

const mutableEntry = <Ref<EmailModel>>ref(new EmailModel())
const loading = ref(false)

const serverErrors = <Ref<IErr>>ref({
  value: null
})

const authStore = useAuthStore()
const customerStore = useCustomerStore()

const initValues = () => {
  mutableEntry.value = helper.clone(props.item) as EmailModel
}
onMounted(() => {
  initValues()
})

const deleteEntry = async () => {
  loading.value = true
  try {
    await customerStore.removeEmail(mutableEntry.value.id as number)
  } catch (e) {
    const error = e as AxiosError
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error deleting email'
    })
  } finally {
    loading.value = false
  }
}

const saveEntry = async () => {
  const data = Object.assign({}, mutableEntry.value)
  try {
    if (data.id) {
      await customerStore.editEmail({
        emailId: data.id,
        email: new EmailEditDto(data)
      })
    } else {
      await customerStore.addEmail({ email: new EmailAddDto(data) })
    }
  } catch (error: AxiosError | any) {
    if (error.response && error.response.data && error.response.status === 422) {
      serverErrors.value = helper.getFirstErrors(error.response.data, ['value']) as IErr
      $q.notify('Validation error')
    }
  }
}
</script>
