<template>
  <customer-card-line
    :loading="customerStore.isFetching"
    :editable="true"
    :label="$t('customerTagsLabel')"
    @edit-attempt="editModalShown = true"
  >
    <customer-card-tags
      :tags="customer.tags"
    />
  </customer-card-line>
  <app-dialog
    v-model="editModalShown"
    title="Tags"
    :show-actions="false"
    max-width="400px"
    min-width="400px"
  >
    <q-select
      v-model="model"
      outlined
      use-input
      input-debounce="0"
      label="Type a phrase"
      :options="filteredOptions"
      autocomplete="name"
      option-value="id"
      option-label="name"
      class="q-mb-md"
      :loading="loadingOptions"
      :disable="loadingAdd"
      :option-disable="option => (customer.tags || []).find(tag => tag.name === option.name) !== undefined"
      map-options
      emit-value
      :clearable="true"
      @filter="filterFn"
    >
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
      <template #after>
        <q-btn
          color="primary"
          label="Add"
          :loading="loadingAdd"
          :disable="!model"
          @click="addTag"
        />
      </template>
    </q-select>

    <customer-card-tags
      :tags="customer.tags"
      :enable-delete="true"
      size="lg"
      @removed-tag="model = $event"
    />
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import { useCustomerStore } from 'stores/customer-store'
import TagModel from 'src/models/TagModel'
import useTagsList from 'src/composables/useTagsList'
const { tags: tagsList, loading: loadingOptions } = useTagsList()

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.customer)

const editModalShown = ref(false)

const model = <Ref<number | null>>ref(null)

const loadingAdd = ref(false)

const filteredOptions = ref<TagModel[]>([])

const filterFn = (val: string, update: (call:() => void) => void) => {
  update(() => {
    filteredOptions.value = tagsList.value.filter((o: TagModel) => o.name.toLowerCase().includes(val.toLowerCase()))
  })
}

const addTag = async () => {
  loadingAdd.value = true
  await customerStore.addTag({
    customerId: customer.value.id,
    tagId: model.value as number
  })
  loadingAdd.value = false
  model.value = null
}
</script>
