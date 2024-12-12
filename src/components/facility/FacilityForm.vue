<template>
  <q-form
    v-if="!loading"
    ref="form"
    @submit.prevent="submit"
  >
    <q-input
      :model-value="mutableFormData.name"
      :error-message="serverErrors?.name"
      :error="!!serverErrors?.name"
      :label="$t('facilityName')"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.name=$event"
      @clear="mutableFormData.name=null"
    />
    <q-input
      :model-value="mutableFormData.address?.phone"
      :error-message="serverErrors?.phone"
      :error="!!serverErrors?.phone"
      :label="$t('phone')"
      outlined
      clearable
      class="q-mb-md"
      mask="1(###)###-####"
      @change="mutableFormData.address.phone=$event.replace(/\D/g, '')"
      @clear="mutableFormData.address.phone=null"
    />

    <q-input
      :model-value="mutableFormData.address?.addressString"
      :error-message="serverErrors?.addressString"
      :error="!!serverErrors?.addressString"
      :label="$t('address') + 1"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.address.addressString=$event"
      @clear="mutableFormData.address.addressString=null"
    />
    <q-input
      :model-value="mutableFormData.address?.addressOptionalString"
      :error-message="serverErrors?.addressOptionalString"
      :error="!!serverErrors?.addressOptionalString"
      :label="$t('address') + 2"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.address.addressOptionalString=$event"
      @clear="mutableFormData.address.addressOptionalString=null"
    />
    <q-input
      :model-value="mutableFormData.address?.zipCode"
      :error-message="serverErrors?.zipCode"
      :error="!!serverErrors?.zipCode"
      :label="$t('zip')"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.address.zipCode=$event"
      @clear="mutableFormData.address.zipCode=null"
    />
    <q-input
      :model-value="mutableFormData.address?.city"
      :error-message="serverErrors?.city"
      :error="!!serverErrors?.city"
      :label="$t('city')"
      outlined
      class="q-mb-md"
      clearable
      @change="mutableFormData.address.city=$event"
      @clear="mutableFormData.address.city=null"
    />
    <q-input
      :model-value="mutableFormData.address?.county"
      :error-message="serverErrors?.county"
      :error="!!serverErrors?.county"
      :label="$t('county')"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.address.county=$event"
      @clear="mutableFormData.address.county=null"
    />
    <q-select
      v-model="mutableFormData.address.state"
      outlined
      clearable
      :error="!!serverErrors?.state"
      :error-messages="serverErrors.state"
      :options="options"
      :label="$t('state')"
      option-value="code"
      option-label="name"
      emit-value
      map-options
      use-input
      input-debounce="0"
      class="q-mb-lg"
      @filter="statesFilter"
    />
    <q-select
      v-model="mutableFormData.manager"
      :error-message="serverErrors?.manager"
      :error="!!serverErrors?.manager"
      :options="members"
      option-value="id"
      option-label="name"
      outlined
      :label="$t('member')"
      clearable
      emit-value
      map-options
      class="q-mb-md"
    />
    <div class="row">
      <div class="col">
        <q-checkbox
          v-model="mutableFormData.verified"
          :error-message="serverErrors?.verified"
          :error="!!serverErrors?.verified"
          :label="$t('verified')"
        />
      </div>
      <div class="col">
        <q-btn
          type="submit"
          color="primary"
          :loading="submitting"
          :label="$t('save')"
          class="col float-right"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
/**
 * TODO: Move address edit to separate component (already done in customer)
 */
import { FacilityForm } from 'src/types'
import { onMounted, ref } from 'vue'
import { constants } from 'boot/constants'
import { api } from 'boot/axios'
import MemberApi from 'src/api/MemberApi'
import MemberModel from 'src/models/MemberModel'
const memberRepository: MemberApi = new MemberApi(api)
const props = defineProps<{
  formData: FacilityForm,
  serverErrors: any,
  submitting: boolean
}>()
const loading = ref<boolean>(false)
const mutableFormData = ref<FacilityForm>({ ...props.formData })
const options = ref(constants.USA_STATES)
const members = ref<MemberModel[]>([])
const emit = defineEmits(['submit'])

function submit () {
  emit('submit', mutableFormData.value)
}
function statesFilter (val: string, update: any) {
  update(() => {
    options.value = constants.USA_STATES.filter((v: any) => v.name.indexOf(val) > -1)
  })
}
onMounted(async () => {
  loading.value = true
  members.value = await memberRepository.getMembersForThisOrganization()
  loading.value = false
})
</script>
