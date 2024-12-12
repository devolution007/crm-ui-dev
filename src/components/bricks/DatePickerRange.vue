<template>
  <q-field
    :dense="props.dense"
    @focus="showPopupIfNotShown"
  >
    <template #prepend>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          ref="popup"
          :target="$refs.input"
          :cover="props.cover"
          transition-show="scale"
          transition-hide="scale"
          @hide="popupShown = false"
          @show="popupShown = true"
        >
          <div>
            <q-date
              minimal
              mask="MM/DD/YYYY"
              range
              :model-value="valueLocal"
              @update:model-value="updated"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  :label="$t('close')"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>

    <q-input
      borderless
      mask="##/##/####"
      :label="props.label + ': '+$t('from')"
      :dense="props.dense"
      :model-value="valueLocal.from"
      :clearable="props.clearable && !!valueLocal.from"
      @update:model-value="updatedOne($event, 'from')"
    >
      <template #after>
        <span class="q-pr-sm"></span>
      </template>
    </q-input>

    <q-input
      borderless
      mask="##/##/####"
      :label="$t('to')"
      :dense="props.dense"
      :model-value="valueLocal.to"
      :clearable="props.clearable && !!valueLocal.to"
      @update:model-value="updatedOne($event, 'to')"
    />
  </q-field>
</template>

<script setup lang="ts">
import { QInput, QPopupProxy } from 'quasar'
import { onMounted, Ref, ref, watch } from 'vue'

const props = defineProps({

  from: {
    type: String,
    required: false,
    default: ''
  },
  to: {
    type: String,
    required: false,
    default: ''
  },
  dense: {
    type: Boolean,
    default: false
  },
  cover: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

/* const props = defineProps<{
  from: string | null
  to: string
  dense: boolean
  cover: boolean
  error: boolean
  errorMessage: string
}>() */

interface DateRange {
  from: string
  to: string
}
const valueLocal: Ref<DateRange> = ref({
  from: '',
  to: ''
})
const popup: Ref<QPopupProxy | null> = ref(null)
const popupShown = ref(false)

const showPopupIfNotShown = () => {
  if (!popupShown.value) {
    popup.value?.show()
  }
}

watch(() => props.from, (value) => {
  valueLocal.value.from = value
})
watch(() => props.to, (value) => {
  valueLocal.value.to = value
})

onMounted(() => {
  valueLocal.value.from = props.from
  valueLocal.value.to = props.to
})

const emit = defineEmits(['update:from', 'update:to'])

const updated = (value: DateRange | null, $eventName: string) => {
  if (!value || $eventName === 'remove-range') {
    valueLocal.value.from = ''
    valueLocal.value.to = ''
  } else {
    valueLocal.value.from = value.from
    valueLocal.value.to = value.to
  }
  emit('update:from', valueLocal.value.from)
  emit('update:to', valueLocal.value.to)
}
const updatedOne = (value: string, part: keyof DateRange) => {
  valueLocal.value[part] = value
  emit(`update:${part}`, value)
}
</script>

<style scoped lang="scss">
.q-field--outlined :deep(.q-field--borderless .q-field__control:before) {
  border: none;
}
.q-field--outlined :deep(.q-field--borderless/*:not(.q-field--highlighted)*/ .q-field__control:after) {
  border: none;
}
/*

.q-field--outlined :deep(.q-field--borderless.q-field--highlighted .q-field__control:after) {
  border: 2px solid transparent;
}
*/

</style>
