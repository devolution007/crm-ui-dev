import { defineStore } from 'pinia'
import CallModel from 'src/models/CallModel'
import { api } from 'boot/axios'
import CallApi from 'src/api/CallApi'
import BUS_EVENT from 'src/types/bus-events'
import { bus } from 'boot/bus'

export type CallType = 'inbound' | 'outbound' | 'order'

export const useCall = defineStore('call', {
  state: () => ({
    call: null as CallModel | null,
    identifying: null as number | null,
    isShowEndCallDialog: false,
    callIsLoading: false
  }),

  getters: {
    isCallActive(state) {
      return !!state.call
    },
    isInboundCall(state) {
      return state.call?.type === 'inbound'
    },
    isOutboundCall(state) {
      return state.call?.type === 'outbound'
    },
    isCallIdentified(state) {
      return !!state.call?.customer
    }
  },

  actions: {
    async startCall(type: CallType) {

      type = type == 'order' ? 'inbound' : type

      const call = await new CallApi(api).startCall(type)
      console.log(call);

      this.call = call
      return call
    },
    async getCall() {
      this.callIsLoading = true
      const call = await new CallApi(api).getCall()
      this.callIsLoading = false
      this.call = call
      return call
    },
    async endCall({ category, note }: { category: string, note: string }) {

      await new CallApi(api).endCall(category, note)
      this.call = null
    },
    showEndCallDialog() {
      this.isShowEndCallDialog = true
    },
    async identify({ customerId }: { customerId: number }) {
      this.identifying = customerId
      this.call = await new CallApi(api).identify(customerId)
      this.identifying = null
      bus.emit(BUS_EVENT.CALL_CUSTOMER_IDENTIFIED, this.call, customerId)
    },
    isIdentifiedAsId(id: number) {
      if (!this.call?.customer) return false
      return this.call.customer.id === id
    }
  }
})
