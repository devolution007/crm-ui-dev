<script setup lang="ts">

import { useIssueStore } from 'stores/issue-store'
import { Notify, QPopupEdit } from 'quasar'
import useColorIconConstEntries from 'src/composables/useColorIconConstEntries'
import { constants } from 'boot/constants'

const props = defineProps<{
  issueId: number
}>()

const emit = defineEmits<{
  (event: 'saved'): void
}>()

const issueStore = useIssueStore()
issueStore.loadIssue(props.issueId, true)

const { entries } = useColorIconConstEntries(constants.ISSUE_STATUSES)

const save = async (value: string) => {
  try {
    await issueStore.updateFields({
      status: value
    }, true)

    emit('saved')
  } catch (e) {
    Notify.create({
      message: 'Failed to save status',
      type: 'negative'
    })
  }
}
</script>

<template>
  <q-popup-edit
    v-if="!issueStore.loading"
    v-slot="scope"
    :model-value="issueStore?.issue?.status"
    buttons
    :cover="false"
    label-set="Save"
    @save="save"
  >
    <q-list>
      <q-item
        v-for="one in entries"
        :key="`color_${one.code}`"
        v-ripple
        dense
        tag="label"
      >
        <q-item-section avatar>
          <q-radio
            v-model="scope.value"
            :val="one.label"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-chip
              :color="one.color"
              square
              text-color="dark"
              class="q-ma-none"
              :label="one.label"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-popup-edit>
</template>

<style scoped>

</style>
