<template>
  <q-item
    class="q-mt-md"
    :clickable="props.editable"
    @click="editClick"
  >
    <q-item-section side>
      <q-icon :name="props.icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        {{ props.label }}
      </q-item-label>
    </q-item-section>
    <slot name="actions">
      <q-item-section
        v-if="props.editable"
        side
      >
        <q-icon
          color="grey"
          name="sym_o_edit"
        />
      </q-item-section>
    </slot>
  </q-item>
  <app-dialog
    v-if="props.editable"
    v-model="dialogOpen"
    :title="props.label"
    :min-width="modalMinWidth"
  >
    <slot
      name="edit"
      :dialog-open="dialogOpen"
    />
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

interface Props {
  label: string
  icon: string
  editable?: boolean
  editCall?: null | (() => void)
  useOptimalModalWidth?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  editable: false,
  useOptimalModalWidth: false,
  editCall: null
})

const dialogOpen = ref(false)

const deviceOptimalMinWidth = computed(() => {
  const $q = useQuasar()
  if ($q.screen.gt.md) {
    return '1000'
  } else {
    return '320'
  }
})

const modalMinWidth = computed(() => {
  if (props.useOptimalModalWidth) {
    return deviceOptimalMinWidth.value
  } else {
    return null
  }
})

const editClick = () => {
  if (props.editable) {
    if (props.editCall) {
      props.editCall()
    } else {
      dialogOpen.value = true
    }
  }
}
</script>
