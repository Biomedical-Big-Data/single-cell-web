<template>
  <div class="auth-container">
    <div class="content-container">
      <div class="title-container">
        <div class="title-sm text-center">Change password</div>
      </div>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
      >
        <a-form-item
          class="w-full form-item"
          name="password"
        >
          <div class="label">Password</div>
          <div>
            <a-input-password
              v-model:value="formState.password"
              class="simple-input"
              placeholder="Enter your password"
            ></a-input-password>
          </div>
        </a-form-item>
        <a-form-item
          class="w-full form-item"
          name="confirm_password"
        >
          <div class="label">Confirm password</div>
          <div>
            <a-input-password
              v-model:value="formState.confirm_password"
              class="simple-input"
              placeholder="Confirm your password"
            ></a-input-password>
          </div>
        </a-form-item>
      </a-form>

      <div>
        <div class="w-full justify-center flex">
          <a-button
            class="login"
            :loading="loading"
            @click="handleResetPassword"
          >
            Change password
          </a-button>
        </div>
      </div>
    </div>

    <div class="footer-fixed">
      ©2024 single cell interactive dashboard (singlecell-IVD). All rights
      reserved.
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { resetPassword } from "@/api/user"
import { message } from "ant-design-vue"

const route = useRoute()
const router = useRouter()

const formState = reactive({
  password: "",
  confirm_password: "",
})
const loading = ref(false)
const formRef = ref()

const rules = {
  password: [
    {
      required: true,
      message: "Enter your password",
      trigger: "blur",
    },
  ],
  confirm_password: [
    {
      required: true,
      message: "Confirm your password",
      trigger: "blur",
    },
    {
      validator: (rule, value) => {
        if (value !== formState.password) {
          return Promise.reject(
            "The two passwords that you entered do not match!",
          )
        }
        return Promise.resolve()
      },
    },
  ],
}

const handleResetPassword = async function () {
  await formRef.value.validate()
  try {
    loading.value = true
    const { token } = route.query
    await resetPassword({ token, password: formState.password })
    message.success("Password reset successful, please log in again")
    await router.replace({ name: "login" })
  } finally {
    loading.value = false
  }
}
</script>
<style></style>
