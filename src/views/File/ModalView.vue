<template>
  <a-modal
    v-model:open="open"
    class="simple-modal"
    title="File Selector"
    :footer="null"
    width="500"
    :centered="true"
    :mask-closable="false"
    :ok-button-props="{
      class: 'ok-button',
    }"
    :cancel-button-props="{
      class: 'cancel-button',
    }"
    @ok="confirm"
  >
    <div class="py-6">
      <a-form
        :model="conditions"
        layout="inline"
        autocomplete="off"
        class="items-center px-4"
      >
        <a-form-item
          label="File name"
          name="file_name"
          class="search-condition-item condition-item"
        >
          <a-input
            v-model:value="conditions.file_name"
            size="large"
            placeholder="File name"
          ></a-input>
        </a-form-item>
        <a-button
          type="primary"
          class="search-button"
          :loading="loading"
          @click="handleSearch"
        >
          Search all
        </a-button>
        <a-button
          type="primary"
          class="ml-4 cancel-button"
          :loading="uploading"
          @click="fileRef.click()"
        >
          Upload
        </a-button>
        <input
          ref="fileRef"
          type="file"
          hidden
          @change="handleUpload"
        />
      </a-form>
    </div>

    <div class="mt-5 rounded-lg bg-white">
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
          <template v-if="dataIndex === 'create_at'">
            {{ dayjs(text).format("YYYY-MM-DD") }}
          </template>
          <template v-if="dataIndex === 'action'">
            <a-button
              class="button-select"
              @click="handleFileSelected(record)"
            >
              Select
            </a-button>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:open="uploading"
      class="uploading-modal"
      title="Uploading"
      :footer="null"
      :closable="false"
      :mask-closable="false"
      :centered="true"
    >
      <div class="p-2">
        <div>{{ uploadFileName }}</div>
        <div class="mt-2">
          <a-progress
            class="w-full"
            :percent="uploadProgress"
          />
        </div>
        <div class="flex justify-center mt-4">
          <a-button
            type="primary"
            class="cancel-upload-button"
            :loading="canceling"
            @click="handleCancelUpload"
          >
            Cancel
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-modal>
</template>

<script setup>
import { computed, ref } from "vue"
import { usePagination } from "vue-request"
import { getMyProjectFile, uploadProjectFile } from "@/api/project"
import { message } from "ant-design-vue"
import dayjs from "dayjs"
import { filesize } from "filesize"

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
    title: "File ID",
    dataIndex: "file_id",
    width: "200px",
  },
  {
    title: "File name",
    dataIndex: "file_name",
  },
  {
    title: "File size",
    dataIndex: "file_size",
    customRender: ({ text }) => {
      return filesize(text)
    },
  },
  {
    title: "Upload time",
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
    page: 1,
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
      message.success("Upload success")
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

<style scoped lang="scss">
@import "@/assets/styles/modal-form";
</style>
