import { createRouter, createWebHashHistory } from "vue-router"
import nProgress from "nprogress"
import "nprogress/nprogress.css"

nProgress.configure({ showSpinner: false })

export const constantRoutes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/User/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/User/RegisterView.vue"),
  },
  {
    path: "/user/setting",
    name: "user_setting",
    component: () => import("../views/User/SettingView.vue"),
  },

  {
    path: "/user/active",
    name: "user_active",
    props: true,
    component: () => import("../views/User/UserActiveView.vue"),
  },

  {
    path: "/user/forget",
    name: "user_forget_password",
    component: () => import("../views/User/ForgetPasswordView.vue"),
  },

  {
    path: "/user/reset",
    name: "user_reset_password",
    component: () => import("../views/User/ResetPasswordView.vue"),
  },
  {
    path: "/files/manage",
    name: "files_manage",
    meta: {
      title: "文件管理",
    },
    component: () => import("../views/File/ManageView.vue"),
  },
  {
    path: "/projects",
    name: "projects",
    component: () => import("../views/Project/ListView.vue"),
  },
  {
    path: "/projects/manage",
    name: "projects_manage",
    component: () => import("../views/Project/ManageView.vue"),
  },
  {
    path: "/projects/create",
    name: "project_create",
    component: () => import("../views/Project/CreateView.vue"),
  },
  {
    path: "/projects/:id",
    name: "project_detail",
    props: true,
    component: () => import("../views/Project/DetailView.vue"),
  },
  {
    path: "/projects/update/:id",
    name: "project_detail_update",
    props: true,
    component: () => import("../views/Project/UpdateView.vue"),
  },
]

export const asyncRoutes = [
  {
    path: "/user/admin",
    name: "user_admin",
    meta: {
      title: "用户管理",
      roles: ["admin"],
    },
    component: () => import("../views/User/AdminView.vue"),
  },
  {
    path: "/user/setting/:id",
    name: "user_setting",
    meta: {
      title: "用户信息更新",
      roles: ["admin"],
    },
    props: true,
    component: () => import("../views/User/SettingView.vue"),
  },

  {
    path: "/projects/admin",
    name: "projects_admin",
    meta: {
      title: "项目管理",
      roles: ["admin"],
    },
    component: () => import("../views/Project/AdminView.vue"),
  },
  {
    path: "/projects/admin/update/:id",
    name: "project_admin_detail_update",
    meta: {
      title: "公开项目更新",
      roles: ["admin"],
    },
    props: true,
    component: () => import("../views/Project/AdminUpdateView.vue"),
  },
  {
    path: "/meta",
    component: () => import("../views/Meta/MainView.vue"),
    redirect: "/meta/species",
    children: [
      {
        path: "species",
        meta: {
          title: "Species Meta",
          roles: ["admin"],
        },
        component: () => import("../views/Meta/SpeciesView.vue"),
      },
      {
        path: "gene",
        meta: {
          title: "Gene Meta",
          roles: ["admin"],
        },
        component: () => import("../views/Meta/GeneView.vue"),
      },
      {
        path: "cell_type",
        meta: {
          title: "CellType Meta",
          roles: ["admin"],
        },
        component: () => import("../views/Meta/CellTypeView.vue"),
      },
    ],
  },
  {
    path: "/process/admin",
    name: "project_admin",
    meta: {
      title: "进程管理",
      roles: ["admin"],
    },
    component: () => import("../views/Process/AdminView.vue"),
  },
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...asyncRoutes, ...constantRoutes],
})

router.beforeEach(() => {
  nProgress.start()
  return true
})

// 全局后置钩子
router.afterEach(() => {
  nProgress.done()
})

export default router
