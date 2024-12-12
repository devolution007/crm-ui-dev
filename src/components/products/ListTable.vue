<template>
  <div>
    <q-form
      ref="formRef"
      class="q-pb-lg"
      style="width: 100%"
      @submit="tableRef.requestServerInteraction()"
    >
      <div class="row q-col-gutter-sm">
        <div
          v-if="componentProps.type === 'item'"
          class="col col-sm-4 col-grow"
        >
          <q-select
            v-model="filters.category"
            label="Categories"
            :options="categories"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            multiple
            :loading="categories.length === 0"
            clearable
            input-debounce="0"
            @update:model-value="formRef.submit()"
          />
        </div>
        <div
          v-if="componentProps.type === 'item'"
          class="col col-sm-4 col-grow"
        >
          <q-select
            v-model="filters.plan"
            label="Health Plan Eligibility"
            :options="plans"
            option-value="code"
            option-label="name"
            emit-value
            map-options
            :loading="plansLoading"
            clearable
            input-debounce="0"
            @update:model-value="formRef.submit()"
          />
        </div>
        <div
          v-if="['item', 'gift'].includes(componentProps.type)"
          class="col col-sm-4"
        >
          <q-input
            v-model="filters.search"
            label="Search by name, SKU"
            clearable
            debounce="300"
          >
            <template #append>
              <div class="q-pr-xs">
                <q-btn
                  icon="search"
                  color="primary"
                  size="md"
                  :loading="loading"
                  type="submit"
                  @click="tableRef.requestServerInteraction()"
                />
              </div>
            </template>
          </q-input>
        </div>
      </div>

      <div
        v-if="componentProps.type === 'item'"
        class="row q-col-gutter-sm"
      >
        <div class="col">
          <q-input
            v-model="filters.activeIngredient"
            dense
            label="Active ingredient"
          />
        </div>
        <div class="col">
          <q-input
            v-model="filters.strength"
            dense
            label="Strength"
          />
        </div>
        <div class="col">
          <q-input
            v-model="filters.form"
            dense
            label="Form"
          />
        </div>
        <div class="col">
          <q-input
            v-model="filters.symptom"
            dense
            label="Symptom"
          />
        </div>
        <div class="col">
          <q-input
            v-model.number="filters.priceTo"
            dense
            label="Price to"
            clearable
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm q-pt-sm">
        <div class="col-auto col-grow q-pb-md">
          Found {{ pagination.rowsNumber }} products
        </div>
        <div class="col-auto">
          <transition
            appear
            enter-active-class="animated fadeInDown"
            leave-active-class="animated fadeOut"
          >
            <q-btn
              v-if="filtersHasValue"
              size="md"
              text-color="primary"
              color="secondary"
              icon="sym_o_clear"
              type="button"
              label="Clear"
              class="q-ml-auto"
              @click="clearFilters"
            />
          </transition>
        </div>
      </div>
    </q-form>
    <q-table
      ref="tableRef"
      v-model:pagination="pagination"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      binary-state-sort
      :rows-per-page-options="[15, 25, 50, 100]"
      separator="horizontal"
      :hide-header="true"
      wrap-cells
      flat
      @request="onRequest"
    >
      <template #body="props">
        <products-list-row
          :props="props"
          :customer-id="componentProps.customerId"
          @toggle-expand="props.expand = $event"
        >
          <template #actions>
            <q-btn
              v-if="props.row.options && props.row.options.length > 1"
              size="md"
              color="secondary"
              text-color="primary"
              :label="$t('options')"
              class="q-ml-sm"
              icon="sym_o_style"
              @click="createProductListDialog(props.row.options, $t('options'), componentProps.customerId, filters?.plan)"
            />
            <q-btn
              v-if="props.row.analogs.length > 0"
              size="md"
              color="secondary"
              text-color="primary"
              label="Analogs"
              icon="sym_o_alt_route"
              class="q-ml-sm"
              @click="createProductListDialog(props.row.analogs, 'Analogs', componentProps.customerId)"
            />
            <q-btn
              v-if="props.row.additional.length > 0"
              size="md"
              color="secondary"
              text-color="primary"
              label="Complementary prods"
              icon="sym_o_link"
              class="q-ml-sm"
              @click="createProductListDialog(props.row.additional, 'Complementary products', componentProps.customerId)"
            />
          </template>
        </products-list-row>
        <products-details-list-tr
          v-show="props.expand"
          :props="props"
        />
      </template>
      <template #pagination="props">
        <q-pagination
          v-model="pagination.page"
          :max="props.pagination.totalPages"
          max-pages="6"
          @update:model-value="$refs.tableRef?.requestServerInteraction()"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, reactive, Ref, ref, watch } from 'vue'
import { api } from 'boot/axios'
import { ElementaryEntity, ProductsFilter, SkuType, SortBy } from 'src/types'
import { useI18n } from 'vue-i18n'
import { QForm, QTable } from 'quasar'
import ProductApi from 'src/api/ProductApi'
import { ProductInterface } from 'src/models/ProductModel'
import useProduct from 'src/composables/useProduct'
import useInsurancePlansList from 'src/composables/useInsurancePlansList'
import { constants } from 'boot/constants'
import { useCustomerStore } from 'stores/customer-store'

const { t } = useI18n()

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  totalPages: 1,
  rowsPerPage: 15,
  rowsNumber: <number | undefined>-1
})

const columns = computed(() => [
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left' as 'left'
  },
  {
    field: 'actions',
    name: 'actions',
    label: t('actions'),
    align: 'left' as 'left'
  }
])

const componentProps = withDefaults(defineProps<{
  customerId: number
  type?: SkuType
}>(), {
  type: 'item'
})

const tableRef = ref(<QTable>{})
const formRef = ref(<QForm>{})
const loading = ref(false)
const listRepo = new ProductApi(api)
const sorting: Ref<SortBy[]> = ref([])
const rows = ref(<ProductInterface[]>[])

const { createProductListDialog } = useProduct()

const filtersDefault: ProductsFilter = {
  category: [],
  skus: undefined,
  search: '',
  type: componentProps.type,
  customerId: componentProps.customerId,
  activeIngredient: '',
  strength: '',
  form: '',
  symptom: '',
  priceTo: null
}

const filters: ProductsFilter = reactive(Object.assign({}, filtersDefault))

async function onRequest (props: any) {
  const {
    page,
    rowsPerPage,
    sortBy,
    descending
  } = props.pagination

  loading.value = true

  // Store requested sorting info
  const sortEntry = {} as SortBy
  sortEntry[sortBy] = descending ? 'desc' : 'asc'
  sorting.value = [
    sortEntry
  ]
  // Note: we are sending a full set of collected sorting variations to the server
  try {
    const response = await listRepo.getItems(page, filters, rowsPerPage)

    pagination.value.rowsNumber = response.totalItemCount
    pagination.value.totalPages = response.totalPages

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
}

const categories: Ref<ElementaryEntity[]> = ref([])
const categoriesLoad = async () => {
  try {
    categories.value = await listRepo.getCategories(componentProps.customerId || 0)
  } catch (e) {
    console.error(e)
  }
}
if (componentProps.type === 'item') {
  categoriesLoad()
}

const {
  plans,
  loading: plansLoading
} = useInsurancePlansList(constants.PROJECT_DOMAIN_METRO)

const filtersHasValue = computed(() => {
  for (const key in filters) {
    if (filters[key as keyof ProductsFilter] !== filtersDefault[key as keyof ProductsFilter]) {
      return true
    }
  }
  return false
})

const clearFilters = () => {
  Object.assign(filters, filtersDefault)
  tableRef.value.requestServerInteraction()
}

const customerStore = useCustomerStore()
const customer = customerStore.getCustomerLazy(
  computed(() => componentProps.customerId)
)
watch(customer, () => {
  autoFilterPlan()
})
const autoFilterPlan = () => {
  if (customer.value && customerStore.hasFeature('insurancePlans') && customer.value.insurancePlan) {
    filters.plan = customer.value.insurancePlan?.organizationPlanId
  }
}
onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
  autoFilterPlan()
})

</script>

<style scoped>

</style>
