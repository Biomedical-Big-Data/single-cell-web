<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">Project Manage</div>
      <div class="content-container">
        <div class="search-container">
          <a-form
            :model="conditions"
            layout="vertical"
            autocomplete="off"
          >
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
            <a-form-item
              label="is Private"
              name="is_private"
              class="condition-item"
            >
              <a-select
                v-model:value="conditions.is_private"
                :options="IS_PRIVATE_DESC"
                placeholder="is Private"
                class="w-full"
                size="large"
                allow-clear
              ></a-select>
            </a-form-item>
            <div class="action">
              <a-button
                type="primary"
                class="search"
                @click="handleSearch"
              >
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
            bordered
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
              <template v-if="dataIndex === 'tags'">
                <a-tag
                  v-for="item in (text || '').split(',').filter((a) => !!a)"
                  :key="item"
                  class="large-tag mb-1"
                >
                  {{ item }}
                </a-tag>
              </template>
              <template v-if="dataIndex === 'operation'">
                <a-button
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
import { getAdminProjectList } from "@/api/project"
import { useRouter } from "vue-router"
import { IS_PRIVATE_DESC, PROJECT_STATUS_DESC } from "@/constants/common.js"
import NavBar from "@/components/NavBar.vue"

const router = useRouter()
const conditions = ref({
  title: "",
  is_publish: undefined,
  is_private: undefined,
})

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
    title: "Cell number",
    dataIndex: "cell_number",
  },
  {
    title: "External project accesstion",
    dataIndex: "external_project_accesstion",
  },
  {
    title: "Private",
    dataIndex: "is_private",
    width: 100,
    align: "center",
  },
  {
    title: "Published",
    dataIndex: "is_publish",
    width: 100,
    align: "center",
  },
  {
    title: "Tags",
    dataIndex: "tags",
    width: 200,
  },
  {
    title: "User",
    dataIndex: ["project_user_meta", "user_name"],
    width: 120,
  },
  {
    title: "Created Date",
    dataIndex: "create_at",
    width: 120,
  },
  {
    title: "Updated Date",
    dataIndex: "update_at",
    width: 120,
  },
  {
    title: "Operation",
    dataIndex: "operation",
    width: 40,
    align: "center",
  },
]

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(getAdminProjectList, {
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
  const { is_publish, is_private, title } = conditions.value

  if (title) {
    result.title = title
  }

  if (!isNaN(is_publish)) {
    result.is_publish = is_publish
  }

  if (!isNaN(is_private)) {
    result.is_private = is_private
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

const handleToAdminProject = (record) => {
  router.push({
    name: "project_admin_detail_update",
    params: {
      id: record.id,
    },
  })
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/stable.scss";
</style>
