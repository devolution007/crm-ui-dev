<template>
  <q-list>
    <q-expansion-item>
      <template #header>
        <q-item-section avatar>
          <q-avatar
            color="primary"
            text-color="white"
            size="md"
            font-size="14px"
          >
            {{ authStore.user?.firstName[0] }}{{ authStore.user?.lastName[0] }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ authStore.user?.name }}</q-item-label>
          <q-item-label caption>
            {{ authStore.user?.email }}
          </q-item-label>
        </q-item-section>
      </template>
      <q-list>
        <q-item
          v-ripple
          clickable
          @click="authStore.logout()"
        >
          <q-item-section>
            <q-item-label>Log out</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="sym_o_logout" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <app-lang-switcher />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <the-dark-switcher />
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-separator />
  </q-list>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()
</script>
