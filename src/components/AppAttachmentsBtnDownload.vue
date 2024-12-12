<template>
  <q-btn
    v-if="props.attachments.length > 0 && props.showType === 'menu'"
    icon="sym_o_perm_media"
    round
    text-color="text-toner"
    size="md"
  >
    <q-badge floating>
      {{ props.attachments.length }}
    </q-badge>
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item
          v-for="attachment in props.attachments"
          :key="`universal_link_attachment_${attachment.id}`"
          v-close-popup
          clickable
          @click="$helper.downloadAttachment(attachment)"
        >
          <q-item-section>{{ attachment.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <q-list v-if="props.attachments.length > 0 && props.showType === 'list'">
    <q-item
      v-for="attachment in props.attachments"
      :key="`universal_link_attachment_${attachment.id}`"
      clickable
      @click="$helper.downloadAttachment(attachment)"
    >
      <q-item-section avatar>
        <q-icon name="sym_o_perm_media" />
      </q-item-section>
      <q-item-section>
        <slot
          name="attachment-name"
          :attachment="attachment"
        >
          {{ attachment.name }}
        </slot>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { AttachmentInfo } from 'src/types'

const props = withDefaults(
  defineProps<{
    attachments: AttachmentInfo[],
    showType: 'menu' | 'list',
  }>(),
  {
    showType: 'menu'
  }
)
</script>
