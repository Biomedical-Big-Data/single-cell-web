<template>
  <a-layout-header class="">
    <a-menu mode="horizontal" theme="dark">
      <a-menu-item disabled class="menu-none">
        <img class="logo" src="@/assets/logo.svg" alt="" />
      </a-menu-item>
      <a-menu-item key="home">
        <RouterLink to="/">Home</RouterLink>
      </a-menu-item>
      <a-menu-item key="project">
        <RouterLink to="/projects">Project</RouterLink>
      </a-menu-item>
      <!--      <a-menu-item disabled class="menu-none flex-1"></a-menu-item>-->
      <a-menu-item v-if="userStore?.getIsAuthenticated">
        <RouterLink to="/projects/create">Create Project</RouterLink>
      </a-menu-item>
      <a-sub-menu key="user" v-if="userStore?.getIsAuthenticated" class="ml-auto">
        <template #title>
          <a-avatar :size="24" style="background-color: #87d068">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          {{ userStore.getUser?.user_name }}
        </template>
        <a-menu-item key="user_setting">
          <RouterLink to="/user/setting">设置</RouterLink>
        </a-menu-item>
        <a-menu-item key="projects_manage">
          <RouterLink to="/projects/manage">我的项目</RouterLink>
        </a-menu-item>
        <a-menu-item key="file_manage">
          <RouterLink to="/files/manage">我的文件</RouterLink>
        </a-menu-item>
        <a-sub-menu key="admin">
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
        </a-sub-menu>
        <a-menu-item key="logout" @click="logout()">登出</a-menu-item>
      </a-sub-menu>
      <a-menu-item v-if="!userStore?.getIsAuthenticated" class="ml-auto">
        <RouterLink to="/login">Login</RouterLink>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
  <a-layout-content>
    <RouterView />
  </a-layout-content>
  <!--  <a-layout-footer class="text-center"> Ant Design ©2018 Created by Ant UED </a-layout-footer>-->
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const logout = function () {
  userStore.setUser(null)
  router.replace({ name: 'home' })
}
</script>

<style scoped lang="scss">
.leading-h-12 {
  line-height: 3rem;
}

:deep(.menu-none) {
  cursor: default !important;

  &.flex-1 {
    flex: 1 !important;
  }
}

.logo {
  height: 31px;
}

:deep(.ml-auto) {
  margin-left: auto !important;
}
</style>
