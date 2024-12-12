<script setup lang="ts">

import { useIssueStore } from 'stores/issue-store'
import { Notify, QPopupEdit } from 'quasar'
import useColorIconConstEntries from 'src/composables/useColorIconConstEntries'
import { constants } from 'boot/constants'
import { is } from 'quasar'
const props = defineProps<{
  issueId: number
}>()

const emit = defineEmits<{
  (event: 'saved'): void
}>()

const issueStore = useIssueStore()
issueStore.loadIssue(props.issueId, true)

const entries = constants.ISSUE_CATEGORIES_LIST

const save = async (value: string) => {
  try {
    await issueStore.updateFields({
      category: value
    }, true)

    emit('saved')
  } catch (e) {
    Notify.create({
      message: 'Failed to save category',
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
    <q-list class="overflow-auto max-h-400">
      <template
        v-for="(one, key) in entries"
        :key="`card_edit_category_${key}`"
      >
        <template
          v-if="is.object(one)"
        >
          <q-item-label header>{{key}}</q-item-label>

          <q-item
            v-for="(oneChild) in one"
            :key="`card_edit_category_child_${oneChild}`"
            v-ripple
            dense
            tag="label"
          >
            <q-item-section avatar>
              <q-radio
                v-model="scope.value"
                :val="oneChild"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ oneChild }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <q-item
          v-else
          v-ripple
          dense
          tag="label"
        >
          <q-item-section avatar>
            <q-radio
              v-model="scope.value"
              :val="key"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ key }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-popup-edit>
</template>

<style scoped>

</style>
