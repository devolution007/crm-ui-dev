<template>
  <q-page padding>
    <!-- content -->
    <bricks-page-title>{{ $t('customerRegistration') }}</bricks-page-title>
    <q-banner
      v-if="!callStore.isCallActive"
      class="bg-amber-1 text-brown shadow-1 q-my-lg"
      rounded
    >
      <template #avatar>
        <q-icon
          name="sym_o_phone_disabled"
          color="warning"
        />
      </template>
      {{ $t('warningNoCallStartedToRegister') }}
    </q-banner>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-5 order-md-last">
        <div
          v-if="project === $constants.PROJECT_DOMAIN_METRO"
        >
          <p> {{ $t('theAreaOfOurOperationsIsCurrentlyLimitedTo') }}</p>
          <div class="q-mb-md">
            <div
              v-for="phcState in $constants.PHC_STATES"
              :key="`phcState${phcState.code}`"
            >
              <strong>{{ phcState.name }}</strong>
            </div>
          </div>
          <p>{{ $t('inCaseYouWouldLikeToBeNotifiedWhenYourStateIsCover') }}</p>
        </div>
        <div
          v-if="project === $constants.PROJECT_DOMAIN_PHC"
        >
          <p>
            {{ $t('deliveryServicesLimitedStates') }}
          </p>
          <div class="q-mb-md">
            <div
              v-for="phcState in $constants.PHC_STATES"
              :key="`phcState${phcState.code}`"
            >
              <strong>{{ phcState.name }}</strong>
            </div>
          </div>
          <p>
            {{ $t('deliveryServicesLimitedStatesContactUs') }}
          </p>
        </div>
      </div>
      <div class="col-12 col-lg-7 order-md-first">
        <div class="q-mb-md q-gutter-sm">
          <q-radio
            v-if="authStore.hasAccessProject($constants.PROJECT_DOMAIN_PHC)"
            v-model="project"
            :val="$constants.PROJECT_DOMAIN_PHC"
            label="Solutran"
          />
          <q-radio
            v-if="authStore.hasAccessProject($constants.PROJECT_DOMAIN_METRO)"
            v-model="project"
            :val="$constants.PROJECT_DOMAIN_METRO"
            label="Metro OTC"
          />
        </div>

        <q-card>
          <q-card-section>
            <customer-registration-metro-form
              v-if="project === $constants.PROJECT_DOMAIN_METRO"
              :submit-enabled="callStore.isCallActive || false"
            />

            <customer-registration-phc-form
              v-if="project === $constants.PROJECT_DOMAIN_PHC"
              :submit-enabled="callStore.isCallActive || false"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import { useCall } from 'stores/call'
import { inject, onMounted, ref, watch } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { constants } from 'boot/constants'
import { EventBus } from 'quasar'
import BUS_EVENT from 'src/types/bus-events'
const bus = inject('bus') as EventBus

const authStore = useAuthStore()

const callStore = useCall()

const project = ref('')

const autoSelectProject = () => {
  if (project.value) {
    return
  }

  if (authStore.hasAccessProject(constants.PROJECT_DOMAIN_METRO)) {
    project.value = constants.PROJECT_DOMAIN_METRO
  } else if (authStore.hasAccessProject(constants.PROJECT_DOMAIN_PHC)) {
    project.value = constants.PROJECT_DOMAIN_PHC
  }
}

onMounted(() => {
  autoSelectProject()
})

bus.on(BUS_EVENT.AUTH_USER_INFO_LOADED, () => {
  autoSelectProject()
})

</script>
