<template>
  <div class="row">
    <q-btn
      :disabled="customersIsLoading"
      value="("
      color="primary"
      class="q-mr-sm"
      @click="bracketClicked"
    >
      (
    </q-btn>
    <q-btn
      :disabled="customersIsLoading || isEmptyQuery"
      value=")"
      color="primary"
      class="q-mr-sm"
      @click="bracketClicked"
    >
      )
    </q-btn>

    <q-btn
      :disabled="customersIsLoading || isEmptyQuery"
      value="AND"
      color="primary"
      class="q-mr-sm"
      @click="conjunctionClicked"
    >
      AND
    </q-btn>
    <q-btn
      :disabled="customersIsLoading || isEmptyQuery"
      value="OR"
      color="primary"
      class="q-mr-sm"
      @click="conjunctionClicked"
    >
      OR
    </q-btn>

    <q-btn
      :disabled="!isOperatorAllowed('=') || customersIsLoading"
      value="="
      color="primary"
      class="q-mr-sm"
      @click.prevent="operatorClicked"
    >
      =
    </q-btn>
    <q-btn
      :disabled="!isOperatorAllowed('!=') || customersIsLoading"
      value="!="
      color="primary"
      class="q-mr-sm"
      @click="operatorClicked"
    >
      NOT =
    </q-btn>
    <q-btn
      :disabled="!isOperatorAllowed('>') || customersIsLoading"
      value=">"
      color="primary"
      class="q-mr-sm"
      @click="operatorClicked"
    >
      &gt;
    </q-btn>
    <q-btn
      :disabled="!isOperatorAllowed('<') || customersIsLoading"
      value="<"
      color="primary"
      class="q-mr-sm"
      @click="operatorClicked"
    >
      &lt;
    </q-btn>
    <q-btn
      :disabled="!isOperatorAllowed('>=') || customersIsLoading"
      value=">="
      color="primary"
      class="q-mr-sm"
      @click="operatorClicked"
    >
      &gt;=
    </q-btn>
    <q-btn
      :disabled="!isOperatorAllowed('<=') || customersIsLoading"
      value="<="
      color="primary"
      class="q-mr-sm"
      @click="operatorClicked"
    >
      &lt;=
    </q-btn>

    <q-btn
      :disabled="customersIsLoading || isEmptyQuery"
      color="negative"
      class="q-mr-sm"
      outline
      @click="emit('backspace')"
    >
      {{ $t('backspace') }}
    </q-btn>
    <q-btn
      :disabled="customersIsLoading || isEmptyQuery"
      color="negative"
      class="q-mr-sm"
      @click="emit('clear')"
    >
      {{ $t('deleteAll') }}
    </q-btn>
    <q-btn
      color="positive"
      class="q-mr-sm"
      icon="check"
      :title="$t('check')"
      :loading="customersIsLoading"
      @click="getCustomers"
    />
    <q-btn
      v-if="!!queryId"
      class="q-mr-sm"
      outline
      :disabled="customersIsLoading"
      :title="$t('updateQuery')"
      icon="update"
      @click="emit('updateQuery')"
    />
    <q-btn
      v-else
      color="dark"
      class="q-mr-sm"
      icon="save"
      outline
      :title="$t('saveQuery')"
      :disabled="customersIsLoading"
      @click="emit('saveQuery')"
    />
    <q-btn
      icon="download"
      :loading="preparingToDownload"
      :title="$t('downloadCustomers')"
      outline
      :disabled="customersIsLoading || customers.length === 0"
      @click="emit('downloadCustomers')"
    />
  </div>
</template>

<script setup lang="ts">
import targetListConstants, { Expression } from 'components/target-list/constants'
import CustomerModel from 'src/models/CustomerModel'
import { computed, ref } from 'vue'

const params = defineProps<{
  preparingToDownload: boolean,
  customers: CustomerModel[],
  queryId?: number|null,
  customersIsLoading: boolean,
  expression: Expression,
  queryBody: any
}>()

const loading = ref<boolean>(false)

const isEmptyQuery = computed(() =>
  params.queryBody.length === 0 && JSON.stringify(params.expression) === JSON.stringify(targetListConstants.TARGET_LIST_EMPTY_EXPRESSION))

const emit = defineEmits([
  'getCustomers',
  'conjunctionClicked',
  'bracketClicked',
  'operatorClicked',
  'backspace',
  'clear',
  'updateQuery',
  'saveQuery',
  'downloadCustomers'
])

function getCustomers () {
  loading.value = true
  emit('getCustomers')
}

function conjunctionClicked (event: any) {
  emit('conjunctionClicked', event.currentTarget.value)
}
function bracketClicked (event: any) {
  emit('bracketClicked', event.currentTarget.value)
}
function operatorClicked (event: any) {
  emit('operatorClicked', event.currentTarget.value)
}

function isOperatorAllowed (value: string): boolean {
  if (JSON.stringify(params.expression) === JSON.stringify(targetListConstants.TARGET_LIST_EMPTY_EXPRESSION)) {
    return false
  }
  const found = targetListConstants.TARGET_LIST_FULL_FIELDS.find(item => item.queryName === params.expression.field)
  if (found) {
    return found.operatorsAllowed.includes(value)
  }
  return false
}
</script>
