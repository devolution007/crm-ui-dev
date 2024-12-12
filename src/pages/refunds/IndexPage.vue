<template>
  <q-page padding>
    <!-- content -->
    <bricks-page-title>
      {{ $t('refunds') }}
      <template #actions>
        <q-btn
          color="secondary"
          text-color="primary"
          icon="sym_o_archive"
          :label="$t('exportToCsv')"
          size="md"
          @click="$q.notify('Not implemented yet')"
        />
      </template>
    </bricks-page-title>
    <refund-list-table />
  </q-page>
</template>

<script setup lang="ts">
</script>
