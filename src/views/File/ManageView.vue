<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">
        <div>File List</div>
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
            {{ filesize(diskSpace) }} / {{ filesize(spaceLimit) }} ({{
              percent.toFixed(2)
            }}%)
            <ApplyForSuper />
          </div>
        </div>
      </div>
      <div class="content-container">
        <div class="search-container">
          <a-form :model="conditions" layout="vertical" autocomplete="off">
            <a-form-item
              label="File Name"
              name="file_name"
              class="condition-item"
            >
              <a-input
                v-model:value="conditions.file_name"
                class="w-full"
                size="large"
                placeholder="File Name"
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
                @click="fileRef.click()"
              >
                Upload
              </a-button>
              <input ref="fileRef" type="file" hidden @change="handleUpload" />
            </div>
          </a-form>
        </div>
        <div class="table-container">
          <a-table
            size="large"
            :columns="columns"
            :row-key="(record) => record.id"
            :data-source="list"
            :pagination="pagination"
            bordered
            :loading="loading"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column: { dataIndex }, record, text }">
              <template v-if="dataIndex === 'create_at'">
                {{ dayjs(text).format("YYYY-MM-DD") }}
              </template>
              <template v-if="dataIndex === 'operation'">
                <a-button
                  type="text"
                  size="large"
                  :loading="removing"
                  danger
                  @click="handleRemoveFile(record)"
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
  <a-modal
    v-model:open="uploading"
    class="uploading-modal"
    :centered="true"
    title="Uploading"
    :footer="null"
    :closable="false"
    size="large"
    :mask-closable="false"
  >
    <div class="p-2">
      <div>{{ uploadFileName }}</div>
      <div class="mt-2">
        <a-progress class="w-full" :percent="uploadProgress" />
      </div>
      <div class="flex justify-center mt-4">
        <a-button
          type="primary"
          :loading="canceling"
          class="cancel-upload-button"
          @click="handleCancelUpload"
        >
          Cancel
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { usePagination } from "vue-request"
import {
  getMyProjectFile,
  removeMyProjectFile,
  uploadProjectFile,
} from "@/api/project"
import { message, Modal } from "ant-design-vue"
import dayjs from "dayjs"
import NavBar from "@/components/NavBar.vue"
import { filesize } from "filesize"
import ApplyForSuper from "@/components/ApplyForSuper.vue"
import { useUserStore } from "@/stores/user.js"
import { getUserSpace } from "@/api/user.js"

const userStore = useUserStore()
const spaceLimit = 10 * 1000 * 1000 * 1000 //10GB
const diskSpace = ref(0)
const fileRef = ref()
const removing = ref(false)
const uploading = ref(false)
const canceling = ref(false)
const uploadFileName = ref("")
const uploadProgress = ref(0)
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
    width: 150,
    align: "center",
  },
  {
    title: "Operation",
    dataIndex: "operation",
    width: 150,
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
      page_size: 20,
    },
  ],
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
  },
})

const percent = computed(() => {
  return (diskSpace.value / spaceLimit) * 100
})

const list = computed(() => {
  return dataSource?.value?.h5ad_list || []
})

const showTip = computed(() => {
  return !userStore?.getUser.role
})

onMounted(() => {
  handleGetUserSpace()
})

const handleGetUserSpace = async () => {
  const data = await getUserSpace()
  diskSpace.value = data.disk_space
}

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
      controller.value = new AbortController()
      uploading.value = true
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
      handleGetUserSpace()
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

const updateProgress = (progress) => {
  uploadProgress.value = +(progress * 100).toFixed(2)
}

const handleRemoveFile = async (record) => {
  Modal.confirm({
    title: "Remove confirm?",
    content: "The file cannot be restored after deletion. Are you sure?",
    onOk: async () => {
      try {
        removing.value = true
        await removeMyProjectFile(record.file_id)
        message.success("Remove success")
        handleSearch()
        handleGetUserSpace()
      } finally {
        removing.value = false
      }
    },
  })
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/stable.scss";
</style>
