<template>
  <a-modal
    v-model:open="open"
    title="选择文件"
    :footer="null"
    width="500"
    :centered="true"
  >
    <div class="bg-white py-2 px-4 rounded-lg">
      <a-form :model="conditions" layout="inline" autocomplete="off">
        <a-form-item label="文件名称" name="file_name">
          <a-input
            v-model:value="conditions.file_name"
            class="w-56"
            placeholder="文件名称"
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
            @click="fileRef.click()"
          >
            <template #icon>
              <CloudUploadOutlined></CloudUploadOutlined>
            </template>
            上传
          </a-button>
          <input ref="fileRef" type="file" hidden @change="handleUpload" />
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
          <template v-if="dataIndex === 'create_at'">
            {{ dayjs(text).format("YYYY-MM-DD") }}
          </template>
          <template v-if="dataIndex === 'action'">
            <a-button @click="handleFileSelected(record)">选择</a-button>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:open="uploading"
      title="Uploading"
      :footer="null"
      :closable="false"
      :mask-closable="false"
      :centered="true"
    >
      <div class="p-2">
        <div>{{ uploadFileName }}</div>
        <div class="mt-2">
          <a-progress class="w-full" :percent="uploadProgress" />
        </div>
        <div>
          <a-button
            type="primary"
            :loading="canceling"
            @click="handleCancelUpload"
          >
            取消上传
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-modal>
</template>

<script setup>
import { computed, ref } from "vue"
import { SearchOutlined, CloudUploadOutlined } from "@ant-design/icons-vue"
import { usePagination } from "vue-request"
import { getMyProjectFile, uploadProjectFile } from "@/api/project"
import { message } from "ant-design-vue"
import dayjs from "dayjs"

const emits = defineEmits(["selected"])

const fileRef = ref()
const target = ref(null)
const uploadFileName = ref("")
const uploadProgress = ref(0)
const open = ref(false)
const uploading = ref(false)
const canceling = ref(false)
const conditions = ref({
  file_name: "",
})
const controller = ref(null)

const columns = [
  {
    title: "文件ID",
    dataIndex: "file_id",
    width: "200px",
  },
  {
    title: "文件名称",
    dataIndex: "file_name",
  },
  {
    title: "文件大小",
    dataIndex: "file_size",
  },
  {
    title: "上传时间",
    dataIndex: "create_at",
    width: "150px",
    align: "center",
  },
  {
    title: "",
    dataIndex: "action",
    width: "150px",
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
} = usePagination(getMyProjectFile, {
  defaultParams: [
    {
      page_size: 10,
    },
  ],
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
  },
  manual: true,
})

const list = computed(() => {
  return dataSource?.value?.h5ad_list || []
})

const getConditions = function () {
  const result = {}
  const { file_name } = conditions.value

  if (file_name) {
    result.file_name = file_name
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

const handleOpen = (t) => {
  open.value = true
  target.value = t
  handleSearch()
}

const handleSearch = () => {
  run({
    page: current,
    page_size: pageSize,
    ...getConditions(),
  })
}

const handleUpload = async (event) => {
  const files = event.target.files
  if (files.length) {
    try {
      uploading.value = true
      controller.value = new AbortController()
      const file = files[0]
      uploadFileName.value = file.name
      await uploadProjectFile(file, {
        signal: controller.value.signal,
        onUploadProgress: ({ progress }) => {
          updateProgress(progress)
        },
      })
      message.success("上传成功")
      handleSearch()
    } finally {
      fileRef.value.value = null
      uploading.value = false
      canceling.value = false
    }
  }
}

const handleCancelUpload = async () => {
  controller.value?.abort()
  canceling.value = true
}

const handleFileSelected = (record) => {
  emits("selected", { ...record, target: target.value })
  open.value = false
}

const updateProgress = (progress) => {
  uploadProgress.value = +(progress * 100).toFixed(2)
}

defineExpose({
  open: handleOpen,
})
</script>

<style scoped lang="scss"></style>
