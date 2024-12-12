<template>
  <div class="flex items-center">
    <q-chip>
      {{ formatChange(props.change.field, props.change.old) }}
    </q-chip>
    <q-icon name="arrow_right" />
    <q-chip
      color="green-2"
      text-color="dark"
    >
      {{ formatChange(props.change.field, props.change.new) }}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-case-declarations */
import { ActivityChangeInterface } from 'src/models/TaskModel'
import { PropType } from 'vue'
import { helper } from 'boot/helper'

const props = defineProps({
  change: {
    type: Object as PropType<ActivityChangeInterface>,
    required: true
  }
})

const formatChange = (field: string, value: unknown) => {
  switch (field) {
    case 'issue':
      if (!value) {
        return 'none'
      }
      const issue = value as { id: number, category: string, createdAt: string }
      return `#${issue.id} (${issue.category}, ${helper.dateUtc(issue.createdAt)})`
    case 'order':
      if (!value) {
        return 'none'
      }
      const order = value as { id: number, price: string, createdAt: string }
      return `#${order.id} ($${order.price}, ${helper.dateUtc(order.createdAt)})`
    case 'facility':
      if (!value) {
        return 'none'
      }
      const facility = value as { id: number, name: string }
      return `ID: ${facility.id} (${facility.name})`
    case 'staff':
      if (!value) {
        return 'none'
      }
      const staff = value as { id: number, name: string, email: string, phone: string }
      return `ID: ${staff.id} (${staff.name} ${staff.email || ''} ${staff.phone || ''})`
    case 'customer':
      if (!value) {
        return 'none'
      }
      const customer = value as { id: number, name: string, birthdateStr: string }
      return `ID: ${customer.id} (${customer.name} ${customer.birthdateStr})`
    case 'assignedTo':
      if (!value) {
        return 'none'
      }
      const assignedTo = value as { id: number, firstName: string, lastName: string }
      return `ID: ${assignedTo.id} ${assignedTo.firstName} ${assignedTo.lastName}`
    case 'targetList':
      if (!value) {
        return 'none'
      }
      const targetList = value as { id: number, name: string }
      return `ID: ${targetList.id} (${targetList.name})`
    default:
      if (!value) {
        return 'none'
      }
      return value
  }
}
</script>

<style scoped>

</style>
