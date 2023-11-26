<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">
        <div>Personal Project List</div>
        <div v-if="showTip" class="progress-container">
          <div>
            <a-progress
              class="progress"
              :percent="percent"
              stroke-color="#FFFFFF"
              trail-color="rgba(255, 255, 255, 0.30)"
              :show-info="false"
            />
          </div>
          <div class="progress-desc">
            {{ projectCount }} of {{ projectLimit }} projects used
            <ApplyForSuper />
          </div>
        </div>
      </div>
      <div class="content-container">
        <div class="search-container">
          <a-form :model="conditions" autocomplete="off" layout="vertical">
            <a-form-item
              label="Project Name"
              name="project_name"
              class="condition-item"
            >
              <a-input
                v-model:value="conditions.title"
                class="w-full"
                size="large"
                placeholder="Project Name"
              ></a-input>
            </a-form-item>
            <a-form-item
              label="Project status"
              name="is_publish"
              class="condition-item"
            >
              <a-select
                v-model:value="conditions.is_publish"
                :options="PROJECT_STATUS_DESC"
                placeholder="Project status"
                class="w-full"
                size="large"
                allow-clear
              ></a-select>
            </a-form-item>
            <a-form-item label="Tags" name="tag" class="condition-item">
              <a-input
                v-model:value="conditions.tag"
                class="w-full"
                size="large"
                placeholder="Project tags"
              ></a-input>
            </a-form-item>
            <div class="action">
              <a-button type="primary" class="search" @click="handleSearch">
                Search all
              </a-button>
            </div>
          </a-form>
        </div>

        <div class="table-container">
          <a-table
            :columns="columns"
            bordered
            :row-key="(record) => record.id"
            :data-source="list"
            :pagination="pagination"
            :loading="loading"
            size="large"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column: { dataIndex }, text, record }">
              <template
                v-if="dataIndex === 'create_at' || dataIndex === 'update_at'"
              >
                {{ dayjs(text).format("YYYY-MM-DD") }}
              </template>
              <template v-if="dataIndex === 'is_publish'">
                <span :class="`publish-${text}`">
                  {{ getPublishState(text) }}
                </span>
              </template>
              <template v-if="dataIndex === 'is_private'">
                <span :class="`private-${text}`">
                  {{ getPrivateState(text) }}
                </span>
              </template>
              <template v-if="dataIndex === 'project_project_user_meta'">
                <div
                  v-for="member in geProjectMembers(record)"
                  :key="member.user_id"
                  class="member-item"
                >
                  {{ member.project_user_user_meta.user_name }} ({{
                    member.project_user_user_meta.email_address
                  }})
                  <span v-if="member.isOwner" class="role owner">Owner</span>
                </div>
              </template>
              <template v-if="dataIndex === 'tags'">
                <a-tag
                  v-for="item in (text || '').split(',').filter((a) => !!a)"
                  :key="item"
                  class="large-tag"
                >
                  {{ item }}
                </a-tag>
              </template>
              <template v-if="dataIndex === 'operation'">
                <a-button
                  type="link"
                  size="large"
                  @click="handleToProject(record)"
                >
                  View
                </a-button>
                <a-button
                  v-if="isOwner(record)"
                  type="link"
                  size="large"
                  @click="handleToProjectUpdate(record)"
                >
                  Edit
                </a-button>
                <a-button
                  v-if="isOwner(record)"
                  type="link"
                  size="large"
                  danger
                  :loading="removing"
                  @click="handleToProjectRemove(record)"
                >
                  Remove
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { usePagination } from "vue-request"
import dayjs from "dayjs"
import { getMyProjectList, removeProject } from "@/api/project"
import { useRouter } from "vue-router"
import { IS_PRIVATE_DESC, PROJECT_STATUS_DESC } from "@/constants/common.js"
import { useUserStore } from "@/stores/user"
import NavBar from "@/components/NavBar.vue"
import ApplyForSuper from "@/components/ApplyForSuper.vue"
import { getUserSpace } from "@/api/user.js"
import { message, Modal } from "ant-design-vue"

const userStore = useUserStore()

const router = useRouter()
const conditions = ref({
  title: "",
  tag: "",
  is_publish: undefined,
  is_private: undefined,
})

const projectLimit = 3
const projectCount = ref(0)
const removing = ref(false)

const isOwner = function (record) {
  return record.owner === userStore.getUser.id
}

const getPublishState = function (state) {
  return PROJECT_STATUS_DESC.find((item) => item.value === state)?.label
}
const getPrivateState = function (state) {
  return IS_PRIVATE_DESC.find((item) => item.value === state)?.label
}

const columns = [
  {
    title: "Project Name",
    dataIndex: "title",
  },
  {
    title: "Private",
    dataIndex: "is_private",
    align: "center",
  },
  {
    title: "Published",
    dataIndex: "is_publish",
    align: "center",
  },
  {
    title: "Members",
    dataIndex: "project_project_user_meta",
  },
  {
    title: "Tags",
    dataIndex: "tags",
  },
  {
    title: "Created Date",
    dataIndex: "create_at",
  },
  {
    title: "Updated Date",
    dataIndex: "update_at",
  },
  {
    title: "Operation",
    dataIndex: "operation",
    width: "250px",
  },
]

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(getMyProjectList, {
  defaultParams: [
    {
      page_size: 20,
    },
  ],
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
  },
})

const percent = computed(() => {
  return (projectCount.value / projectLimit) * 100
})

const showTip = computed(() => {
  return !userStore?.getUser.role
})

const list = computed(() => {
  return dataSource?.value?.project_list || []
})

const geProjectMembers = (record) => {
  const temp = record.project_project_user_meta.map((item) => ({
    ...item,
    isOwner: item.user_id === record.owner ? 1 : 0,
  }))
  temp.sort((a, b) => b.isOwner - a.isOwner)
  return temp
}
onMounted(() => {
  handleGetUserSpace()
})

const handleGetUserSpace = async () => {
  const data = await getUserSpace()
  projectCount.value = data.project_count
}
const getConditions = function () {
  const result = {}
  const { is_private, is_publish, title, tag } = conditions.value

  if (title) {
    result.title = title
  }

  if (tag) {
    result.tag = tag
  }

  if (!isNaN(is_private)) {
    result.is_private = is_private
  }
  if (!isNaN(is_publish)) {
    result.is_publish = is_publish
  }

  return result
}

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}))

const handleTableChange = (pag, filters, sorter) => {
  run({
    page_size: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
    ...getConditions(),
  })
}

const handleSearch = () => {
  run({
    page: 1,
    page_size: pageSize,
    ...getConditions(),
  })
}

const handleToProjectUpdate = (record) => {
  router.push({
    name: "project_detail_update",
    params: {
      id: record.id,
    },
  })
}

const handleToProjectRemove = (record) => {
  Modal.confirm({
    title: "Remove confirm?",
    content:
      "It cannot be recovered after deleting the project, and it will cause users who share the project to be unable to use the project, whether to continue or not?",
    onOk: async () => {
      try {
        removing.value = true
        await removeProject(record.id)
        message.success("Remove success")
        handleSearch()
        handleGetUserSpace()
      } finally {
        removing.value = false
      }
    },
  })
}

const handleToProject = (record) => {
  const routeData = router.resolve({
    name: "project_detail",
    params: {
      id: record.id,
    },
  })
  window.open(routeData.href, "_blank")
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/stable.scss";

.member-item {
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.1rem;
}
</style>
