<template>
  <div class="nav">
    <div
      v-if="route.name === 'home'"
      class="nav-project"
    >
      <router-link
        class="project no-underline"
        :to="{ name: 'projects' }"
      >
        <span class="text-center">Public Project</span>
        <span class="button-desc">exploring</span>
      </router-link>
      <a
        class="about"
        @click="open = true"
      >
        <span>about</span>
      </a>
    </div>
    <div
      v-else
      class="back-container"
      @click="handleGoHome()"
    >
      <img
        src="@/assets/icons/icon-back.svg"
        alt=""
      />
      <span>Home</span>
    </div>
    <div
      v-if="userStore?.getIsAuthenticated"
      class="user-container"
    >
      <a-button
        class="create-action"
        @click="handleGoProjectCreate()"
      >
        <PlusOutlined />
        Create Project
      </a-button>
      <a-dropdown>
        <div class="cursor-pointer avatar">
          <UserOutlined />
          {{ userStore.getUser?.user_name }}
          <span
            v-if="showRoleLabel"
            class="role"
            :class="roleName"
          >
            {{ roleName }}
          </span>
        </div>
        <template #overlay>
          <a-menu class="user-menu">
            <a-menu-item
              key="user_setting"
              class="large-menu"
            >
              <RouterLink to="/user/setting">User setting</RouterLink>
            </a-menu-item>
            <a-menu-item
              key="projects_manage"
              class="large-menu"
            >
              <RouterLink to="/projects/manage">Personal projects</RouterLink>
            </a-menu-item>
            <a-menu-item
              key="file_manage"
              class="large-menu"
            >
              <RouterLink to="/files/manage">My files</RouterLink>
            </a-menu-item>
            <a-sub-menu
              v-if="userStore.getUser.role === 1"
              key="admin"
              class="large-menu"
            >
              <template #title><span>System manage</span></template>
              <a-menu-item
                key="user_admin"
                class="large-menu"
              >
                <RouterLink to="/user/admin">User manage</RouterLink>
              </a-menu-item>
              <a-menu-item
                key="project_admin"
                class="large-menu"
              >
                <RouterLink to="/projects/admin">Project manage</RouterLink>
              </a-menu-item>
              <a-menu-item
                key="process_admin"
                class="large-menu"
              >
                <RouterLink to="/process/admin">Process manage</RouterLink>
              </a-menu-item>
              <a-menu-item
                key="meta_admin"
                class="large-menu"
              >
                <RouterLink to="/meta">Meta manage</RouterLink>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item
              key="logout"
              class="large-menu"
              @click="logout()"
            >
              Logout
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div
      v-else
      class="flex items-center"
    >
      <router-link
        class="login no-underline"
        :to="{ name: 'login', query: { feedback: route.name } }"
      >
        <span>Login</span>
        <span class="button-desc">To manage projects</span>
      </router-link>
      <router-link
        class="sign-up no-underline"
        :to="{ name: 'register' }"
      >
        <span>Sign up</span>
        <span class="button-desc">To create or share private projects</span>
      </router-link>
    </div>
  </div>

  <a-modal
    v-model:open="open"
    width="1000px"
    centered
    :footer="null"
  >
    <template #title>
      <div class="text-center single-modal-title pt-4">About</div>
    </template>
    <div class="single-modal-body">
      <p>
        This website is constructed to make single-cell data more easily shared
        and accessible to more researchers without programming skills.
      </p>
      <p>Function of this website comes in two ways at this moment:</p>
      <p>
        1, Make analyzed single cell sequencing data interactively visualized
        and shared publicly. You are welcome to name datasets that highly
        interested you.
      </p>
      <p>
        2, Host analyzed data privately for submitter. The submitter will have
        privilege to give access permission to group members. In this way,
        registered users can share their data within his or her group more
        easily before research is published. The interactive visualization will
        make communication and collaborate over the dataset much more
        straightforward.
      </p>
      <p>
        Besides these two purposes, you are also welcome to use this website for
        education purposes. For example, you can show case to students on what
        single cell data looks like and what can single cell dataset tells.
      </p>
      <p>
        We adopt cellxgene (1) and cellxgene vip (2) for interactive
        visualization. For integrated meta information organization with public
        projects, we tried our best to using unified nomenclature. We adopted
        cell taxonomy (3) naming system for cell types and followed similar
        scheme of single cell portal (4) for other meta information.
      </p>
      <p>
        Besides analyzing and release more publicly available datasets in the
        public project’s session.
      </p>
      <p>We are also planning to add more bioinformatics analysis tools.</p>
      <p>Your suggestions and feedback will be always appreciated.</p>
      <p>
        Contact :
        <a
          href="mailto:Jianglch@shanghaitech.edu.cn"
          target="_blank"
        >
          Jianglch@shanghaitech.edu.cn
        </a>
        or
        <a
          href="mailto:Wangwei@shanghaitech.edu.cn"
          target="_blank"
        >
          Wangwei@shanghaitech.edu.cn
        </a>
      </p>
      <p></p>
      <p>References:</p>
      <p>
        1, CELLxGENE: a performant, scalable exploration platform for high
        dimensional sparse matrices CZI Single-Cell Biology, et al. bioRxiv
        2021.04.05; doi:
        <a
          href="https://doi.org/10.1101/2021.04.05.438318"
          target="_blank"
        >
          https://doi.org/10.1101/2021.04.05.438318
        </a>
        .
      </p>
      <p>
        2, Cellxgene VIP unleashes full power of interactive visualization and
        integrative analysis of scRNA-seq, spatial transcriptomics, and multiome
        data
      </p>
      <p>
        Kejie Li, Zhengyu Ouyang, Yirui Chen, Jacob Gagnon, Dongdong Lin,
        Michael Mingueneau, Will Chen, David Sexton, Baohong Zhang
      </p>
      <p>
        bioRxiv 2020.08.28.270652; doi:
        <a
          href="https://doi.org/10.1101/2020.08.28.270652"
          target="_blank"
        >
          https://doi.org/10.1101/2020.08.28.270652
        </a>
      </p>
      <p>
        3, Jiang, S., Qian, Q., Zhu, T., Zong, W., Shang, Y., Jin, T., Zhang,
        Y., Chen, M., Wu, Z., Chu, Y. et al. (2023) Cell Taxonomy: a curated
        repository of cell types with multifaceted characterization. Nucleic
        Acids Res, 51, D853-D860.
      </p>
      <p>
        4,
        <a
          href="https://singlecell.broadinstitute.org/single_cell"
          target="_blank"
        >
          https://singlecell.broadinstitute.org/single_cell
        </a>
      </p>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/stores/user.js"
import { UserOutlined, PlusOutlined } from "@ant-design/icons-vue"
import { USER_ROLE_DESC } from "@/constants/user.js"
import { computed } from "vue"

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

const open = ref(false)

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
    text-transform: capitalize;
    cursor: pointer;
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

.single-modal {
  &-title {
    font-size: 1.5rem;
    font-weight: bold;
  }

  &-body {
    font-size: 1rem;
  }
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
