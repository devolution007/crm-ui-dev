<template>
  <q-form
    ref="form"
    v-model="valid"
    class="end-call-component"
    @submit.prevent="submit"
  >
    <q-select
      v-model="category"
      :options="reasonOptions"
      label="Reason"
      outlined
      option-value="value"
      option-label="text"
      :rules="[(v) => !!v || 'Field is required']"
      emit-value
      map-options
    />

    <q-input
      v-model="note"
      label="Note"
      outlined
      type="textarea"
      rows="5"
      class="q-mb-md"
    />

    <q-btn
      v-show="showSubmitBtn"
      :loading="submitting"
      color="primary"
      type="submit"
    >
      Finish Call
    </q-btn>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { QForm } from 'quasar'
import { mapActions } from 'pinia'
import { useCall } from 'stores/call'

export default defineComponent({
  name: 'EndCallForm',
  props: {
    showSubmitBtn: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['succeed'],
  setup () {
    const callStore = useCall()
    return {
      callStore
    }
  },
  data () {
    return {
      valid: false,
      items: [] as object[],
      category: '',
      note: '',
      submitting: false
    }
  },
  computed: {
    form (): QForm {
      return this.$refs.form as QForm
    },
    reasonOptions () {
      return this.$helper.parseObjectFromConstant(this.$constants.CALL_CATEGORIES)
        .map((item: any) => {
          return {
            text: this.$t(`callCategories.${item.text}`),
            value: item.text
          }
        })
    }
  },
  methods: {
    ...mapActions(useCall, ['endCall']),
    async submit () {
      if (!await this.form.validate()) {
        return
      }
      this.submitting = true
      try {
        await this.endCall({
          category: this.category,
          note: this.note
        })
        this.$emit('succeed')
        await this.$router.push('/')
      } catch (e: unknown) {
        // this.$helper.unknownErr(this.$notify)
      } finally {
        this.submitting = false
      }
    }
  }
})
</script>

<style scoped>

</style>
