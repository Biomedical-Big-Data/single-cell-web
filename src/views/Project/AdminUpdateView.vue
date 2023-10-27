<template>
  <div class="p-5 page">
    <a-card :title="projectDetail.title" :bordered="false">
      <div class="flex items-center flex-col w-full">
        <div class="max-w-lg w-full mt-6">
          <a-form
            ref="formRef"
            :model="formState"
            name="basic"
            :rules="rules"
            autocomplete="off"
            :label-col="{ span: 5 }"
          >
            <a-form-item label="项目名称" name="title" required>
              <a-input v-model:value="formState.title" placeholder="项目名称" />
            </a-form-item>

            <a-form-item label="标签" name="tags">
              <a-select
                v-model:value="formState.tags"
                mode="tags"
                placeholder="标签"
                :options="[]"
              ></a-select>
            </a-form-item>

            <a-form-item label="访问权限" name="public">
              <a-switch v-model:checked="formState.isPrivate" />
              私有，仅受邀人可看
            </a-form-item>

            <a-form-item
              v-if="!!formState.isPrivate"
              label="可访问人员"
              name="public"
            >
              <a-select
                v-model:value="formState.members"
                mode="tags"
                placeholder="受邀人"
                :options="[]"
              ></a-select>
            </a-form-item>

            <a-form-item label="H5AD文件" name="h5ad_id" required>
              <a-button
                v-if="!formState.h5ad_id"
                class="w-full flex items-center"
                type="dashed"
                @click="fileModalRef?.open('h5ad_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                H5AD 文件
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center"
                type="dashed"
                danger
                @click="formState.h5ad_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.h5ad_id }}
              </a-button>
            </a-form-item>

            <a-form-item label="Excel文件" name="excel_id" required>
              <a-button
                v-if="!formState.excel_id"
                class="w-full flex items-center"
                type="dashed"
                @click="fileModalRef?.open('excel_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                Excel 文件
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center"
                type="dashed"
                danger
                @click="formState.excel_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.excel_id }}
              </a-button>
            </a-form-item>
            <a-form-item label="UMap文件" name="umap_id" required>
              <a-button
                v-if="!formState.umap_id"
                class="w-full flex items-center"
                type="dashed"
                @click="fileModalRef?.open('umap_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                UMap 文件
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center"
                type="dashed"
                danger
                @click="formState.umap_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.umap_id }}
              </a-button>
            </a-form-item>
            <a-form-item label="Cell Type" name="cell_marker_id">
              <a-button
                v-if="!formState.cell_marker_id"
                class="w-full flex items-center"
                type="dashed"
                @click="fileModalRef?.open('cell_marker_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                Cell Type Marker 文件
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center"
                type="dashed"
                danger
                @click="formState.cell_marker_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.cell_marker_id }}
              </a-button>
            </a-form-item>

            <a-form-item label="项目描述" name="description" required>
              <a-textarea
                v-model:value="formState.description"
                show-count
                :maxlength="1000"
                :auto-size="{ minRows: 4 }"
              />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 5 }">
              <a-button
                class="mr-3"
                :saving="saving"
                @click="handleProjectUpdate(false)"
              >
                保存
              </a-button>
              <a-button
                v-if="projectDetail.isPrivate && projectDetail.isPublish"
                class="mr-3"
                :saving="saving"
                @click="handleProjectOffline()"
              >
                下线
              </a-button>
              <a-button
                v-if="projectDetail.isPublish"
                class="mr-3"
                danger
                :saving="saving"
                @click="handleTransferModalShow"
              >
                转移项目
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-card>
    <a-modal
      v-model:open="open"
      title="转移项目"
      width="300px"
      @ok="handleProjectTransfer"
    >
      <div class="py-5">
        <a-input
          v-model:value="transferMail"
          placeholder="请输入新管理员邮箱"
        ></a-input>
      </div>
    </a-modal>
  </div>
  <FileModalView
    ref="fileModalRef"
    @selected="handleFileSelected"
  ></FileModalView>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons-vue"
import {
  getAdminProjectDetail,
  offlineProject,
  transferProject,
  updateAdminProject,
} from "@/api/project.js"
import { message, Modal } from "ant-design-vue"
import FileModalView from "@/views/File/ModalView.vue"

const props = defineProps({
  id: { required: true },
})

const formState = ref({
  title: "",
  species_id: undefined,
  organ: "",
  tags: [],
  members: [],
  description: "",
  isPrivate: true,
  excel_id: null,
  h5ad_id: null,
  umap_id: null,
  cell_marker_id: null,
  analysis_id: null,
})
const projectDetail = ref({})

const transferMail = ref("")
const fileModalRef = ref()
const open = ref(false)
const loading = ref(false)
const saving = ref(false)
const formRef = ref()
const rules = {
  title: [
    {
      required: true,
      message: "项目名称不能为空",
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: "项目描述不能为空",
      trigger: "blur",
    },
  ],
  organ: [
    {
      required: true,
      message: "Organ不能为空",
      trigger: "blur",
    },
  ],
  species_id: [
    {
      required: true,
      message: "Species不能为空",
      trigger: "change",
    },
  ],
}

onMounted(() => {
  handleProjectFetch()
})

const handleProjectFetch = async () => {
  try {
    loading.value = true
    const data = await getAdminProjectDetail(props.id)
    const result = {
      title: data.title,
      tags: data.tags ? data.tags.split(",") : [],
      members: data.project_project_user_meta
        .filter(
          (item) =>
            item.project_user_user_meta.id !== data.project_user_meta.id,
        )
        .map((item) => item.project_user_user_meta.email_address),
      description: data.description,
      isPrivate: !!data.is_private,
      h5ad_id: data.project_analysis_meta[0].h5ad_id,
      excel_id: data.project_analysis_meta[0].excel_id,
      umap_id: data.project_analysis_meta[0].umap_id,
      cell_marker_id: data.project_analysis_meta[0].cell_marker_id,
      analysis_id: data.project_analysis_meta[0].id,
    }
    formState.value = result
    projectDetail.value = {
      ...result,
      isPublish: !!data.is_publish,
    }
  } finally {
    loading.value = false
  }
}

const handleProjectUpdate = async (isPublish) => {
  try {
    await formRef.value.validate()
    const {
      title,
      species_id,
      organ,
      tags,
      description,
      isPrivate,
      members,
      excel_id,
      umap_id,
      h5ad_id,
      cell_marker_id,
      analysis_id,
    } = formState.value
    saving.value = true
    await updateAdminProject({
      project_id: props.id,
      title,
      species_id,
      organ,
      tags: tags.join(","),
      is_private: isPrivate,
      is_publish: isPublish,
      members: isPrivate ? members : [],
      description,
      excel_id,
      umap_id,
      h5ad_id,
      cell_marker_id,
      analysis_id,
    })

    if (isPublish) {
      message.success("保存并发布成功")
    } else {
      message.success("保存成功")
    }
    await handleProjectFetch()
  } finally {
    saving.value = false
  }
}

const handleTransferModalShow = () => {
  open.value = true
}

const handleProjectTransfer = async () => {
  if (!transferMail.value) {
    return message.error("邮箱不能为空")
  }
  try {
    saving.value = true
    await transferProject(props.id, transferMail.value)
    message.success("转移项目成功")
    await handleProjectFetch()
    open.value = false
  } finally {
    saving.value = false
  }
}

const handleProjectOffline = () => {
  Modal.confirm({
    title: "下线确认?",
    content: "您确认现在下线改项目吗？",
    onOk: async () => {
      await offlineProject(props.id)
      message.success("下线项目成功")
      await handleProjectFetch()
    },
  })
}

const handleFileSelected = (record) => {
  formState.value[record.target] = record.file_id
}
</script>

<style lang="scss" scoped></style>
