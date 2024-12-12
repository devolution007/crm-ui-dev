<script setup lang="ts">
import { useCustomerStore } from 'stores/customer-store'
import { computed, ref } from 'vue'
import CustomerModel from 'src/models/CustomerModel'
import { useMembersStore } from 'stores/members-store'

const props = withDefaults(defineProps<{
  loading: boolean
  customer: CustomerModel
}>(), {
  loading: false
})
const customerStore = useCustomerStore()
const { fullListAsData: membersDate, fetchFullList: fetchMembersAttempt, isLoadingList: membersLoading } = useMembersStore()
fetchMembersAttempt()

const loading = ref(false)

const editRepresentative = async (representativeId: number) => {
  loading.value = true
  await customerStore.editRepresentative({
    representative: representativeId,
    customerId: props.customer.id
  })
  loading.value = false
}
</script>

<template>
  <q-item
    dense
    clickable
  >
    <q-item-section class="section-label">
      <q-item-label caption>
        {{ $t('representative') }}
      </q-item-label>
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-skeleton
          v-if="props.loading || loading"
          type="text"
        />
        <span v-else>
          {{ props.customer.member?.name || '-' }}
        </span>
      </q-item-label>
    </q-item-section>
    <q-popup-edit
      v-slot="scope"
      :model-value="props.customer.member?.id"
      buttons
      :cover="false"
      label-set="Save"
      :disable="props.loading"
      :validate="(val: string) => !(isNaN(Number(val)) || Number(val) < 0)"
      @save="editRepresentative"
    >
      <q-list>
        <q-item
          :key="0"
          v-ripple
          dense
          tag="label"
        >
          <q-item-section avatar>
            <q-radio
              v-model="scope.value"
              :val="0"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ 'None' }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="representative in membersDate"
          :key="`${representative.id}`"
          v-ripple
          dense
          tag="label"
        >
          <q-item-section avatar>
            <q-radio
              v-model="scope.value"
              :val="representative.id"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ representative.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-popup-edit>
  </q-item>
</template>

<style scoped>

</style>
