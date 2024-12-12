<template>
  <q-card-section class="row items-center q-pb-none">
    <div class="text-h6">
      <slot />
    </div>
    <q-space />
    <q-btn
      v-close-popup
      icon="sym_o_close"
      flat
      round
      dense
    />
  </q-card-section>
</template>
