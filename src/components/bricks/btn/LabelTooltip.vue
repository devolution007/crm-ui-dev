<template>
  <span
    v-if="$q.screen.gt.md"
    class="q-ml-sm"
  >
    <slot />
  </span>
  <q-tooltip
    v-else
    :delay="300"
    class="text-body2"
  >
    <slot />
  </q-tooltip>
</template>
