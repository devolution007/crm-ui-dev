<template>
  <div class="col-12 col-lg-6">
    <q-card>
      <div
        class="row justify-between no-wrap"
      >
        <div v-if="props.edit">
          <q-chip
            v-if="item.deleted"
            label="Deleted"
            square
            color="negative"
          />
          <q-btn-dropdown
            v-if="!item.deleted"
            :color="item.valid ? 'light-green-3' : 'red-2'"
            :text-color="item.valid ? 'light-green-10' : 'red-10'"
            :label="item.valid ? 'Valid address' : 'Invalid address'"
            size="md"
            :loading="loadingValidity"
          >
            <q-list>
              <q-item
                v-if="item.valid"
                v-close-popup
                clickable
                @click="makeAddressInvalid"
              >
                <q-item-section>
                  <q-item-label>Make invalid</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                v-if="!item.valid"
                v-close-popup
                clickable
                @click="makeAddressValid"
              >
                <q-item-section>
                  <q-item-label>Make valid</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div v-else />

        <div class="">
          <q-btn
            v-if="props.selectMode && !item.deleted"
            size="md"
            :label="props.selected ? 'Selected for delivery' : 'Select'"
            color="primary"
            :icon="props.selected ? 'check' : 'sym_o_package'"
            :flat="props.selected"
            @click="onSelected"
          />
          <q-btn
            v-if="props.edit"
            size="md"
            label="Edit"
            @click="emit('editCall', item)"
          />
          <q-btn
            v-if="!item.deleted && props.edit"
            size="md"
            label="Delete"
            :loading="loading"
            @click="deleteAddress"
          />
          <q-btn
            v-if="item.deleted && props.edit"
            size="md"
            color="primary"
            label="Restore"
            :loading="loading"
            @click="restoreAddress"
          />
        </div>
      </div>
      <q-card-section>
        <div
          v-if="props.item.type==='facility'"
          class="text-weight-bold q-mb-sm"
        >
          {{ props.item.company }}
        </div>
        <div class="text-weight-bold q-mb-sm">
          {{ props.item.firstName }} {{ props.item.lastName }}
        </div>

        <address-output
          v-if="props.item"
          :entry="props.item"
        />

        <p class="q-my-sm">
          {{ props.item.phone }}
        </p>
        <q-separator v-if="props.item.note" />
        <p
          v-if="props.item.note"
          class="q-my-sm"
        >
          {{ props.item.note }}
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import AddressModel from 'src/models/AddressModel'
import { ref } from 'vue'
import { useCustomerStore } from 'stores/customer-store'

const props = withDefaults(defineProps<{
  item: AddressModel,
  edit: boolean,
  selectMode?: boolean
  selected?: boolean
}>(), {
  edit: false,
  selectMode: false,
  selected: false
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'editCall', item: AddressModel): void,
  (event: 'select', item: string): void
}>()

const customerStore = useCustomerStore()

const loading = ref(false)
const loadingValidity = ref(false)

const makeAddressInvalid = async () => {
  loadingValidity.value = true
  await customerStore.makeAddressInvalid({ addressId: props.item.id })
    .finally(() => {
      loadingValidity.value = false
    })
}

const makeAddressValid = async () => {
  loadingValidity.value = true
  await customerStore.makeAddressValid({ addressId: props.item.id })
    .finally(() => {
      loadingValidity.value = false
    })
}

const deleteAddress = async () => {
  loading.value = true
  await customerStore.removeAddress({ id: props.item.id })
    .finally(() => {
      loading.value = false
    })
}

const restoreAddress = async () => {
  loading.value = true
  await customerStore.undeleteAddress({ id: props.item.id })
    .finally(() => {
      loading.value = false
    })
}

const onSelected = () => {
  emit('select', props.item.id)
}
</script>
