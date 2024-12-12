<template>
  <q-page
    padding
    class="column justify-center"
  >
    <!-- content -->
    <q-card class="login-card border-radius-lg shadow-6">
      <q-card-section class="q-pa-lg">
        <div class="row justify-center q-py-md">
          <q-img
            src="~assets/logo.png"
            style="max-width: 160px"
          />
        </div>
        <h6 class="q-mt-md q-mb-lg">
          Welcome to OTC Stores CRM
        </h6>
        <q-form
          class="q-gutter-md"
          @submit="onSubmit"
        >
          <q-input
            v-model="login"
            data-cy="username"
            outlined
            type="email"
            label="Email"
            placeholder="Email"
            lazy-rules
            :rules="usernameRules"
            hint="Enter your email"
          />

          <q-input
            v-model="password"
            data-cy="password"
            outlined
            placeholder="Password"
            :rules="passwordRules"
            :type="isPwd ? 'password' : 'text'"
            hint="Enter password"
          >
            <template #append>
              <q-icon
                :name="isPwd ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="row justify-center">
            <q-btn
              color="primary"
              type="submit"
              class="q-px-xl q-py-xs"
              :loading="loading"
              label="Login"
              data-cy="login-button"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import { useRouter } from 'vue-router'
import { useMeta } from 'quasar'
const router = useRouter()
const authStore = useAuthStore()

useMeta({
  title: 'Login'
})

const login = ref('')
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)

const passwordRules = [
  (v: string) => !!v || 'Password is required'
]
const usernameRules = [
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
]

const onSubmit = async () => {
  console.log('submit')
  loading.value = true
  await authStore.login(login.value, password.value)
    .finally(() => {
      loading.value = false
    })
}

watch(() => authStore.isLoggedIn, (val) => {
  if (val) {
    router.push({ name: 'dashboard' })
  }
})

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push({ name: 'dashboard' })
  }
})
</script>
<style lang="scss">
.login-card {
  width: 450px;
}
</style>
