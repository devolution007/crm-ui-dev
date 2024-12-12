<template>
  <q-btn
    dense
    no-caps
    unelevated
    :href="props.link"
    target="_blank"
    size="md"
    icon="sym_o_launch"
    @click.prevent="showDialog"
  >
    <q-tooltip
      :delay="300"
      class="text-body2"
      anchor="top middle"
    >
      {{ props.link }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { Dialog } from 'quasar'

const props = defineProps<{
  link: string
}>()

const showDialog = () => {
  Dialog.create({
    title: 'Be careful when clicking external links',
    message: 'It is better to open the link in a private window with the right click.'
  })
}
</script>

<style scoped>

</style>
