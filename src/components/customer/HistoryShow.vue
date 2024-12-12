<template>
  <div class="q-pb-md">
    <q-banner class="bg-amber-1 text-brown shadow-1 q-my-lg" rounded>
      <q-icon
        name="sym_o_engineering"
        size="md"
      />
      Not all events are collected yet.
      <br>
      You can tell to development team what type of customer-related events you would like to see on this page by sending us message in slack.
    </q-banner>

    <q-card>
      <q-card-section>
        <div class="absolute-top-right q-pa-md z-index-2">
          <q-btn
            color="secondary"
            text-color="primary"
            round
            size="md"
            icon="sym_o_refresh"
            :loading="loading"
            @click="loadPage(pagination.page)"
          />
        </div>

        <q-timeline v-if="! loading">
          <q-timeline-entry
            v-for="entry in rows"
            :key="entry.guid"
            :title="entry.eventCode"
            :subtitle="$helper.dateEst(entry.createdAt)"
            side="left"
          >
            <div>
              <div>
                {{ entry.eventDescription }}
              </div>

              <div v-if="entry.member">
                <span>by </span>
                <tools-member-indicator
                  :member="entry.member"
                  show-name
                  :show-tooltip="false"
                />
              </div>

              <div
                v-if="entry.order"
                class="q-pt-md"
              >
                <q-btn
                  color="primary"
                  size="md"
                  :to="{ name: 'customer-order-details', params: { orderId: entry.order.id, customerId: props.customerId } }"
                >
                  Order #{{ entry.order.id }} ({{ $helper.formatPrice(entry.order.price) }} - {{ entry.order.statusName }})
                </q-btn>
              </div>

              <div class="q-pt-md">
                <bricks-raw-object-output :object="entry.attributes" />
              </div>
            </div>
          </q-timeline-entry>
        </q-timeline>

        <customer-history-timeline-skeleton v-if="loading" />
      </q-card-section>
    </q-card>

    <q-page-sticky
      position="bottom"
      :offset="[0, 18]"
    >
      <app-custom-pagination
        class="bg-page q-pa-sm rounded-borders shadow-1"
        :loading="loading"
        :model-value="pagination.page"
        :total-pages="totalPages"
        :total-item-count="pagination.rowsNumber"
        @update:model-value="loadPage($event)"
      />
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed, onMounted, reactive, Ref, ref, UnwrapRef } from 'vue'
import { api } from 'boot/axios'
import CustomerApi from 'src/api/CustomerApi'
import { TimelineEntry, TimelineFilter } from 'src/models/Timeline'
import CustomerHistory from 'pages/customers/CustomerHistory.vue'

const props = defineProps<{
  customerId: number
}>()

const cStore = useCustomerStore()
cStore.init(props.customerId)

const loading = ref(false)
const rows: Ref<TimelineEntry[]> = ref([])
const listRepo = new CustomerApi(api)

const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: <number>-1
})
const totalPages = computed(() => {
  if (pagination.value.rowsNumber === -1) {
    return 1
  }

  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
})

const filtersDefault: TimelineFilter = {
  member: null
}

const filters: TimelineFilter = reactive({
  ...filtersDefault
})

async function onRequest (tableProps: { pagination: UnwrapRef<typeof pagination> }) {
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = tableProps.pagination

  loading.value = true

  const sorting: Record<string, 'asc' | 'desc'> = {}
  sorting[sortBy] = descending ? 'desc' : 'asc'
  try {
    const response = await listRepo.getTimelineList(props.customerId, page, filters, sorting, rowsPerPage)

    pagination.value.rowsNumber = response.totalItemCount as number

    rows.value.splice(0, rows.value.length, ...response.items)
  } catch (e) {
    console.error(e)
  } finally {
    // ...and turn of loading indicator
    loading.value = false
  }

  // don't forget to update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  // scroll to top
  window.scrollTo(0, 0)
}

const loadPage = (page: number) => {
  pagination.value.page = page
  onRequest({
    pagination: pagination.value
  })
}

onMounted(() => {
  loadPage(1)
})
</script>

<style scoped>

</style>
