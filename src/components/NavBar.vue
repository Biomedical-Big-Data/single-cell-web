<template>
  <div class="nav">
    <div v-if="route.name === 'home'">
      <router-link class="project no-underline" :to="{ name: 'projects' }">
        <img src="@/assets/images/home/icon_project.svg" alt="" />
        <span class="flex-1 text-center">Project</span>
      </router-link>
    </div>
    <div v-else class="back-container" @click="handleGoHome()">
      <img src="@/assets/icons/icon-back.svg" alt="" />
      <span>Home</span>
    </div>
    <div v-if="userStore?.getIsAuthenticated" class="user-container">
      <a-button class="create-action" @click="handleGoProjectCreate()">
        Create Project
      </a-button>
      <a-dropdown>
        <a-avatar class="cursor-pointer">
          {{ userStore.getUser?.user_name }}
        </a-avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item key="user_setting">
              <RouterLink to="/user/setting">设置</RouterLink>
            </a-menu-item>
            <a-menu-item key="projects_manage">
              <RouterLink to="/projects/manage">我的项目</RouterLink>
            </a-menu-item>
            <a-menu-item key="file_manage">
              <RouterLink to="/files/manage">我的文件</RouterLink>
            </a-menu-item>
            <a-sub-menu v-if="userStore.getUser.role === 1" key="admin">
              <template #title>系统管理</template>
              <a-menu-item key="user_admin">
                <RouterLink to="/user/admin">用户管理</RouterLink>
              </a-menu-item>
              <a-menu-item key="project_admin">
                <RouterLink to="/projects/admin">项目管理</RouterLink>
              </a-menu-item>
              <a-menu-item key="process_admin">
                <RouterLink to="/process/admin">进程管理</RouterLink>
              </a-menu-item>
              <a-menu-item key="meta_admin">
                <RouterLink to="/meta">Meta管理</RouterLink>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item key="logout" @click="logout()">登出</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div v-else class="flex items-center">
      <router-link
        class="login no-underline"
        :to="{ name: 'login', query: { feedback: route.name } }"
      >
        Login
      </router-link>
      <router-link class="sign-up no-underline" :to="{ name: 'register' }">
        Sign up
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/stores/user.js"

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

const handleGoHome = () => {
  router.push({ name: "home" })
}
const handleGoProjectCreate = () => {
  router.push({ name: "project_create" })
}

const logout = function () {
  userStore.setUser(null)
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

  .project {
    border: none;
    display: flex;
    width: 11.25rem;
    height: 2.25rem;
    padding: 0 1.25rem;
    align-items: center;
    flex-shrink: 0;
    border-radius: 2.9375rem;
    background: #ff7555;
    backdrop-filter: blur(7px);
    color: #fff;
    font-size: 1rem;
  }

  .login {
    background: transparent;
    display: flex;
    width: 7.5rem;
    height: 2.25rem;
    padding: 0 0.625rem 0.125rem 0.625rem;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border-radius: 2.9375rem;
    border: 2px solid #0062ff;
    color: #0062ff;
    font-size: 1rem;
  }

  .sign-up {
    margin-left: 0.75rem;
    border: none;
    display: flex;
    width: 7.5rem;
    height: 2.25rem;
    padding: 0 0.625rem 0.125rem 0.625rem;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
    border-radius: 2.9375rem;
    background: #0062ff;
    color: #fff;
    font-size: 1rem;
  }

  .back-container {
    display: flex;
    height: 2.25rem;
    padding: 0 0.75rem;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &:hover {
      filter: brightness(0) saturate(100%) invert(41%) sepia(100%)
        saturate(4465%) hue-rotate(186deg) brightness(96%) contrast(102%);
    }

    img {
      width: 1.125rem;
      height: 1.125rem;
    }

    span {
      color: #5f5f5f;
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.375rem; /* 137.5% */
    }
  }

  .user-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;

    .create-action {
      display: flex;
      height: 2.25rem;
      padding: 0 1.75rem 0.125rem 1.75rem;
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
  }
}
</style>
