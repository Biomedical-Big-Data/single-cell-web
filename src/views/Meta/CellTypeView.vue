<template>
  <div class="p-5">
    <div class="bg-white py-2 px-4 rounded-lg">
      <a-form :model="conditions" layout="inline" autocomplete="off">
        <a-form-item label="名称" name="cell_type_name">
          <a-input
            v-model:value="conditions.cell_type_name"
            class="w-28"
            placeholder="名称"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            class="flex items-center"
            :loading="loading"
            @click="handleSearch"
          >
            <template #icon>
              <SearchOutlined></SearchOutlined>
            </template>
            查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            class="flex items-center"
            :loading="uploading"
            @click="handleUpdateFileSelect"
          >
            <template #icon>
              <UploadOutlined></UploadOutlined>
            </template>
            上传更新文件
          </a-button>
          <input ref="fileInputRef" type="file" hidden @change="handleUpdate" />
        </a-form-item>
        <a-form-item>
          示例文件:
          <a href="./cell_type_meta.xlsx" target="_blank">
            cell_type_meta.xlsx
          </a>
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
import {
  SearchOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons-vue"
import { usePagination } from "vue-request"
import { getCellTypeList, updateMetaByFile } from "@/api/meta"
import { message } from "ant-design-vue"

const conditions = ref({
  cell_type_name: "",
})

const fileInputRef = ref(null)
const uploading = ref(false)

const columns = [
  ...[
    "cell_type_id",
    "cell_type_alias_id",
    "species_id",
    "marker_gene_symbol",
    "cell_taxonomy_id",
    "cell_taxonomy_url",
    "cell_ontology_id",
    "cell_type_name",
    "cell_type_description",
    "cell_type_ontology_label",
    "create_at",
    "update_at",
  ].map((item) => ({
    title: item,
    dataIndex: item,
    align: "center",
  })),
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
} = usePagination(getCellTypeList, {
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
  return dataSource?.value?.cell_type_list || []
})

const getConditions = function () {
  const result = {}
  const { cell_type_name } = conditions.value

  if (cell_type_name) {
    result.cell_type_name = cell_type_name
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

const handleUpdateFileSelect = () => {
  fileInputRef.value?.click()
}

const handleUpdate = async (event) => {
  const files = event.target.files
  if (files.length > 0) {
    try {
      uploading.value = true
      await updateMetaByFile("cell_type", files[0])
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
