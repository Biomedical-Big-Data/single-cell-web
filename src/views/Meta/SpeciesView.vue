<template>
  <div class="content-container">
    <div class="search-container">
      <a-form :model="conditions" layout="vertical" autocomplete="off">
        <a-form-item label="Species Name" name="name" class="condition-item">
          <a-input
            v-model:value="conditions.name"
            class="w-full"
            size="large"
            placeholder="Species Name"
          ></a-input>
        </a-form-item>
        <div class="action">
          <a-button
            type="primary"
            class="search"
            :loading="loading"
            @click="handleSearch"
          >
            Search all
          </a-button>
          <a-button
            type="primary"
            class="reset"
            :loading="uploading"
            @click="handleUpdateFileSelect"
          >
            上传更新文件
          </a-button>
          <input ref="fileInputRef" type="file" hidden @change="handleUpdate" />
          <div class="example">
            示例文件:
            <a href="./species_meta.xlsx" target="_blank">species_meta.xlsx</a>
          </div>
        </div>
      </a-form>
    </div>

    <div class="table-container">
      <a-table
        size="large"
        :columns="columns"
        bordered
        :row-key="(record) => record.id"
        :data-source="list"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column: { dataIndex }, record }">
          <template v-if="dataIndex === 'operation'">
            <a-button
              class="ml-2"
              type="primary"
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
import { EditOutlined } from "@ant-design/icons-vue"
import { usePagination } from "vue-request"
import { getSpecialList, updateMetaByFile } from "@/api/meta"
import { message } from "ant-design-vue"

const conditions = ref({
  name: "",
})

const fileInputRef = ref(null)
const uploading = ref(false)

const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 40,
    align: "center",
  },
  {
    title: "species",
    dataIndex: "species",
    align: "center",
  },
  {
    title: "species_ontology_label",
    dataIndex: "species_ontology_label",
    align: "center",
  },
  // {
  //   title: "操作",
  //   dataIndex: "operation",
  //   width: 200,
  //   align: "center",
  // },
]

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(getSpecialList, {
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
  return dataSource?.value?.species_list || []
})

const getConditions = function () {
  const result = {}
  const { name } = conditions.value

  if (name) {
    result.species = name
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

const handleUpdateFileSelect = () => {
  fileInputRef.value?.click()
}

const handleUpdate = async (event) => {
  const files = event.target.files
  if (files.length > 0) {
    try {
      uploading.value = true
      await updateMetaByFile("species", files[0])
      message.success("上传更新文件成功，结果将以邮件形式通知")
    } finally {
      fileInputRef.value.value = null
      uploading.value = false
    }
  } else {
    message.error("请选择文件")
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/stable.scss";

.example {
  text-align: center;
  font-size: 1rem;
  color: #fff;

  a {
    color: #fff;
  }
}
</style>
