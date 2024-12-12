<template>
  <q-page>
    <bricks-top-back-button
      :label="$t('backToCustomerIssues')"
      :to="{ name: 'customer-issues' }"
    />
    <q-card>
      <q-card-section>
        <bricks-page-title>{{ $t('addANewIssue') }}</bricks-page-title>

        <q-form
          ref="form"
          class="row"
          @submit.prevent="submit"
        >
          <div class="full-width">
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <q-select
                  v-model="formData.priority"
                  :error-message="serverErrors?.priority"
                  :error="!!serverErrors?.priority"
                  :options="prioritiesList"
                  outlined
                  option-value="label"
                  option-label="label"
                  :label="$t('priority')"
                  emit-value
                  map-options
                />
              </div>
              <div class="col-4">
                <q-select
                  v-model="formData.status"
                  :error-message="serverErrors?.status"
                  :error="!!serverErrors?.status"
                  :options="statusesList"
                  outlined
                  option-value="label"
                  option-label="label"
                  :label="$t('status')"
                  emit-value
                  map-options
                />
              </div>
            </div>
          </div>

          <q-select
            v-model="formData.category"
            :error-message="serverErrors?.category"
            :error="!!serverErrors?.category"
            :options="issueCategories"
            outlined
            option-value="name"
            option-label="name"
            option-disable="disabled"
            :label="$t('category')"
            clearable
            emit-value
            map-options
            class="col-12 q-mr-md"
          />

          <q-select
            v-model="formData.orderId"
            outlined
            clearable
            :error="!!serverErrors?.orderId"
            :error-message="serverErrors.orderId"
            :options="orderIdsOptions"
            :loading="orderIdsLoading"
            :label="$t('inputOrderId')"
            option-value="code"
            option-label="name"
            emit-value
            map-options
            use-input
            input-debounce="0"
            class="col-8 q-mb-md"
            @filter="filter"
          />

          <q-checkbox
            v-show="formData.orderId"
            v-model="showRows"
            :error-message="serverErrors?.orderId"
            :error="!!serverErrors?.orderId"
            class="col-4 q-mb-md"
            :label="$t('showProductsInOrder')"
          />
          <q-markup-table
            v-if="showRows && ordersRows.length"
            class="col-12 q-mb-md"
          >
            <tr>
              <th />
              <th class="text-left">
                {{ $t('name') }}
              </th>
              <th class="text-left">
                {{ $t('sku') }}
              </th>
              <th class="text-left">
                {{ $t('qty') }}
              </th>
              <th class="text-left">
                {{ $t('price') }}, $
              </th>
            </tr>
            <IssueOrderRow
              v-for="(item, key) in ordersRows"
              :key="key"
              :row="item"
            />
          </q-markup-table>

          <IssueTodoField
            v-model="formData.todo"
            class="col-12 q-mb-md"
            :error-messages="serverErrors.todo"
          />

          <q-input
            v-model="formData.complaintDescriptionJson"
            :error-message="serverErrors?.complaintDescriptionJson"
            :error="!!serverErrors?.complaintDescriptionJson"
            type="textarea"
            :label="$t('description')"
            rows="2"
            outlined
            class="col-12 q-mb-md"
          />

          <q-checkbox
            v-model="formData.isCallWithRepresentative"
            :error-message="serverErrors?.isCallWithRepresentative"
            :error="!!serverErrors?.isCallWithRepresentative"
            :label="$t('conferenceCallWithMemberRepresentative')"
            class="col-12 q-mb-md"
          />

          <q-field
            :label="$t('attachments')"
            :stack-label="true"
            class="col-12 q-mb-lg"
          >
            <div class="q-pt-md full-width">
              <app-attachments-upload
                ref="attachmentsBox"
                :attachments="formData.attachments"
                @uploaded-one="formData.attachments.push($event)"
                @deleted="onAttachmentDeleted"
              />
            </div>
          </q-field>

          <div class="col-12">
            <q-btn
              class="float-right"
              color="primary"
              type="submit"
              :loading="submitting"
              :disable="callStore.callIsLoading"
            >
              {{ $t('createIssue') }}
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { useCall } from 'stores/call'
import { onMounted, ref, watch } from 'vue'
import OrderApi from 'src/api/OrderApi'
import { constants } from 'boot/constants'
import { api } from 'boot/axios'
import { useRoute, useRouter } from 'vue-router'
import IssueApi from 'src/api/IssueApi'
import { AttachmentInfo, IssueAddForm, orderRowsForm } from 'src/types'
import { Notify, useMeta } from 'quasar'
import { AxiosError } from 'axios'
import { useServerErrors } from 'src/composables/useServerErrors'
import useColorIconConstEntries from 'src/composables/useColorIconConstEntries'
import useIssueCategories from 'src/composables/useIssueCategories'

const callStore = useCall()
const { serverErrors, processErrors } = useServerErrors()
const route = useRoute()
const router = useRouter()

const orderRepository = new OrderApi(api)
const issueRepository = new IssueApi(api)

const orderIdsLoading = ref<boolean>(false)
const rowsLoading = ref<boolean>(false)
const submitting = ref<boolean>(false)
const showRows = ref<boolean>(false)

const orderIds = ref<number[]>([])
const orderIdsOptions = ref<number[]>([])
const ordersRows = ref<orderRowsForm[]>([])
const { issueCategories } = useIssueCategories()

const formData = ref<IssueAddForm>({
  todo: undefined,
  complaintDescriptionJson: undefined,
  category: undefined,
  isCallWithRepresentative: false,
  customerId: Number(route.params.customerId),
  orderId: undefined,
  callId: undefined,
  attachments: [],
  status: 'New',
  priority: 'Medium'
})

useMeta({
  title: 'Add Issue'
})

async function submit () {
  try {
    submitting.value = true
    serverErrors.value = {}
    formData.value.callId = callStore.call.id
    await issueRepository.add(formData.value)
    Notify.create({
      message: 'Data has been added',
      type: 'positive'
    })
    await router.push(`/customers/${route.params.customerId}/issues`)
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    submitting.value = false
  }
}
function filter (val: string, update: any) {
  update(() => {
    orderIdsOptions.value = [...orderIds.value]
    orderIdsOptions.value = orderIdsOptions.value.filter((v: number) => v.toString().indexOf(val) > -1)
  })
}
async function getRows (): Promise<void> {
  rowsLoading.value = true
  const order = await orderRepository.getOrder(Number(formData.value.orderId))
  const fetchedOrdersRows = order.rows
  ordersRows.value = fetchedOrdersRows.map((item: any) => {
    item.isSelected = false
    return item
  })
  rowsLoading.value = false
}

function onAttachmentDeleted (attachment: AttachmentInfo) {
  formData.value.attachments = formData.value.attachments.filter(item => item.id !== attachment.id)
}

const { entries: prioritiesList } = useColorIconConstEntries(constants.ISSUE_PRIORITIES)
const { entries: statusesList } = useColorIconConstEntries(constants.ISSUE_STATUSES)

onMounted(async () => {
  orderIdsLoading.value = true
  orderIds.value = await orderRepository.getIds(Number(route.params.customerId))
  orderIdsLoading.value = false
})

watch(() => formData.value.orderId, () => {
  if (formData.value.orderId) {
    getRows()
  }
})
</script>
