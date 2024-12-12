<template>
  <div v-if="oStore.order?.attachments.length === 0">
    <div class="text-body2 q-mb-sm">
      Fax form attachments have not yet been saved.
    </div>
  </div>
  <div
    v-else
    class="q-mb-md"
  >
    <div class="text-body2">
      {{ $t('savedAttachments') }}
    </div>
    <div class="q-mb-sm">
      <app-attachments-btn-download
        v-if="oStore.order?.attachments && oStore.order?.attachments.length > 0"
        :attachments="oStore.order?.attachments"
        show-type="list"
      >
        <template #attachment-name="{ attachment }">
          {{ attachment.name }}
          <div class="flex q-pt-xs">
            <q-badge class="q-mr-md">
              {{ attachment.faxType }}
            </q-badge>
          </div>
        </template>
      </app-attachments-btn-download>
    </div>
    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <div v-if="!showUploadForm">
        <q-btn
          class="q-mr-md"
          label="Replace"
          outline
          @click="showUploadForm = true"
        />
        <q-btn
          label="Clear"
          text-color="negative"
          @click="onDeleteRequested"
        />
      </div>
    </transition>
  </div>
  <transition
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown"
  >
    <q-field
      v-if="showUploadForm || attachmentsDrafts.length > 0 || oStore.order?.attachments.length === 0"
      :label="$t('addNewAttachments')"
      :stack-label="true"
      class="q-mb-md"
      :error="!!props.serverErrors.files"
      :error-message="props.serverErrors.files"
    >
      <div class="q-pt-sm full-width">
        <app-attachments-upload
          ref="attachmentsBox"
          :attachments="attachmentsDrafts"
          accept=".pdf,application/pdf,application/x-pdf,image/*"
          @uploaded-one="attachmentsDrafts.push($event)"
          @deleted="onAttachmentDraftDeleted"
        />
      </div>
    </q-field>
  </transition>
  <transition
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutUp"
  >
    <div v-show="attachmentsDrafts.length > 0">
      <div class="text-body2">
        Form Type
      </div>
      <div
        v-if="!!props.serverErrors.type"
        class="text-negative text-caption"
      >
        {{ props.serverErrors.type }}
      </div>
      <q-option-group
        v-model="type"
        class="q-mb-sm"
        :options="$constants.FAX_TYPES.map(t => ({ label: t, value: t }))"
        type="radio"
      />

      <q-btn
        :loading="props.loading"
        :label="$t('saveAttachments')"
        color="secondary"
        text-color="primary"
        @click="saveFaxAttachments"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">

import { useOrderStore } from 'stores/order-store'
import { ref, inject, watch } from 'vue'
import { AttachmentInfo } from 'src/types'
import { ErrorContainer } from 'src/types/classes'
import { Dialog, EventBus } from 'quasar'
import BUS_EVENT from 'src/types/bus-events'

const bus = inject('bus') as EventBus
class FaxSaverIErr extends ErrorContainer {
  type = null
  date = null
  time = null
  files = null
}

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  },
  serverErrors: {
    type: Object as () => FaxSaverIErr,
    required: false,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['save:requested', 'input:field'])

const oStore = useOrderStore()
oStore.init(props.orderId)

const date = ref('')
const time = ref('')
const type = ref('')
const attachmentsDrafts = ref<AttachmentInfo[]>([])
const showUploadForm = ref(false)

const onAttachmentDraftDeleted = (attachment: AttachmentInfo) => {
  const index = attachmentsDrafts.value.findIndex(a => a.id === attachment.id)
  if (index > -1) {
    attachmentsDrafts.value.splice(index, 1)
  }
  if (attachmentsDrafts.value.length === 0) {
    showUploadForm.value = false
  }
  emit('input:field', { field: 'files', value: attachmentsDrafts.value })
}

const saveFaxAttachments = () => {
  emit('save:requested', {
    files: attachmentsDrafts.value.map(a => a.id),
    date: date.value,
    time: time.value + ':00',
    type: type.value
  })
}

// When order is finally saved, clear attachmentsDrafts
bus.on(BUS_EVENT.ORDER_PATCHED, (orderId: number, patch: { faxAttachments: { date: string } | null }) => {
  if (patch.faxAttachments) {
    attachmentsDrafts.value = []
    showUploadForm.value = false
  }
})

watch(type, (val) => {
  emit('input:field', { field: 'type', value: val })
})

const onDeleteRequested = () => {
  Dialog.create({
    title: 'Delete fax attachments',
    message: 'Are you sure you want to delete fax attachments?',
    ok: {
      label: 'Delete',
      color: 'negative'
    },
    cancel: true
  }).onOk(() => {
    oStore.deleteFaxAttachments()
  })
}
</script>

<style scoped>

</style>
