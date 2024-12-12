/**
 * @description
 * This is the events list that can be emitted by the bus.
 * @see https://quasar.dev/quasar-utils/event-bus-util
 * @see {@link src/boot/bus.ts} for the bus implementation
 */

const BUS_EVENT = {
  ORDER_PATCHED: 'order:patched',
  PRODUCT_REQUEST_CREATED: 'product-request:created',
  CALL_CUSTOMER_IDENTIFIED: 'call:customer-identified',
  CHECK_INPUT_COPIED: 'check:input-copied',
  AUTH_USER_INFO_LOADED: 'auth:user-info-loaded',
}

export default BUS_EVENT
