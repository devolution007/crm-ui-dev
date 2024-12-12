<template>
  <q-expansion-item
    expand-separator
    :model-value="isActiveRoot"
  >
    <template #header>
      <q-item-section
        avatar
        :class="{ 'text-primary': isActiveRoot }"
      >
        <q-icon :name="props.icon" />
      </q-item-section>
      <q-item-section
        :class="{ 'text-primary': isActiveRoot }"
      >
        <q-item-label>{{ props.label }}</q-item-label>
      </q-item-section>
    </template>
    <q-list>
      <template
        v-for="(item, number) in props.items"
        :key="`expMenuItem_${number}${(isObject(item.to) ? item.to.name : item.to)}`"
      >
        <q-item
          v-if="(!item.accessFeature || authStore.hasAccessFeature(item.accessFeature)) && !item.hide"
          v-ripple
          clickable
          :to="item.to"
        >
          <q-item-section
            v-if="item.icon"
            avatar
          >
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { is } from 'quasar'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { MenuExpansionItem } from 'src/types'

const isObject = is.object

const props = defineProps<{
  label: string
  icon: string
  activeRoutes: string[]
  items: MenuExpansionItem[]
}>()

const route = useRoute()
const authStore = useAuthStore()

const fullRoutesList = computed(() => {
  const routes = props.activeRoutes
  props.items.forEach((item) => {
    if (isObject(item.to)) {
      routes.push(item.to.name)
    }
  })
  return routes
})
const isActiveRoot = computed(() => {
  if (!isObject(route)) return false
  if (!route.name) return false
  return fullRoutesList.value.includes(route.name as string)
})
</script>
