<template>
  <q-item
    dense
    clickable
    @click="editModalShown = true"
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('language') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="customerStore.isFetching || loading"
          type="text"
        />
        <span
          v-else-if="customerStore.primaryLanguage"
        >
          {{
            getUnicodeFlagIcon(customerStore.primaryLanguage.iso === 'en' ? 'us' : customerStore.primaryLanguage.iso)
          }}
          {{ customerStore.primaryLanguage.name }}
        </span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon
        v-if="!customerStore.isFetching"
        color="grey"
        name="sym_o_edit"
      />
    </q-item-section>
    <app-dialog
      v-model="editModalShown"
      :title="$t('languages')"
      :show-actions="false"
      min-width="500px"
      max-width="600px"
    >
      <q-list>
        <q-item
          v-for="language in workingLanguages"
          :key="`customer-language-${customer.id}-${language.iso}`"
          dense
        >
          <q-item-section top>
            <q-item-label caption>
              {{ $t('language') }}
            </q-item-label>
            <q-select
              v-model="language.iso"
              :disable="loading"
              dense
              :options="constants.LANGUAGES"
              :option-disable="option => workingLanguages.find(l => l.iso === option.iso) !== undefined"
              map-options
              emit-value
              option-value="iso"
              option-label="name"
            >
              <template #selected>
                {{ getUnicodeFlagIcon(language.iso === 'en' ? 'us' : language.iso) }}
                {{ language.name }}
              </template>
            </q-select>
          </q-item-section>
          <q-item-section top>
            <q-item-label caption>
              Type
            </q-item-label>
            <q-select
              v-model="language.type"
              :rules="[v => v === 'primary' || v === 'secondary' || 'Incorrect value']"
              :disable="loading"
              dense
              :options="[
                {value: 'primary', text: 'Primary'},
                {value: 'secondary', text: 'Secondary'},
              ]"
              :option-disable="option => option.value === 'secondary' && customer.languages.find(l => l.type === 'primary') === undefined"
              map-options
              emit-value
              option-value="value"
              option-label="text"
            />
          </q-item-section>
          <q-item-section side>
            <div class="row">
              <q-btn
                :loading="loading"
                icon="sym_o_save"
                size="md"
                @click="saveLanguage(language)"
              />
              <q-btn
                v-if="workingLanguages.length > 1 && customer.languages.length > 1 && customer.languages.find(l => l.iso === language.iso) !== undefined"
                :loading="loading"
                icon="sym_o_delete"
                size="md"
                @click="removeLanguage(language)"
              />
            </div>
          </q-item-section>
        </q-item>
        <q-item dense>
          <q-btn
            :disable="! canBeAdded"
            icon="sym_o_add_box"
            @click="addLanguage"
          />
        </q-item>
      </q-list>
    </app-dialog>
  </q-item>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useCustomerStore } from 'stores/customer-store'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import LanguageModel from 'src/models/LanguageModel'
import { constants } from 'boot/constants'
import { helper } from 'boot/helper'

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const loading = ref(false)
const editModalShown = ref(false)

const workingLanguages = <Ref<LanguageModel[]>>ref([])

watch(() => customer.value.id, () => {
  workingLanguages.value = helper.clone(customer.value.languages) as LanguageModel[]
})

watch(() => editModalShown.value, () => {
  if (editModalShown.value) {
    workingLanguages.value = helper.clone(customer.value.languages) as LanguageModel[]
  }
})

const canBeAdded = computed(() => {
  return workingLanguages.value.length < constants.LANGUAGES.length
})

const addLanguage = async () => {
  const notAddedLanguage = constants.LANGUAGES.find(language => {
    return !workingLanguages.value.find(workingLanguage => workingLanguage.iso === language.iso)
  })

  if (notAddedLanguage) {
    const prototype = new LanguageModel(notAddedLanguage)

    const hasPrimary = workingLanguages.value.find(language => language.type === 'primary')
    if (!hasPrimary) {
      prototype.type = 'primary'
    } else {
      prototype.type = 'secondary'
    }

    workingLanguages.value.push(prototype)
  }
}

const removeLanguage = async (language: LanguageModel) => {
  loading.value = true

  await customerStore.removeLanguage({
    language: language.iso,
    customerId: customer.value.id
  })
  workingLanguages.value = helper.clone(customer.value.languages) as LanguageModel[]

  loading.value = false
}

const saveLanguage = async (language: LanguageModel) => {
  loading.value = true
  await customerStore.editLanguage({
    language: language.iso,
    customerId: customer.value.id,
    type: language.type
  })
  loading.value = false
}
</script>
