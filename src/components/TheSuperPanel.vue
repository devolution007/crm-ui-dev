<template>
  <q-dialog v-model="innerValue">
    <q-card style="min-width: 300px">
      <q-card-section>
        <q-input
          v-model="searchValue"
          autofocus
          hint="Type an Entity ID or / for commands list"
          clearable
          :loading="loading"
          @keyup.enter="selectItem(null, $router)"
          @keyup.down="selectNextIndex"
          @keyup.up="selectPrevIndex"
          @focus="selectOnFocus"
        />
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item
            v-for="(item, index) in selectionVariants"
            :key="item.id"
            clickable
            :active="index === activeIndex"
            active-class="bg-secondary text-primary"
            @click="selectItem(item, $router)"
          >
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label
                v-if="item.hint"
                caption
              >
                {{ item.hint }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import useSuperPanel from 'src/composables/useSuperPanel'

const { selectionVariants, loading, activeIndex, selectItem, searchValue, selectNextIndex, selectPrevIndex } = useSuperPanel()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const innerValue = <Ref<boolean>> ref(props.modelValue)
const selectOnFocus = (fEv: FocusEvent) => (fEv?.target as HTMLTextAreaElement).select()

watch(() => props.modelValue, (value) => {
  innerValue.value = value
})

watch(() => innerValue.value, (value) => {
  emits('update:modelValue', value)
})
</script>
