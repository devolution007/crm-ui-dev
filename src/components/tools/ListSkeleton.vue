<template>
  <q-list>
    <q-item
      v-for="idx in props.items"
      :key="`skeleton-list-item-${idx}`"
      dense
    >
      <q-item-section>
        <q-skeleton
          type="text"
          height="32px"
          width="100%"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
const props = defineProps({
  items: {
    type: Number,
    default: 1
  }
})
</script>
