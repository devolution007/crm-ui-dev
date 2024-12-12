<template>
  <q-uploader
    ref="fileUploader"
    :url="$constants.ATTACHMENT_UPLOAD_URL"
    :label="$t('uploadFile')"
    auto-upload
    multiple
    class="q-mb-md"
    :headers="authHeaders"
    :flat="true"
    color="transparent"
    text-color="toner"
    :no-thumbnails="true"
    :accept="props.accept"
    :max-file-size="props.maxFileSize"
    @uploaded="onUploaded"
    @failed="onFailed"
  >
    <template #list="scope">
      <q-list
        v-if="props.attachments.length > 0 || scope.files.length > 0"
        separator
      >
        <q-item
          v-for="attachment in props.attachments"
          :key="`attachment_uploaded_${attachment.id}`"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_attach_file" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="full-width ellipsis">
              {{ attachment.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            top
            side
          >
            <q-item-label>
              <q-btn
                color="secondary"
                text-color="primary"
                icon="sym_o_cloud_download"
                size="md"
                class="q-mr-sm"
                @click="$helper.downloadAttachment(attachment)"
              />
              <q-btn
                color="secondary"
                text-color="primary"
                label="Delete"
                size="md"
                :loading="loadingDelete.find(id => id === attachment.id) !== undefined"
                @click="onDelete(attachment)"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="file in scope.files"
          :key="file.__key"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_pending" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="full-width ellipsis">
              {{ file.name }}
            </q-item-label>

            <q-item-label caption>
              Status: {{ file.__status }}
            </q-item-label>

            <q-item-label caption>
              {{ file.__sizeLabel }} / {{ file.__progressLabel }}
            </q-item-label>
          </q-item-section>

          <q-item-section
            top
            side
          >
            <q-btn
              color="secondary"
              text-color="primary"
              label="Cancel"
              size="md"
              @click="scope.removeFile(file)"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else>
        <div class="text-body2 text-toner">
          No attachments uploaded (click <q-icon name="sym_o_add_box" /> or drag file here to upload)
        </div>
      </div>
    </template>
  </q-uploader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QUploader } from 'quasar'
import { AttachmentInfo, FileUploadedResponse } from 'src/types'
import { useAuthStore } from 'stores/auth-store'
import FileApi from 'src/api/FileApi'
import { api } from 'boot/axios'
const auth = useAuthStore()

const fileUploader = ref<QUploader | null>(null)
const lastAutoRenewed = ref<number>(0)
const loadingDelete = ref<number[]>([])

const props = withDefaults(defineProps<{
  attachments?: AttachmentInfo[],
  accept?: string // allowed mime types https://quasar.dev/vue-components/uploader#restricting-upload
  maxFileSize?: number|string // in bytes
}>(), {
  attachments: <never>[],
  accept: '*/*',
  maxFileSize: 2073856 // 2MB
})

interface FileEvt {
  files: FileUploadedResponse[],
  xhr: XMLHttpRequest
}

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'uploaded', payload: FileEvt): void
  (event: 'uploadedOne', payload: AttachmentInfo): void
  (event: 'failed', payload: FileEvt): void
  (event: 'deleted', payload: AttachmentInfo): void
}>()

const authHeaders = computed(() => {
  return [{
    name: 'Authorization',
    value: `Bearer ${auth.accessToken}`
  }]
})

const onUploaded = (info: FileEvt) => {
  info.files.forEach((file) => {
    const info = JSON.parse(file.xhr.response)
    emit('uploadedOne', info)
  })

  fileUploader.value?.removeUploadedFiles()
}

const onFailed = (info: FileEvt) => {
  console.error('Upload failed', info.xhr)

  if (info.xhr.status === 401 && lastAutoRenewed.value < Date.now() - 10000) {
    lastAutoRenewed.value = Date.now()
    auth.renewToken()
      .then(() => {
        fileUploader.value?.upload()
      })
  }
}

const onDelete = async (attachment: AttachmentInfo) => {
  loadingDelete.value.push(attachment.id)
  await (new FileApi(api)).attachmentDelete(attachment.id)
    .finally(() => {
      loadingDelete.value = loadingDelete.value.filter((id) => id !== attachment.id)
    })
  emit('deleted', attachment)
}

</script>

<style scoped lang="scss">
.q-uploader {
  max-height: unset;
  width: 100%;
}
</style>
