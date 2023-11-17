<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">Project List</div>
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
                {{ getPublishState(text) }}
              </template>
              <template v-if="dataIndex === 'is_private'">
                {{ getPrivateState(text) }}
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
                  class="ml-2"
                  type="link"
                  size="large"
                  @click="handleToAdminProject(record)"
                >
                  Edit
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
import { computed, ref } from "vue"
import { usePagination } from "vue-request"
import dayjs from "dayjs"
import { getMyProjectList } from "@/api/project"
import { useRouter } from "vue-router"
import { IS_PRIVATE_DESC, PROJECT_STATUS_DESC } from "@/constants/common.js"
import { useUserStore } from "@/stores/user"
import NavBar from "@/components/NavBar.vue"

const userStore = useUserStore()

const router = useRouter()
const conditions = ref({
  title: "",
  tag: "",
  is_publish: undefined,
  is_private: undefined,
})

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
    width: "230px",
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

const list = computed(() => {
  return dataSource?.value?.project_list || []
})

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
    page: current,
    page_size: pageSize,
    ...getConditions(),
  })
}

const handleToAdminProject = (record) => {
  router.push({
    name: "project_detail_update",
    params: {
      id: record.id,
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
</style>
