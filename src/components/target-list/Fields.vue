<template>
  <q-card
    outlined
    flat
  >
    <q-card-section>
      <div class="text-h6">
        {{ $t('fieldName') }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-list
        bordered
        separator
      >
        <q-item
          v-for="(field, index) in fields"
          :key="index"
          clickable
          @click="emit('fieldClicked', field.queryName)"
        >
          <q-item-section>
            <q-item-label overline>
              {{ field.name }}
            </q-item-label>
            <q-item-label class="overflow-hidden text-ellipsis">
              {{ field.queryName }}
              <q-tooltip
                :delay="300"
                class="text-body2">
                {{ field.queryName }}
              </q-tooltip>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import targetListConstants from 'components/target-list/constants'
import { computed } from 'vue'
const fields = computed(() => targetListConstants.TARGET_LIST_FULL_FIELDS.sort((a, b) => parseInt(a.order) < parseInt(b.order) ? -1 : 1))
const emit = defineEmits(['fieldClicked'])
</script>
