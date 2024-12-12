<template>
  <q-markup-table
    v-if="!!object"
    flat
    dense
  >
    <tbody>
      <tr
        v-for="(value, field) in props.object"
        :key="`cardResField${field}`"
      >
        <td class="text-deep-purple-5 q-mr-sm">
          {{ field }}
        </td>
        <td class="text-orange-10">
          <RawObjectOutput
            v-if="isObject(value)"
            :object="value"
            bordered
          />
          <div
            v-else
            class="white-space-pre-line"
          >
            {{ value }}
          </div>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup lang="ts">
import { is } from 'quasar'

const isObject = is.object

const props = defineProps<{
  object: Record<string, unknown>
}>()
</script>
