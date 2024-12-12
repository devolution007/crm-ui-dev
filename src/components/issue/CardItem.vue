<template>
  <q-item
    class="q-pa-none"
  >
    <q-item-section>
      <q-item-label class="flex">
        <q-btn
          color="primary"
          :to="{ name: 'customer-issue-details', params: { customerId: issue.customer.id, issueId: issue.id } }"
          :label="`Issue #${props.issue.id}`"
          size="md"
        />
        <q-space />
        <q-chip
          :color="getIssueStatusByLabel(issue.status).color"
          :label="issue.status"
          text-color="dark"
        />
        <q-chip
          :color="getIssuePriorityByLabel(issue.priority).color"
          :label="issue.priority"
          text-color="dark"
        />
      </q-item-label>
      <q-item-label>
        <div class="row q-col-gutter-md">
          <div class="col">
            <q-list class="q-list-dense-full">
              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    {{ $t('createdOn') }}
                  </q-item-label>
                  <q-item-label>{{ $helper.dateEst(issue.createdAt) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="issue.order"
                class="q-px-none"
              >
                <q-item-section>
                  <q-item-label caption>
                    Created by
                  </q-item-label>
                  <q-item-label>{{ issue.member.email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label caption>
                    Resolve by
                  </q-item-label>
                  <q-item-label>{{ issue.resolvedBy }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label caption>
                    Compliant category
                  </q-item-label>
                  <q-item-label>{{ issue.category }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div
            v-if="!!props.withOrder"
            class="col"
          >
            <OrderInfo
              v-if="props.issue.order"
              :order="props.issue.order"
              :customer-id="props.issue.customer.id"
            />
          </div>
          <div class="col">
            <q-list dense>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label caption>
                    Short description
                  </q-item-label>
                  <q-item-label class="word-break">
                    {{ issue.todo }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section>
                  <q-item-label caption>
                    Attachments
                  </q-item-label>
                  <q-item-label>
                    <q-btn
                      v-for="attachment in issue.attachments"
                      :key="attachment.id"
                      color="secondary"
                      text-color="primary"
                      icon="cloud_download"
                      size="md"
                      :label="attachment.name"
                      @click="$helper.downloadAttachment(attachment)"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import IssueModel from 'src/models/IssueModel'
import useColorIconConstEntries from 'src/composables/useColorIconConstEntries'
import { constants } from 'boot/constants'

const props = defineProps<{
  issue: IssueModel,
  withOrder?: boolean
}>()

const { getEntryByLabel: getIssueStatusByLabel } = useColorIconConstEntries(constants.ISSUE_STATUSES)
const { getEntryByLabel: getIssuePriorityByLabel } = useColorIconConstEntries(constants.ISSUE_PRIORITIES)
</script>

<style scoped>
  .word-break{
    word-break: break-all;
  }
</style>
