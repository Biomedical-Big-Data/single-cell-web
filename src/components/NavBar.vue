<template>
  <div class="nav">
    <div v-if="route.name === 'home'" class="nav-project">
      <router-link class="project no-underline" :to="{ name: 'projects' }">
        <span class="text-center">Public Project</span>
        <span class="button-desc">exploring</span>
      </router-link>
      <router-link v-if="false" :to="{ name: 'home' }" class="about">
        <span>about</span>
      </router-link>
    </div>
    <div v-else class="back-container" @click="handleGoHome()">
      <img src="@/assets/icons/icon-back.svg" alt="" />
      <span>Home</span>
    </div>
    <div v-if="userStore?.getIsAuthenticated" class="user-container">
      <a-button class="create-action" @click="handleGoProjectCreate()">
        <PlusOutlined />
        Create Project
      </a-button>
      <a-dropdown>
        <div class="cursor-pointer avatar">
          <UserOutlined />
          {{ userStore.getUser?.user_name }}
          <span v-if="showRoleLabel" class="role" :class="roleName">
            {{ roleName }}
          </span>
        </div>
        <template #overlay>
          <a-menu class="user-menu">
            <a-menu-item key="user_setting" class="large-menu">
              <RouterLink to="/user/setting">User setting</RouterLink>
            </a-menu-item>
            <a-menu-item key="projects_manage" class="large-menu">
              <RouterLink to="/projects/manage">Personal projects</RouterLink>
            </a-menu-item>
            <a-menu-item key="file_manage" class="large-menu">
              <RouterLink to="/files/manage">My files</RouterLink>
            </a-menu-item>
            <a-sub-menu
              v-if="userStore.getUser.role === 1"
              key="admin"
              class="large-menu"
            >
              <template #title><span>System manage</span></template>
              <a-menu-item key="user_admin" class="large-menu">
                <RouterLink to="/user/admin">User manage</RouterLink>
              </a-menu-item>
              <a-menu-item key="project_admin" class="large-menu">
                <RouterLink to="/projects/admin">Project manage</RouterLink>
              </a-menu-item>
              <a-menu-item key="process_admin" class="large-menu">
                <RouterLink to="/process/admin">Process manage</RouterLink>
              </a-menu-item>
              <a-menu-item key="meta_admin" class="large-menu">
                <RouterLink to="/meta">Meta manage</RouterLink>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item key="logout" class="large-menu" @click="logout()">
              Logout
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div v-else class="flex items-center">
      <router-link
        class="login no-underline"
        :to="{ name: 'login', query: { feedback: route.name } }"
      >
        <span>Login</span>
        <span class="button-desc">To manage projects</span>
      </router-link>
      <router-link class="sign-up no-underline" :to="{ name: 'register' }">
        <span>Sign up</span>
        <span class="button-desc">To create or share private projects</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/stores/user.js"
import { UserOutlined, PlusOutlined } from "@ant-design/icons-vue"
import { USER_ROLE_DESC } from "@/constants/user.js"
import { computed } from "vue"

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

const showRoleLabel = computed(() => {
  return userStore?.getUser.role
})

const roleName = computed(() => {
  return (
    USER_ROLE_DESC.find((item) => item.value === userStore?.getUser.role)
      ?.label || "Normal"
  ).toLocaleLowerCase()
})

const handleGoHome = () => {
  router.push({ name: "home" })
}
const handleGoProjectCreate = () => {
  router.push({ name: "project_create" })
}

const logout = function () {
  userStore.setUser(null)
  router.replace({ name: "home" })
}
</script>

<style scoped lang="scss">
.nav {
  background: #ffffff;
  display: flex;
  padding: 0.625rem 1.25rem;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  width: 100vw;
  z-index: 99;

  &-project {
    display: flex;
    gap: 0.75rem;
  }

  .project {
    border: none;
    display: flex;
    flex-direction: column;
    width: 11.25rem;
    height: 3.375rem;
    padding: 0.5rem 1.875rem 0.625rem 1.875rem;
    align-items: center;
    justify-content: center;
    border-radius: 2.9375rem;
    background: #ff7555;
    backdrop-filter: blur(7px);
    color: #fff;
    font-size: 1rem;
  }

  .about {
    display: flex;
    width: 6.25rem;
    justify-content: center;
    align-items: center;
    height: 3.375rem;
    border: 1px solid #d2d2d2;
    color: #7e7e7e;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 2.9375rem;
    backdrop-filter: blur(7px);
  }

  .button-desc {
    font-size: 0.875rem;
  }

  .login {
    background: transparent;
    display: flex;
    height: 3.375rem;
    flex-direction: column;
    padding: 0.5rem 1.875rem 0.625rem 1.875rem;
    justify-content: center;
    align-items: center;
    border-radius: 2.9375rem;
    border: 2px solid #0062ff;

    color: #0062ff;
    font-size: 1rem;
  }

  .sign-up {
    margin-left: 0.75rem;
    border: none;
    display: flex;
    height: 3.375rem;
    flex-direction: column;
    padding: 0.5rem 1.875rem 0.625rem 1.875rem;
    justify-content: center;
    align-items: center;
    border-radius: 2.9375rem;
    background: #0062ff;
    color: #fff;
    font-size: 1rem;
  }

  .user-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;

    .create-action {
      display: flex;
      height: 3.375rem;
      padding: 0.5rem 1.875rem 0.625rem 1.875rem;
      justify-content: center;
      align-items: center;
      gap: 0.625rem;
      border-radius: 2.9375rem;
      background: #0062ff;
      color: #fff;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.375rem;
    }

    .avatar {
      font-size: 1.1rem;
      height: 3.375rem;
      padding: 0.25rem 0.9375rem;
      min-width: 2.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 2.9375rem;
      background: rgba(#0062ff, 0.1);
      color: #0062ff;
    }
  }
}

.user-menu {
  width: 200px;
}
</style>
<style lang="scss">
.large-menu {
  font-size: 1rem !important;
  padding: 0.75rem 1rem !important;
  cursor: pointer !important;

  .ant-dropdown-menu-submenu-title {
    font-size: 1rem !important;
    padding-left: 0 !important;
  }

  .ant-dropdown-menu-submenu-title {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  &.ant-dropdown-menu-submenu-active {
    background-color: rgba(0, 0, 0, 0.04);

    .ant-dropdown-menu-submenu-title {
      background: transparent !important;
    }
  }
}
</style>
