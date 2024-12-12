<template>
  <q-item
    :clickable="editable"
    @click="$emit('editAttempt')"
  >
    <q-item-section>
      <q-item-label caption>
        {{ props.label }}
      </q-item-label>
      <q-item-label>
        <q-skeleton
          v-if="props.loading"
          type="QChip"
          class="q-ma-xs"
        />
        <slot v-else />
      </q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-icon
        v-if="! props.loading"
        color="grey"
        name="sym_o_edit"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  editable?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  loading: false
})

defineEmits(['editAttempt'])

</script>
