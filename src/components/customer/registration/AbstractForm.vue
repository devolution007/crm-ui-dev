<template>
  <q-select
    v-model="state"
    :label="$t('usState')"
    :options="$constants.PHC_STATES"
    :rules="[v => !!v || 'State is required']"
    :error-message="serverErrors.state"
    :error="!!serverErrors.state"
    map-options
    option-label="name"
    option-value="code"
    emit-value
  />
  <div class="row q-col-gutter-md">
    <div class="col-6">
      <q-input
        v-model="firstName"
        :label="$t('firstName')"
        :rules="[v => !!v || 'First name is required']"
        :error-message="serverErrors.firstName"
        :error="!!serverErrors.firstName"
      />
    </div>
    <div class="col-6">
      <q-input
        v-model="lastName"
        :label="$t('lastName')"
        :rules="[v => !!v || 'Last name is required']"
        :error-message="serverErrors.lastName"
        :error="!!serverErrors.lastName"
      />
    </div>
  </div>

  <q-field
    :error="!!serverErrors.gender"
    :error-message="serverErrors.gender"
    :label="$t('gender')"
    stack-label
    color="default"
  >
    <q-radio
      v-model="gender"
      :val="$constants.GENDER_FEMALE_CODE"
      :label="$t($constants.GENDER_FEMALE_CODE)"
    />
    <q-radio
      v-model="gender"
      :val="$constants.GENDER_MALE_CODE"
      :label="$t($constants.GENDER_MALE_CODE)"
    />
  </q-field>

  <div class="row q-col-gutter-md q-mb-md">
    <div class="col-6">
      <bricks-date-picker
        v-model="birthdate"
        :error-message="serverErrors.birthdate"
        :error="!!serverErrors.birthdate"
        :label="$t('dateOfBirth')"
      />
    </div>
    <div class="col-6">
      <q-select
        v-model="language"
        :label="$t('language')"
        :options="languages"
        map-options
        emit-value
        option-value="iso"
        option-label="name"
        :error-message="serverErrors.language"
        :error="!!serverErrors.language"
      >
        <template #selected>
          <div
            v-if="language"
          >
            {{ getLanguageByIso(language).icon }} {{ getLanguageByIso(language).name }}
            (<span class="text-uppercase">{{ language }}</span>)
          </div>
        </template>
      </q-select>
    </div>
  </div>

  <div class="row">
    <div class="col-6">
      <bricks-phone-input
        v-model="phone"
        :error-message="serverErrors.phone"
        :error="!!serverErrors.phone"
      />

      <q-input
        v-model="email"
        class="q-mb-md"
        :label="$t('emailOptional')"
        type="email"
        :error-message="serverErrors.email"
        :error="!!serverErrors.email"
        data-1p-ignore
      />
    </div>
    <div class="col-6">
      <q-checkbox
        v-model="usePhone"
        :label="$t('useThisPhoneNumberAsRegistrationMethod')"
      />
    </div>
  </div>

  <slot />

  <div class="flex">
    <q-space />
    <q-btn
      type="submit"
      color="primary"
      :label="$t('submit')"
      :disable="!props.submitEnabled"
      :loading="props.loading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useLanguages from 'src/composables/useLanguages'
import { CustomerInputInterface } from 'src/models/CustomerModel'
import { helper } from 'boot/helper'

const props = withDefaults(defineProps<{
  submitEnabled: boolean
  loading: boolean
  serverErrors: {
    state: string,
    firstName: string,
    lastName: string,
    gender: string,
    phone: string,
    email: string,
    birthdate: string,
    language: string,
    [key: string]: string
  }
}>(), {
  submitEnabled: true
})
const { languages, getLanguageByIso } = useLanguages()

const state = ref('')
const firstName = ref('')
const lastName = ref('')
const gender = ref('')
const birthdate = ref('')
const language = ref('')
const phone = ref('+1')
const email = ref('')

const usePhone = ref(false)

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'change', data: CustomerInputInterface): void
}>()

watch([state, firstName, lastName, gender, birthdate, language, phone, email, usePhone], () => {
  emit('change', {
    state: state.value,
    firstName: firstName.value,
    lastName: lastName.value,
    gender: gender.value,
    birthdate: helper.dateToYMD(birthdate.value),
    language: language.value,
    phone: phone.value,
    email: email.value,
    usePhoneAsLogin: usePhone.value
  })
})

</script>

<style scoped>

</style>
