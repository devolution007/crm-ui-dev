<template>
  <q-dialog
    ref="dialogRef"
    :full-width="$q.screen.lt.md"
    @hide="onDialogHide"
  >
    <q-card
      class="q-dialog-plugin"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          How can we notify you?
        </div>
        <q-space />
        <q-btn
          v-close-popup
          icon="sym_o_close"
          flat
          round
          dense
        />
      </q-card-section>
      <q-card-section>
        <q-tabs
          v-model="tab"
          class="q-mb-md"
          @update:model-value="onTabChange"
        >
          <q-tab
            name="email"
            label="Email"
          />
          <q-tab
            name="phone"
            label="Phone"
          />
        </q-tabs>

        <q-form
          ref="formRef"
          :autocomplete="'off'"
          aria-autocomplete="none"
          @validation-success="formValid = true"
          @validation-error="formValid = false"
          @submit="() => {}"
        >
          <q-tab-panels
            v-model="tab"
            animated
          >
            <q-tab-panel
              name="email"
              class="q-pa-none"
              :style="{ minHeight: '120px' }"
            >
              <q-input
                v-if="tab === 'email'"
                v-model="target"
                type="email"
                label="Email"
                filled
                :rules="[val => helper.isEmail(val) || 'Invalid email']"
                data-1p-ignore
                debounce="300"
              >
                <template #append>
                  <customer-choose-email
                    icon="sym_o_import_contacts"
                    :customer-id="props.customerId"
                    @input="target = $event"
                  />
                </template>
              </q-input>

              <q-checkbox
                v-if="isTargetFilled && ! isTargetFromProfile"
                v-model="addTargetToProfile"
                label="Add this email to customer's card"
              />
            </q-tab-panel>

            <q-tab-panel
              name="phone"
              class="q-pa-none"
              :style="{ minHeight: '200px' }"
            >
              <q-field
                class="q-mb-md"
                label="Notice type"
                stack-label
                filled
              >
                <q-radio
                  v-model="notifyType"
                  val="phone"
                  label="Call"
                />
                <q-radio
                  v-model="notifyType"
                  val="sms"
                  label="SMS"
                />
              </q-field>

              <q-input
                v-if="tab === 'phone'"
                v-model="target"
                type="tel"
                label="Phone"
                filled
                :rules="[val => helper.isPhone(val) || 'Invalid phone']"
                data-1p-ignore
                mask="+#(###)###-####"
                unmasked-value
              >
                <template #append>
                  <customer-choose-phone
                    icon="sym_o_import_contacts"
                    :customer-id="props.customerId"
                    @input="target = $event"
                  />
                </template>
              </q-input>

              <q-checkbox
                v-if="isTargetFilled && ! isTargetFromProfile"
                v-model="addTargetToProfile"
                label="Add this phone to customer's card"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-form>
      </q-card-section>
      <q-card-actions class="justify-between">
        <q-btn
          label="Cancel"
          flat
          @click="onDialogCancel"
        />
        <q-btn
          :loading="loading"
          label="Enable notification"
          color="primary"
          flat
          :disable="! target || ! formValid"
          @click="formSend"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QForm, useDialogPluginComponent } from 'quasar'
import { computed, Ref, ref, watch } from 'vue'
import { useCustomerStore } from 'stores/customer-store'
import { helper } from 'boot/helper'
import { EmailAddDto } from 'src/models/customer/EmailAddDto'
import EmailModel from 'src/models/EmailModel'
import { NotifyType } from 'src/types'

const props = defineProps<{
  customerId: number
}>()

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const tab: Ref<'email' | 'phone'> = ref('email')
const notifyType: Ref<NotifyType> = ref('email')
const target: Ref<string> = ref('')
const formValid = ref(false)
const addTargetToProfile = ref(false)
const formRef: Ref<QForm | null> = ref(null)
const loading = ref(false)

const customerStore = useCustomerStore()
const customer = customerStore.getCustomerLazy(
  computed(() => props.customerId)
)

watch(target, () => {
  formRef.value?.validate()
})

const formSend = async () => {
  loading.value = true

  if (addTargetToProfile.value) {
    if (tab.value === 'email') {
      await customerStore.addEmail({
        email: new EmailAddDto(new EmailModel({
          value: target.value
        }))
      })
    } else {
      await customerStore.addPhone({
        phone: {
          phone: target.value
        },
        customerId: props.customerId
      })
    }
  }

  loading.value = false

  onDialogOK({
    type: notifyType.value,
    target: target.value
  })
}

const onTabChange = (tab: 'email' | 'phone') => {
  notifyType.value = tab
  target.value = ''
  addTargetToProfile.value = false
}

const isTargetFilled = computed(() => {
  if (target.value === '') return false

  return formValid.value !== false
})

const isTargetFromProfile = computed(() => {
  if (target.value === '' || formValid.value === false) return false

  if (tab.value === 'email') {
    return customer.value?.emails?.some((email) => email.value === target.value)
  } else {
    return customer.value?.phones?.some((phone) => phone.phone === target.value)
  }
})

</script>
