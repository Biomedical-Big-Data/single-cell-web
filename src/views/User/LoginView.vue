<template>
  <div class="auth-container">
    <div class="content-container">
      <div class="title-container">
        <div class="title">Login</div>
        <div class="sub-title">Welcome to scRNA-seq Database</div>
      </div>
      <a-form ref="formRef" :model="loginForm" :rules="rules">
        <a-form-item class="w-full form-item" name="email_address">
          <div class="label">
            Email address
          </div>
          <div>
            <a-input
                v-model:value="loginForm.email_address" class="simple-input"
                placeholder="Enter your email address"></a-input>
          </div>
        </a-form-item>
        <a-form-item class="w-full form-item" name="user_password">
          <div class="label">
            Password
          </div>
          <div>
            <a-input-password
                v-model:value="loginForm.user_password" class="simple-input"
                placeholder="Enter your password"></a-input-password>
          </div>
        </a-form-item>
        <a-form-item class="mb-0">
          <div class="flex items-center justify-between w-full">
            <a-checkbox v-model:checked="loginForm.remember"><span class="text-basic">Remember me</span></a-checkbox>
            <router-link :to="{ name: 'user_forget_password' }" class="text-basic">
              Forgot your password?
            </router-link>
          </div>
        </a-form-item>
      </a-form>

      <div>
        <div class="w-full justify-center flex">
          <a-button class="login" :loading="loading" @click="handleUserLogin">
            login
          </a-button>
        </div>

        <div class="flex items-center justify-center w-full mt-6">
          <div>Don’t have an account?</div>
          <router-link :to="{name:'register'}" class="ml-2.5">Sign up</router-link>
        </div>
      </div>
    </div>
    <div class="footer-fixed">
      scRNA-seq Database © 2023
    </div>
  </div>

</template>
<script setup>
import { ref } from 'vue'
import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

console.log(route)

const loading = ref(false)
const formRef = ref()

const rules = {
  email_address: {
    required: true,
    message: 'Please enter your email address',
    trigger: 'blur'
  },
  user_password: {
    required: true,
    message: 'Please enter your password',
    trigger: 'blur'
  }
}

const loginForm = ref({
  email_address: '',
  user_password: '',
  remember: false
})

const handleUserLogin = async function () {
  const result = await formRef.value.validate()
  console.log(result)
  try {
    loading.value = true
    const { email_address, user_password } = loginForm.value
    const result = await login({ email_address, user_password })
    userStore.setUser(result)
    await router.replace({ name: (route.query?.feedback || 'home') })
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss" scoped>

</style>
