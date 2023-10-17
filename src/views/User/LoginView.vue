<template>
  <div class="mt-20">
    <div class="flex align-center justify-center">
      <img class="logo" src="../../assets/logo.svg" alt="" />
      <span class="title">scRNA-seq database</span>
    </div>
    <div class="sub-title text-center">
      Welcome to my amazing scRNA-seq database
    </div>
  </div>
  <div class="flex justify-center mt-16">
    <a-tabs v-model:activeKey="activeKey" class="login-content">
      <a-tab-pane key="login" tab="Login">
        <div class="mt-4">
          <a-input
            placeholder="输入登录邮箱"
            v-model:value="loginForm.email_address"
          >
            <template #prefix>
              <user-outlined :style="{ color: '#1890FF' }" />
            </template>
          </a-input>
        </div>
        <div class="mt-6">
          <a-input-password
            placeholder="输入密码"
            v-model:value="loginForm.user_password"
          >
            <template #prefix>
              <lock-outlined :style="{ color: '#1890FF' }" />
            </template>
          </a-input-password>
        </div>
        <div class="mt-6 flex items-center justify-between">
          <a-checkbox v-model:checked="remember">Remember me</a-checkbox>
          <router-link :to="{ name: 'user_forget_password' }">
            Forgot your password?
          </router-link>
        </div>
        <div class="mt-6">
          <a-button type="primary" @click="userLogin" :loading="logining">
            Sign In
          </a-button>
        </div>
      </a-tab-pane>
      <a-tab-pane key="register" tab="Sign Up">
        <div class="mt-4">
          <a-input
            placeholder="输入用户名"
            v-model:value="registerForm.user_name"
          >
            <template #prefix>
              <user-outlined :style="{ color: '#1890FF' }" />
            </template>
          </a-input>
        </div>
        <div class="mt-6">
          <a-input
            placeholder="输入邮箱"
            v-model:value="registerForm.email_address"
          >
            <template #prefix>
              <mail-outlined :style="{ color: '#1890FF' }" />
            </template>
          </a-input>
        </div>
        <div class="mt-6">
          <a-input
            placeholder="输入您的组织"
            v-model:value="registerForm.organization"
          >
            <template #prefix>
              <team-outlined :style="{ color: '#1890FF' }" />
            </template>
          </a-input>
        </div>
        <div class="mt-6">
          <a-input-password
            placeholder="输入密码"
            v-model:value="registerForm.user_password"
          >
            <template #prefix>
              <lock-outlined :style="{ color: '#1890FF' }" />
            </template>
          </a-input-password>
        </div>
        <div class="mt-6">
          <a-input-password
            placeholder="请再次输入密码"
            v-model:value="registerForm.user_verify_password"
          >
            <template #prefix>
              <lock-outlined :style="{ color: '#1890FF' }" />
            </template>
          </a-input-password>
        </div>
        <div class="mt-6">
          <a-button type="primary" @click="userRegister" :loading="registering">
            Sign Up
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import {
  UserOutlined,
  LockOutlined,
  TeamOutlined,
  MailOutlined,
} from "@ant-design/icons-vue";
import { register, login } from "@/api/user";
import { message } from "ant-design-vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const activeKey = ref("login");
const remember = ref(false);

const logining = ref(false);
const loginForm = reactive({
  email_address: "",
  user_password: "",
});

const registering = ref(false);
const registerForm = reactive({
  user_name: "",
  email_address: "",
  organization: "",
  user_password: "",
  user_verify_password: "",
});

const userRegister = async function () {
  const { user_name, user_password, organization, email_address } =
    registerForm;
  try {
    registering.value = true;
    await register({ user_name, user_password, organization, email_address });
    message.success("注册成功，请查看邮箱激活");
  } finally {
    registering.value = false;
  }
};

const userLogin = async function () {
  const { email_address, user_password } = loginForm;

  try {
    logining.value = true;
    const result = await login({ email_address, user_password });
    userStore.setUser(result);
    await router.replace({ name: "home" });
  } finally {
    logining.value = false;
  }
};
</script>
<style lang="scss" scoped>
.logo {
  height: 2.875rem;
  margin-right: 1.12rem;
}

.title {
  color: var(--character-title-85, rgba(0, 0, 0, 0.85));
  font-size: 2.0625rem;
  line-height: 2.375rem; /* 115.152% */
  letter-spacing: 0.01031rem;
}

.sub-title {
  margin-top: 0.81rem;
  color: var(--character-secondary-45, rgba(0, 0, 0, 0.45));
  font-size: 0.875rem;
  line-height: 1.375rem;
}

.login-content {
  width: 22.5rem;
}
</style>

<style lang="scss">
#app {
  background: #ffffff;
}
</style>
