<template>
  <q-page padding>
    <!-- content -->
    <customer-issues-table
      :customer-id="$route.params.customerId"
    />
  </q-page>
</template>
