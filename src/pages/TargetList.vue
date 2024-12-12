<template>
  <q-page padding>
    <app-dialog
      v-model="dialog"
      :close-button="false"
      :title="$t('valueForExpression')"
      min-width="500"
      :show-actions="false"
    >
      <q-input
        v-if="isInput"
        v-model.trim="inputValue"
        :type="isInput.type"
        :label="isInput.name"
        :placeholder="isInput.desc"
      />

      <q-select
        v-model="inputValue"
        :options="isSelect.options"
        :label="isSelect.name"
        outlined
        option-value="value"
        option-label="text"
        dense
        clearable
        emit-value
        map-options
      />

      <q-btn
        class="q-mt-lg q-mb-lg float-right"
        color="primary"
        @click="valueApplied"
      >
        {{ $t('apply') }}
      </q-btn>
    </app-dialog>
    <div class="column items-stretch col-grow q-mb-sm">
      <div class="q-table__title q-mb-md">
        {{ $t('targetList') }}
      </div>
      <q-card flat>
        <q-card-section>
          <q-form
            ref="filtersForm"
            class="row inline"
          >
            <div
              v-for="select in ajaxSelects"
              :key="select.queryName"
              class="q-mr-sm q-mb-sm"
              :style="`order: ${select.order}; min-width: 230px`"
            >
              <q-select
                :model-value="inputs[select.queryName + '=']"
                :loading="optionsLoading"
                :options="select.options"
                :label="select.name"
                :multiple="select.multiple"
                outlined
                option-value="value"
                option-label="text"
                dense
                clearable
                emit-value
                map-options
                @update:model-value="change(select.queryName, $event)"
              />
            </div>
            <div
              v-for="select in targetListConstants.TARGET_LIST_SELECT_FIELDS"
              :key="select.queryName"
              class="q-mr-sm q-mb-sm"
              :style="`order: ${select.order}; min-width: 230px`"
            >
              <q-select
                :model-value="inputs[select.queryName + '=']"
                :options="select.options"
                :label="select.name"
                outlined
                :multiple="select.multiple"
                option-value="value"
                option-label="text"
                dense
                clearable
                emit-value
                map-options
                @update:model-value="change(select.queryName, $event)"
              />
            </div>

            <div
              v-for="input in targetListConstants.TARGET_LIST_INPUT_FIELDS"
              :key="input.queryName"
              class="q-mr-sm q-mb-sm"
              :style="`order: ${input.order}; min-width: 230px`"
            >
              <q-input
                :model-value="inputs[input.queryName + '=']"
                :rules="input.rule"
                :placeholder="input.desc"
                :label="input.name"
                :type="input.type"
                multiple
                outlined
                clearable
                dense
                @update:model-value="change(input.queryName, $event)"
              >
                <q-menu>
                  <q-list>
                    <template v-for="(operator, key) in input.operatorsAllowed">
                      <q-item
                        v-if="operator!=='='"
                        :key="key"
                      >
                        <q-input
                          :model-value="inputs[input.queryName+operator]"
                          :items="input.options"
                          :label="input.name + ' ' + operator"
                          :type="input.type"
                          multiple
                          outlined
                          clearable
                          dense
                          @update:model-value="change(input.queryName, $event, operator)"
                        />
                      </q-item>
                    </template>
                  </q-list>
                </q-menu>
              </q-input>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <div class="row">
      <div class="col-9">
        <q-card
          flat
          class="q-mb-sm"
        >
          <q-card-section>
            <q-input
              v-model="queryName"
              :label="$t('queryName')"
              :error-message="serverErrors?.queryName"
              :error="!!serverErrors?.queryName"
            />
          </q-card-section>

          <q-card-section>
            <TargetListButtons
              :customers="customerPagination.items"
              :preparing-to-download="preparingToDownload"
              :query-id="queryId"
              :query-body="queryBody"
              :customers-is-loading="customersIsLoading"
              :expression="expression"
              @operator-clicked="operatorClicked"
              @bracket-clicked="bracketClicked"
              @conjunction-clicked="conjunctionClicked"
              @save-query="saveQuery"
              @update-query="saveQuery"
              @backspace="backspace"
              @clear="clear"
              @get-customers="getCustomers"
              @download-customers="downloadCsvCustomers"
            />

            <TargetListQueryStringDisplay
              :query="queryBody"
              :expression="expression"
              :error-message="serverErrors?.queryBody"
            />

            <TargetListCustomers
              v-if="customerPagination.totalItemCount"
              :customer-pagination="customerPagination"
              :loading="customersIsLoading"
              :query-body="queryBody"
              :query-id="queryId"
              @change-page="changePage"
            />
            <AppSkeletonTable v-if="customersIsLoading" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-3 q-mb-sm">
        <TargetListFields @field-clicked="fieldClicked" />
      </div>
    </div>

    <TargetListQueries
      v-if="queries.length!==0"
      v-model="queries"
      @edit-query="editQuery"
    />
    <AppSkeletonTable v-else />
  </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { helper } from 'boot/helper'
import { api } from 'boot/axios'
import { Notify, useMeta } from 'quasar'

import MemberApi from 'src/api/MemberApi'
import OrganizationApi from 'src/api/OrganizationApi'
import TargetListApi from 'src/api/TargetListApi'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import { PhcOrganizationModel } from 'src/models/PhcOrganizationModel'
import { InsurancePlanModel } from 'src/models/InsurancePlanModel'
import { CustomerList, SelectOptions } from 'src/types'
import MemberModel from 'src/models/MemberModel'
import StateModel from 'src/models/StateModel'
import TargetListModel from 'src/models/TargetListModel'
import targetListConstants, { Expression } from 'components/target-list/constants'
import { constants } from 'boot/constants'
import { useServerErrors } from 'src/composables/useServerErrors'
import { AxiosError } from 'axios'
import { useAttachment } from 'src/composables/useAttachment'
const organizationRepository: OrganizationApi = new OrganizationApi(api)
const memberRepository: MemberApi = new MemberApi(api)
const targetListRepository: TargetListApi = new TargetListApi(api)

const customersIsLoading = ref<boolean>(false)
const preparingToDownload = ref<boolean>(false)
const pagination:CustomerList = {
  totalItemCount: 0,
  totalPages: 0,
  items: []
}
const customerPagination = ref<CustomerList>({
  ...pagination
})
const queryId = ref<number | null>(null)
const queryName = ref<string | null>('test')
const queryBody = ref<Expression[]>([])
const inputValue = ref<string|null|boolean|number>(null)
const dialog = ref<boolean>(false)
const page = ref<number>(1)
const expression = ref<Expression>({ ...targetListConstants.TARGET_LIST_EMPTY_EXPRESSION })
const optionsLoading = ref<boolean>(false)
const queries = ref<TargetListModel[]>([])
const { serverErrors, processErrors } = useServerErrors()
const { download } = useAttachment()

useMeta({
  title: 'Target List'
})

interface IAjaxOptions {
  insurancePlans: SelectOptions[]
  phcOrganizations: SelectOptions[]
  organizations: SelectOptions[]
  states: SelectOptions[]
  members: SelectOptions[]
  issueCategories: any[]
  callCategories: any[]
  phcStates: SelectOptions[]
}

const isInput = computed(
  () => targetListConstants.TARGET_LIST_INPUT_FIELDS.find(item => item.queryName === expression.value.field)
)
const isSelect = computed(
  () => [...targetListConstants.TARGET_LIST_AJAX_SELECT_FIELDS, ...targetListConstants.TARGET_LIST_SELECT_FIELDS].find(item => item.queryName === expression.value.field)
)

const ajaxOptions = ref<IAjaxOptions>({
  insurancePlans: [],
  phcOrganizations: [],
  organizations: [],
  states: [],
  members: [],
  issueCategories: helper.parse(constants.ISSUE_CATEGORIES_LIST, false),
  callCategories: Object.entries(constants.CALL_CODES).map(item => ({ value: item[1], text: item[0] })),
  phcStates: constants.PHC_STATES.map(({ name, code }) => ({ value: code, text: name }))
})

const inputs = ref({})

const ajaxSelects = computed(() => {
  targetListConstants.TARGET_LIST_AJAX_SELECT_FIELDS.forEach((item: any) => {
    item.options = ajaxOptions.value[item.origin]
  })
  return targetListConstants.TARGET_LIST_AJAX_SELECT_FIELDS
})

function operatorClicked (operator: string) {
  expression.value.operator = operator
  dialog.value = true
}

function bracketClicked (bracket: string) {
  expression.value.leftBracket = bracket === '('
  expression.value.rightBracket = bracket === ')'
}

function conjunctionClicked (conjunction: string) {
  if (JSON.stringify(expression.value) === JSON.stringify(targetListConstants.TARGET_LIST_EMPTY_EXPRESSION)) {
    expression.value = queryBody.value.pop()
  }

  expression.value.conjunction = conjunction

  queryBody.value.push({ ...expression.value })
  resetExpression()
  inputValue.value = null
}

function fieldClicked (field: string) {
  expression.value.field = field
}

async function saveQuery () {
  try {
    serverErrors.value = {}
    if (queryId.value) {
      await targetListRepository.edit(queryId.value, prepareQuery(), queryName.value)
    } else {
      await targetListRepository.add(prepareQuery(), queryName.value)
    }
    queries.value = await targetListRepository.list()
    clear()
    Notify.create({
      color: 'green',
      textColor: 'white',
      message: 'Saved'
    })
  } catch (err: Error | AxiosError) {
    processErrors(err)
  }
}

function backspace () {
  if (JSON.stringify(expression.value) === JSON.stringify(targetListConstants.TARGET_LIST_EMPTY_EXPRESSION)) {
    expression.value = queryBody.value.length ? queryBody.value.pop() : { ...targetListConstants.TARGET_LIST_EMPTY_EXPRESSION }
  }

  expression.value && deleteElement(expression.value)
}

function deleteElement (expression: Expression) {
  if (expression.conjunction !== null) {
    expression.conjunction = null
  } else if (expression.rightBracket) {
    expression.rightBracket = false
  } else if (expression.value !== null) {
    expression.value = null
    inputValue.value = null
  } else if (expression.operator !== null) {
    expression.operator = null
  } else if (expression.field !== null) {
    expression.field = null
  } else if (expression.leftBracket) {
    expression.leftBracket = false
  }
}

function valueApplied () {
  inputValue.value = inputValue.value === true || inputValue.value === false ? String(inputValue.value) : inputValue.value
  expression.value.value = inputValue.value
  dialog.value = false
}

function clear () {
  resetData()
  expression.value = { ...targetListConstants.TARGET_LIST_EMPTY_EXPRESSION }
}

async function getCustomers () {
  customersIsLoading.value = true
  try {
    customerPagination.value = await targetListRepository.getCustomers({
      queryBody: prepareQuery(),
      page: page.value
    })
  } catch (err: Error | AxiosError) {
    processErrors(err)
  } finally {
    customersIsLoading.value = false
  }
}

async function downloadCsvCustomers () {
  preparingToDownload.value = true
  const attachment = await targetListRepository.createCsvLink({ queryBody: prepareQuery() })
  await download(attachment)
  preparingToDownload.value = false
}

function editQuery (query: any, name: string, id: number) {
  resetData()
  queryBody.value = query
  queryName.value = name
  queryId.value = id
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function prepareQuery (): Expression[] {
  const queryBodyCopy = [...queryBody.value]
  if (JSON.stringify(expression.value) !== JSON.stringify(targetListConstants.TARGET_LIST_EMPTY_EXPRESSION)) {
    queryBodyCopy.push({ ...expression.value })
  }

  inputValue.value = null
  return queryBodyCopy
}

function resetData (): boolean {
  resetExpression()
  queryBody.value = []
  queryName.value = null
  queryId.value = null
  customerPagination.value.items = []
  // this.$refs.filtersForm.reset()
  // this.$refs.filtersForm.resetValidation()
  return true
}

function resetExpression (): void {
  expression.value = { ...targetListConstants.TARGET_LIST_EMPTY_EXPRESSION }
}

async function getAjaxOptions () {
  try {
    optionsLoading.value = true
    const organizations = await organizationRepository.getOrganizations()
    const phcOrganizations = await organizationRepository.getPhcOrganizations()
    const insurancePlans = await organizationRepository.getInsurancePlans()
    const members = await memberRepository.getMembersForThisOrganization()
    ajaxOptions.value.insurancePlans = insurancePlans.map((item: InsurancePlanModel) => ({
      text: item.name,
      value: item.organizationPlanId
    }))
    ajaxOptions.value.members = members.map((item: MemberModel) => ({ text: item.name, value: item.id }))
    ajaxOptions.value.phcOrganizations = phcOrganizations.map((item: PhcOrganizationModel) => ({
      text: item.name,
      value: item.name
    }))
    ajaxOptions.value.organizations = organizations.map((item: InsuranceOrganizationModel) => ({
      text: item.domainPrefix,
      value: item.domainPrefix
    }))
    ajaxOptions.value.states = constants.USA_STATES.map((item: StateModel) => ({ text: item.name, value: item.code }))
  } finally {
    optionsLoading.value = false
  }
}

function changePage (p: number) {
  page.value = p
  getCustomers()
}

function change (field: string, values: string[], operator = '=') {
  customerPagination.value = { ...pagination }
  queryBody.value = queryBody.value.filter((item: Expression) => !(item.field === field && item.operator === operator))

  inputs.value[field + operator] = values

  if (Array.isArray(values)) {
    values.forEach((item: any, i: number) => {
      queryBody.value.push({
        field,
        operator,
        value: item,
        conjunction: (values.length - 1) === i ? null : 'OR',
        leftBracket: i === 0,
        rightBracket: (values.length - 1) === i
      })
    })
  } else {
    if (values === null) {
      // when customer deletes value we have to delete corresponding expression
      queryBody.value = queryBody.value.filter((item: Expression) => !(item.field === field && item.operator === operator))
    } else {
      queryBody.value.push({
        field,
        operator,
        value: values,
        conjunction: null,
        leftBracket: false,
        rightBracket: false
      })
    }
  }
  queryBody.value.map((item: Expression, i: number) => {
    item.conjunction = (queryBody.value.length - 1 !== i && item.conjunction === null) ? 'AND' : item.conjunction
    return item
  })
  // no conjunctions in the end of expression
  if (queryBody.value.length) {
    queryBody.value[queryBody.value.length - 1].conjunction = null
  }
}

onMounted(async () => {
  await getAjaxOptions()
  queries.value = await targetListRepository.list()
})
</script>
