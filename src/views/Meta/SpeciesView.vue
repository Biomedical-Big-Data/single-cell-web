<template>
  <div class="p-5">
    <div class="bg-white py-2 px-4 rounded-lg">
      <a-form :model="conditions" layout="inline" autocomplete="off">
        <a-form-item label="项目名称" name="project_name">
          <a-input
            v-model:value="conditions.title"
            class="w-28"
            placeholder="项目名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="状态" name="is_publish">
          <a-select
            v-model:value="conditions.is_publish"
            :options="PROJECT_STATUS_DESC"
            placeholder="项目状态"
            class="w-28"
            allow-clear
          ></a-select>
        </a-form-item>
        <a-form-item label="是否公开" name="is_private">
          <a-select
            v-model:value="conditions.is_private"
            :options="IS_PRIVATE_DESC"
            placeholder="是否公开"
            class="w-28"
            allow-clear
          ></a-select>
        </a-form-item>
        <a-form-item label="标签" name="tag">
          <a-input
            v-model:value="conditions.tag"
            class="w-28"
            placeholder="项目标签"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            class="flex items-center"
            @click="handleSearch"
          >
            <template #icon>
              <SearchOutlined></SearchOutlined>
            </template>
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="mt-5 rounded-lg bg-white">
      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="list"
        :pagination="pagination"
        :loading="loading"
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
            >
              {{ item }}
            </a-tag>
          </template>
          <template v-if="dataIndex === 'operation'">
            <a-button
              type="primary"
              size="small"
              @click="handleToProject(record)"
            >
              <template #icon>
                <EyeOutlined></EyeOutlined>
              </template>
              详情
            </a-button>
            <a-button
              class="ml-2"
              type="primary"
              size="small"
              @click="handleToAdminProject(record)"
            >
              <template #icon>
                <EditOutlined></EditOutlined>
              </template>
              编辑
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons-vue"
import { usePagination } from "vue-request"
import dayjs from "dayjs"
import { getMyProjectList } from "@/api/project"
import { useRouter } from "vue-router"
import { IS_PRIVATE_DESC, PROJECT_STATUS_DESC } from "@/constants/common.js"

const router = useRouter()
const conditions = ref({
  title: "",
  tag: "",
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
    title: "项目名称",
    dataIndex: "title",
  },
  {
    title: "是否私有",
    dataIndex: "is_private",
    width: 100,
    align: "center",
  },
  {
    title: "是否发布",
    dataIndex: "is_publish",
    width: 100,
    align: "center",
  },
  {
    title: "标签",
    dataIndex: "tags",
    width: 300,
  },
  {
    title: "创建时间",
    dataIndex: "create_at",
    width: 120,
  },
  {
    title: "更新时间",
    dataIndex: "update_at",
    width: 120,
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 200,
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
  size: "small",
}))

const handleTableChange = (pag, filters, sorter) => {
  run({
    results: pag.pageSize,
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
  console.log(record)
  const routeData = router.resolve({
    name: "project_detail",
    params: {
      id: record.id,
    },
  })
  // console.log(routeData)
  window.open(routeData.href, "_blank")
}
</script>

<style scoped lang="scss">
.condition-item {
  width: 100px !important;
}

.condition-item-lg {
  width: 130px !important;
}

:deep(.w-28) {
  width: 7rem !important;
}
</style>