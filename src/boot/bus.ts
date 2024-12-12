import { EventBus } from 'quasar'
import { boot } from 'quasar/wrappers'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $bus: EventBus;
  }
}

/**
 * Ways to access the event bus:
 * // Options API
 * this.$bus
 *
 * // Composition API
 * import { inject } from 'vue'
 * import { EventBus } from 'quasar'
 *
 * const bus = inject('bus') as EventBus // inside setup()
 *
 * Usage:
 *
 * bus.on('some-event', (arg1, arg2, arg3) => {
 *  // do some work
 * })
 *
 * bus.emit('some-event', 'arg1 value', 'arg2 value', 'arg3 value')
 * Better to place the event name in a constant BUS_EVENT in src/types/bus-events.ts
 *
 * @see https://quasar.dev/quasar-utils/event-bus-util
 */

const bus = new EventBus()

export default boot(({ app }) => {

  // for Options API
  app.config.globalProperties.$bus = bus

  // for Composition API
  app.provide('bus', bus)
})

export { bus }
