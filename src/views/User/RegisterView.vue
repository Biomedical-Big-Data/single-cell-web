<template>
  <div class="auth-container">
    <div class="content-container">
      <div class="title-container">
        <div class="title">Sign up</div>
      </div>
      <a-form
        ref="formRef"
        :model="registerForm"
        :rules="rules"
      >
        <a-form-item
          ref="formRef"
          class="w-full form-item"
          name="email_address"
        >
          <div class="label">Email address</div>
          <div>
            <a-input
              v-model:value="registerForm.email_address"
              class="simple-input"
              placeholder="Enter your email address"
            ></a-input>
          </div>
        </a-form-item>
        <a-form-item
          class="w-full form-item"
          name="user_name"
        >
          <div class="label">User name</div>
          <div>
            <a-input
              v-model:value="registerForm.user_name"
              class="simple-input"
              placeholder="Enter your user name"
            ></a-input>
          </div>
        </a-form-item>
        <a-form-item
          class="w-full form-item"
          name="organization"
        >
          <div class="label">Organization</div>
          <div>
            <a-input
              v-model:value="registerForm.organization"
              class="simple-input"
              placeholder="Enter your organization"
            ></a-input>
          </div>
        </a-form-item>
        <a-form-item
          class="w-full form-item"
          name="user_password"
        >
          <div class="label">Password</div>
          <div>
            <a-input-password
              v-model:value="registerForm.user_password"
              class="simple-input"
              placeholder="Enter your password"
            ></a-input-password>
          </div>
        </a-form-item>
        <a-form-item
          class="w-full form-item"
          name="user_verify_password"
        >
          <div class="label">Confirm password</div>
          <div>
            <a-input-password
              v-model:value="registerForm.user_verify_password"
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
            @click="handleUserRegister"
          >
            Sign up
          </a-button>
        </div>

        <div class="flex items-center justify-center w-full mt-6">
          <div>Already have an account?</div>
          <router-link
            :to="{ name: 'login' }"
            class="ml-2.5"
          >
            Sign in
          </router-link>
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
import { Modal } from "ant-design-vue"
import { ref } from "vue"
import { register } from "@/api/user"
import { useRouter } from "vue-router"

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const registerForm = ref({
  user_name: "",
  email_address: "",
  organization: "",
  user_password: "",
  user_verify_password: "",
})

const rules = {
  user_name: [
    {
      required: true,
      message: "Enter your user name",
      trigger: "blur",
    },
  ],
  email_address: [
    {
      required: true,
      message: "Enter your email address",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Enter a valid email address",
      trigger: "blur",
    },
  ],
  organization: [
    {
      required: true,
      message: "Enter your organization",
      trigger: "blur",
    },
  ],
  user_password: [
    {
      required: true,
      message: "Enter your password",
      trigger: "blur",
    },
  ],
  user_verify_password: [
    {
      required: true,
      message: "Confirm your password",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.user_password) {
          callback(
            new Error("The two passwords that you entered do not match!"),
          )
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
}

const handleUserRegister = async function () {
  await formRef.value.validate()
  try {
    loading.value = true
    const { user_name, user_password, organization, email_address } =
      registerForm.value
    await register({ user_name, user_password, organization, email_address })
    Modal.success({
      title: "Registration successful",
      content: "please check email activation",
      onOk() {
        router.replace({ name: "login" })
      },
    })
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss" scoped></style>
