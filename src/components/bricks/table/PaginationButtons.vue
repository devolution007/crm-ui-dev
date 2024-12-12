<template>
  <q-inner-loading
    :showing="loading"
  />
  <q-btn
    :disable="loading || scope.isFirstPage as boolean"
    text-color="secondary"
    icon="sym_o_first_page"
    flat
    round
    dense
    @click="scope.firstPage"
  />
  <q-btn
    :disable="loading || scope.isFirstPage as boolean"
    text-color="secondary"
    icon="sym_o_chevron_left"
    flat
    round
    dense
    @click="scope.prevPage"
  />
  <q-btn
    :disable="loading || scope.isLastPage as boolean"
    text-color="secondary"
    icon="sym_o_chevron_right"
    flat
    round
    dense
    @click="scope.nextPage"
  />
  <q-btn
    :disable="loading || scope.isLastPage as boolean"
    text-color="secondary"
    icon="sym_o_last_page"
    flat
    round
    dense
    @click="scope.lastPage"
  />
</template>

<script setup lang="ts">
defineProps<{
  scope: {
    isFirstPage: boolean;
    isLastPage: boolean;
    pagination: {
      rowsPerPage: number;
      page: number;
    };
    firstPage:() => void;
    prevPage: () => void;
    nextPage: () => void;
    lastPage: () => void;
  }
  loading: boolean
}>()
</script>

<style scoped>
</style>
