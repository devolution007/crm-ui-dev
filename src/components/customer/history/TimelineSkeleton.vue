<template>
  <q-timeline>
    <q-timeline-entry>
      <template #subtitle>
        <q-skeleton
          width="100px"
          height="10px"
        />
      </template>
      <template #title>
        <q-skeleton
          width="200px"
          height="20px"
        />
      </template>
      <template #default>
        <q-skeleton
          class="q-mb-sm"
          width="100%"
          height="10px"
        />
        <q-skeleton
          width="100%"
          height="10px"
        />
      </template>
    </q-timeline-entry>
    <q-timeline-entry>
      <template #title>
        <q-skeleton
          width="200px"
          height="20px"
        />
      </template>
      <template #subtitle>
        <q-skeleton
          width="100px"
          height="10px"
        />
      </template>
      <template #default>
        <div class="row q-col-gutter-md">
          <div class="col">
            <q-skeleton
              type="rect"
              width="100%"
              height="70px"
            />
          </div>
          <div class="col">
            <q-skeleton
              type="rect"
              width="100%"
              height="70px"
            />
          </div>
        </div>
      </template>
    </q-timeline-entry>
    <q-timeline-entry>
      <template #title>
        <q-skeleton
          width="200px"
          height="20px"
        />
      </template>
      <template #subtitle>
        <q-skeleton
          width="100px"
          height="10px"
        />
      </template>
    </q-timeline-entry>
    <q-timeline-entry>
      <template #title>
        <q-skeleton
          width="200px"
          height="20px"
        />
      </template>
      <template #subtitle>
        <q-skeleton
          width="100px"
          height="10px"
        />
      </template>
      <template #default>
        <q-skeleton
          class="q-mb-sm"
          width="100%"
          height="10px"
        />
        <q-skeleton
          width="100%"
          class="q-mb-sm"
          height="10px"
        />
        <q-skeleton
          width="100%"
          height="10px"
        />
      </template>
    </q-timeline-entry>
  </q-timeline>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
