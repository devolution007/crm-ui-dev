<template>
  <span
    class="text-body2 "
    :class="color"
  >
    {{ status }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { constants } from 'boot/constants'

export default defineComponent({
  props: {
    status: {
      type: String,
      required: true
    },
    square: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    color (): string {
      return this.status === constants.ACTIVE_CUSTOMER_STATUS ? 'text-green-6' : 'text-orange-6'
    }
  }
})
</script>
