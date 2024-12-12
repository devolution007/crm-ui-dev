<template>
  <q-avatar
    v-if="props.member"
    v-bind="props"
    :class="props.class"
  >
    {{ memberAvaLabel }}
    <q-tooltip
      v-if="props.showTooltip"
      class="text-body2"
    >
      {{ memberLabel }}
    </q-tooltip>
  </q-avatar>
  <q-avatar
    v-else
    v-bind="props"
    color="grey-6"
    :class="props.class"
  >
    <q-icon
      name="sym_o_account_circle"
      :size="iconSize"
    />
    <q-tooltip
      v-if="props.showTooltip"
      class="text-body2"
    >
      {{ memberLabel }}
    </q-tooltip>
  </q-avatar>
  <span
    v-if="props.showName"
    class="q-pl-xs"
  >{{ memberLabel }}</span>
</template>

<script setup lang="ts">
import { MemberBasicInterface } from 'src/models/MemberModel'
import { computed, readonly } from 'vue'
import { QAvatarProps } from 'quasar'

interface MemberIndicatorProps extends QAvatarProps {
  member?: MemberBasicInterface
  showName?: boolean
  showTooltip?: boolean
  size?: string | undefined
  fontSize?: string | undefined
  color?: string | undefined
  textColor?: string | undefined
  class?: string | undefined
}

const props = withDefaults(defineProps<MemberIndicatorProps>(), {
  showName: false,
  showTooltip: true,
  size: 'sm',
  fontSize: '12px',
  color: 'primary',
  textColor: 'white',
  class: ''
})

const memberAvaLabel = computed(() => {
  if (!props.member) {
    return ''
  }
  return `${props.member.firstName[0] || '-'}${props.member.lastName[0] || '-'}`
})
const memberLabel = computed(() => {
  if (!props.member) {
    return 'Not assigned'
  }
  return `${props.member.firstName || '-'} ${props.member.lastName || '-'}`
})

const iconSize = computed(() => {
  if (props.size === 'sm') {
    return '20px'
  }
  if (props.size === 'md') {
    return '26px'
  }
  if (props.size === 'lg') {
    return '30px'
  }
  if (props.size === 'xl') {
    return '38px'
  }
  return '12px'
})

</script>
