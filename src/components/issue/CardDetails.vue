<script setup lang="ts">
import { useIssueStore } from 'stores/issue-store'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store'
import { computed, ref } from 'vue'
import { AttachmentInfo } from 'src/types'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import useColorIconConstEntries from 'src/composables/useColorIconConstEntries'
import { constants } from 'boot/constants'

const props = defineProps<{
  customerId: number
  issueId: number
}>()

const editable = true
const loading = false

const authStore = useAuthStore()
const { t } = useI18n()

const issueStore = useIssueStore()
const { loading: issueLoading } = storeToRefs(issueStore)
issueStore.loadIssue(props.issueId, true)

const attachmentsDrafts = ref<AttachmentInfo[]>([])
const onAttachmentDraftDeleted = (attachment: AttachmentInfo) => {
  issueStore.loadIssue(props.issueId, true, true)
}

const onAttachmentDraftAdded = async (attachment: AttachmentInfo) => {
  await issueStore.updateFields({
    attachments: [attachment.id]
  }, true)

  onSuccessfulSave()
}

const attachments = computed(() => {
  return issueStore.issue?.attachments || []
})

const onSuccessfulSave = () => {
  Notify.create({
    message: t('issueUpdated'),
    type: 'positive'
  })
}

const onChangeInformedStatus = async (value: boolean) => {
  try {
    await issueStore.updateFields({ isMemberInformed: value })

    onSuccessfulSave()
  } catch (e) {
    Notify.create({
      message: t('failedToUpdateIssue'),
      type: 'negative'
    })
  }
}

const { getEntryByLabel: getIssueStatusByLabel } = useColorIconConstEntries(constants.ISSUE_STATUSES)
const { getEntryByLabel: getIssuePriorityByLabel } = useColorIconConstEntries(constants.ISSUE_PRIORITIES)
</script>

<template>
  <q-card>
    <q-card-section class="bg-toner">
      <div class="row items-center no-wrap">
        <div class="col">
          <bricks-page-title :padding="false">
            Issue #{{ props.issueId }}
          </bricks-page-title>
        </div>
        <div class="col-auto">
          <q-btn
            class="q-ml-sm"
            color="secondary"
            text-color="primary"
            round
            icon="sym_o_refresh"
            :loading="issueLoading"
            size="md"
            @click="issueStore.loadIssue(props.issueId, true)"
          />
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="bg-toner">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-7">
              <div class="text-h6">
                {{ $t('issueInformation') }}
              </div>
              <q-list>
                <bricks-details-list-line
                  :label="$t('createdOn')"
                  :show-data="!issueLoading"
                >
                  {{ $helper.dateEst(issueStore.issue?.createdAt) }}
                </bricks-details-list-line>

                <bricks-details-list-line
                  label="Resolve by"
                  :show-data="!issueLoading"
                >
                  {{ issueStore.issue?.resolvedBy }}
                </bricks-details-list-line>

                <bricks-details-list-line
                  :label="$t('createdBy')"
                  :show-data="!issueLoading"
                >
                  <tools-member-indicator
                    v-if="issueStore.issue?.member"
                    :member="issueStore.issue?.member"
                    show-name
                  />
                </bricks-details-list-line>

                <bricks-details-list-line
                  :label="$t('category')"
                  :show-data="!issueLoading"
                  :editable="!issueLoading"
                >
                  {{ issueStore.issue?.category }}
                  <template #item-section>
                    <issue-card-edit-category
                      v-if="issueStore.issue"
                      :issue-id="props.issueId"
                      @saved="onSuccessfulSave"
                    />
                  </template>
                </bricks-details-list-line>

                <bricks-details-list-line
                  label="Informed status"
                  :show-data="!issueLoading"
                >
                  <q-checkbox
                    v-if="issueStore.issue"
                    :model-value="issueStore.issue?.isMemberInformed"
                    :disable="issueLoading"
                    :true-value="true"
                    :false-value="false"
                    :label="$t('memberInformed')"
                    @update:model-value="onChangeInformedStatus($event)"
                  />
                </bricks-details-list-line>
              </q-list>
            </div>
            <div class="col-12 col-md-5">
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <bricks-details-list-line
                    :label="$t('status')"
                    :show-data="!issueLoading"
                    :editable="!issueLoading"
                  >
                    <q-chip
                      v-if="issueStore.issue && issueStore.issue?.status"
                      :color="getIssueStatusByLabel(issueStore.issue?.status as string)?.color || 'white'"
                      :label="issueStore.issue?.status"
                      text-color="dark"
                    />
                    <template #item-section>
                      <issue-card-edit-status
                        v-if="issueStore.issue"
                        :issue-id="props.issueId"
                        @saved="onSuccessfulSave"
                      />
                    </template>
                  </bricks-details-list-line>
                </div>
                <div class="col-6">
                  <bricks-details-list-line
                    :label="$t('priority')"
                    :show-data="!issueLoading"
                    :editable="!issueLoading"
                  >
                    <q-chip
                      v-if="issueStore.issue?.priority"
                      :color="getIssuePriorityByLabel(issueStore.issue?.priority as string)?.color || 'white'"
                      :label="issueStore.issue?.priority"
                      text-color="dark"
                    />
                    <template #item-section>
                      <issue-card-edit-priority
                        v-if="issueStore.issue"
                        :issue-id="props.issueId"
                        @saved="onSuccessfulSave"
                      />
                    </template>
                  </bricks-details-list-line>
                </div>
              </div>

              <q-card
                v-if="!issueLoading && issueStore.issue?.order"
                class="q-pa-md"
                flat
              >
                <order-info
                  v-if="!issueLoading && issueStore.issue?.order"
                  :order="issueStore.issue?.order"
                  :customer-id="props.customerId"
                />
              </q-card>
            </div>
          </div>

          <q-list>
            <bricks-details-list-line
              :label="$t('shortDescription')"
              :show-data="!issueLoading"
              :editable="!issueLoading"
            >
              <div class="white-space-pre">
                {{ issueStore.issue?.todo }}
              </div>
              <template #item-section>
                <issue-card-edit-description
                  v-if="issueStore.issue"
                  :issue-id="props.issueId"
                  @saved="onSuccessfulSave"
                />
              </template>
            </bricks-details-list-line>

            <q-field
              :label="$t('attachments')"
              :stack-label="true"
              class="q-mb-md"
            >
              <div class="q-pt-sm full-width">
                <app-attachments-upload
                  v-if="!issueLoading"
                  ref="attachmentsBox"
                  :attachments="attachments"
                  accept=".pdf,application/pdf,application/x-pdf,image/*"
                  @uploaded-one="onAttachmentDraftAdded"
                  @deleted="onAttachmentDraftDeleted"
                />
                <q-skeleton
                  v-else
                  class="q-mb-sm"
                  height="100px"
                  :count="1"
                />
              </div>
            </q-field>
          </q-list>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        Descriptions
      </div>
      <issue-description
        type="complaint"
        :title="$t('description')"
        :issue-id="props.issueId"
        :descriptions="issueStore.issue?.complaintDescriptionJson || []"
        @issue-changed="issueStore.loadIssue(props.issueId, true, true)"
      />

      <div class="text-h6 q-mb-md">
        Actions taken
      </div>
      <issue-description
        type="actions"
        :title="$t('descriptionOfActionTaken')"
        :issue-id="props.issueId"
        :descriptions="issueStore.issue?.actionsDescriptionJson || []"
        @issue-changed="issueStore.loadIssue(props.issueId, true, true)"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>
