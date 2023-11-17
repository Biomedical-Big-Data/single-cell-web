<template>
  <div class="content-container">
    <div class="search-container">
      <a-form :model="conditions" layout="vertical" autocomplete="off">
        <a-form-item label="Gene Name" name="name" class="condition-item">
          <a-input
            v-model:value="conditions.name"
            class="w-full"
            size="large"
            placeholder="Gene Name"
          ></a-input>
        </a-form-item>
        <a-form-item label="Gene Symbol" name="name" class="condition-item">
          <a-input
            v-model:value="conditions.symbol"
            class="w-full"
            size="large"
            placeholder="Gene Symbol"
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
            <a href="./gene_meta.xlsx" target="_blank">gene_meta.xlsx</a>
          </div>
        </div>
      </a-form>
    </div>

    <div class="table-container">
      <a-table
        class="w-full"
        bordered
        size="large"
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="list"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: columns.length * 150 }"
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
import { getGeneList, updateMetaByFile } from "@/api/meta"
import { message } from "ant-design-vue"

const conditions = ref({
  name: "",
  symbol: "",
})

const fileInputRef = ref(null)
const uploading = ref(false)

const columns = [
  ...[
    "gene_ensemble_id",
    "species_id",
    "ortholog",
    "gene_symbol",
    "gene_name",
    "alias",
    "gene_ontology",
    "gpcr",
    "tf",
    "surfaceome",
    "drugbank_drugtarget",
    "phenotype",
    "create_at",
    "update_at",
  ].map((item) => ({
    title: item,
    dataIndex: item,
    align: "center",
    width: 150,
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
} = usePagination(getGeneList, {
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
  return dataSource?.value?.gene_list || []
})

const getConditions = function () {
  const result = {}
  const { name, symbol } = conditions.value

  if (name) {
    result.gene_name = name
  }
  if (symbol) {
    result.gene_symbol = symbol
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
      await updateMetaByFile("gene", files[0])
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
