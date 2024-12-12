<template>
  <q-btn
    v-if="props.productRequest.status === $constants.PRODUCT_REQUEST_STATUS_CREATED_CODE"
    color="secondary"
    text-color="primary"
    size="md"
    :loading="loading"
    @click="markToReviewCall(props.productRequest.id)"
  >
    <div>
      <q-icon
        name="sym_o_assignment_add"
        class="q-mr-sm"
      />
      <span>To review</span>
    </div>
  </q-btn>
  <div
    v-else
    class="q-gutter-sm"
  >
    <div
      v-if="!props.productRequest.isApproved"
    >
      <q-btn
        color="secondary"
        text-color="primary"
        size="md"
        @click="approveDialogCall"
      >
        <div>
          <q-icon
            name="sym_o_check_circle"
            class="q-mr-sm"
          />
          <span>{{ $t('approve') }}</span>
        </div>
      </q-btn>
    </div>
    <div
      v-if="!props.productRequest.isRejected"
    >
      <q-btn
        color="secondary"
        text-color="primary"
        size="md"
        @click="rejectDialogCall"
      >
        <div>
          <q-icon
            name="sym_o_do_not_disturb_on"
            class="q-mr-sm"
          />
          <span>{{ $t('reject') }}</span>
        </div>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import useProductRequest from 'src/composables/useProductRequest'
import { ProductRequestInterface } from 'src/models/ProductRequest'

const props = defineProps<{
  productRequest: ProductRequestInterface
}>()

const emit = defineEmits(['saved'])

const { loading, markToReview, openApproveDialog, openRejectDialog } = useProductRequest()

const markToReviewCall = async (id: number) => {
  await markToReview(id)
  emit('saved')
}

const approveDialogCall = async () => {
  (await openApproveDialog(props.productRequest.id))
    .onOk(() => {
      emit('saved')
    })
}

const rejectDialogCall = async () => {
  (await openRejectDialog(props.productRequest.id))
    .onOk(() => {
      emit('saved')
    })
}
</script>

<style scoped>

</style>
