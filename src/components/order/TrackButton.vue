<script setup lang="ts">
import { copyToClipboard, Notify } from 'quasar'

const props = defineProps({
  trackingCode: {
    type: String,
    required: true
  },
  trackingLink: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: false,
    default: undefined
  },
  textColor: {
    type: String,
    required: false,
    default: undefined
  }
})

const copyTrack = (trackCode: string) => {
  copyToClipboard(trackCode)
    .then(() => {
      Notify.create({
        message: 'Copied',
        color: 'positive',
        icon: 'done'
      })
    })
    .catch(() => {
      // fail
    })
}
</script>

<template>
  <q-btn-group
    :color="props.color"
  >
    <q-btn
      size="md"
      :label="props.trackingCode"
      :href="props.trackingLink"
      target="_blank"
      :color="props.color"
      :text-color="props.textColor"
    >
      <q-tooltip
        class="text-body2"
      >
        {{ $t('openTrackingLinkInNewTab') }}
      </q-tooltip>
    </q-btn>
    <q-btn
      icon="sym_o_content_copy"
      size="md"
      @click="copyTrack(props.trackingLink as string)"
      :color="props.color"
      :text-color="props.textColor"
    >
      <q-tooltip
        class="text-body2"
      >
        {{ $t('copyTrackingLink') }}
      </q-tooltip>
    </q-btn>
  </q-btn-group>
</template>

<style scoped>

</style>
