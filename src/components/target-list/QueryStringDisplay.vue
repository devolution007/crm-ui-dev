<template>
  <q-banner
    rounded
    class="bg-grey-3 q-mt-sm"
    icon="mdi-codepen"
  >
    <span
      v-for="(item, index) in props.query"
      :key="index"
    >
      <q-chip v-if="item.leftBracket">{{ item.leftBracket && '(' }}</q-chip>
      <q-chip v-if="item.field">{{ item.field }}</q-chip>
      <q-chip v-if="item.operator">{{ item.operator }}</q-chip>
      <q-chip v-if="item.value">{{ item.value }}</q-chip>
      <q-chip v-if="item.rightBracket">{{ item.rightBracket && ')' }}</q-chip>
      <q-chip v-if="item.conjunction">{{ item.conjunction }}</q-chip>
    </span>

    <span class="current-expression">
      <q-chip
        v-if="expression.leftBracket"
        dark
      >{{ expression.leftBracket && '(' }}</q-chip>
      <q-chip
        v-if="expression.field"
        dark
      >{{ expression.field }}</q-chip>
      <q-chip
        v-if="expression.operator"
        dark
      >{{ expression.operator }}</q-chip>
      <q-chip
        v-if="expression.value"
        dark
      >{{ expression.value }}</q-chip>
      <q-chip
        v-if="expression.rightBracket"
        dark
      >{{ expression.rightBracket && ')' }}</q-chip>
      <q-chip
        v-if="expression.conjunction"
        dark
      >{{ expression.conjunction }}</q-chip>
    </span>
  </q-banner>
  <q-banner
    v-if="!!errorMessage"
    inline-actions
    class="text-white bg-red"
  >
    {{ errorMessage }}
  </q-banner>
</template>

<script setup lang="ts">
import { Expression } from 'components/target-list/constants'

const props = defineProps<{
  query: Expression[],
  expression: Expression,
  errorMessage?: string
}>()
</script>
