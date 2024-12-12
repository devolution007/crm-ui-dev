<template>
  <q-form
    ref="form"
    @submit.prevent="submit"
  >
    <q-input
      :model-value="mutableFormData.name"
      :error-message="serverErrors?.name"
      :error="!!serverErrors?.name"
      :label="$t('name')"
      outlined
      clearable
      class="q-mb-md"
      @change="mutableFormData.name=$event"
      @clear="mutableFormData.name=''"
    />
    <div>
      <q-btn
        type="submit"
        color="primary"
        :loading="submitting"
        :label="$t('save')"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { BrokerAgencyData } from 'src/types'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['submit'])
const props = defineProps<{
    formData: BrokerAgencyData,
    serverErrors: any,
    submitting: boolean
  }>()
const mutableFormData = ref<BrokerAgencyData>({ ...props.formData })
onMounted(() => {
  mutableFormData.value = { ...props.formData }
})
function submit () {
  emit('submit', mutableFormData.value)
}
</script>
<style scoped>

</style>
