<template>
  <div class="create-container">
    <NavBarForProject>
      <a-button
        class="mr-3 button-save"
        :saving="saving"
        @click="handleProjectUpdate(false)"
      >
        Save
      </a-button>
      <a-button
        v-if="!projectDetail.isPublish"
        class="mr-3 button-publish"
        :saving="saving"
        @click="handleProjectUpdate(true)"
      >
        Save and publish
      </a-button>
      <a-button
        v-if="projectDetail.isPublish"
        class="mr-3 button-warning"
        :saving="saving"
        @click="handleProjectOffline()"
      >
        Offline
      </a-button>
      <a-button
        v-if="projectDetail.isPublish"
        class="mr-3 button-warning"
        danger
        :saving="saving"
        @click="handleTransferModalShow"
      >
        Transfer
      </a-button>
    </NavBarForProject>
    <div class="content-container">
      <div class="title">{{ projectDetail.title }}</div>
      <div class="flex items-center flex-col w-full">
        <div class="max-w-screen-lg w-full mt-6">
          <a-form
            ref="formRef"
            label-align="left"
            :model="formState"
            name="basic"
            :rules="rules"
            autocomplete="off"
            :label-col="{ style: { width: '8.75rem' } }"
          >
            <a-form-item
              label="Project name"
              name="title"
              required
            >
              <a-input
                v-model:value="formState.title"
                placeholder="Project name"
                size="large"
              />
            </a-form-item>

            <a-form-item
              label="Tags"
              name="tags"
            >
              <a-select
                v-model:value="formState.tags"
                mode="tags"
                size="large"
                placeholder="Tags"
                :options="[]"
              ></a-select>
            </a-form-item>
            <a-form-item
              v-if="projectDetail.isPrivate"
              label="Invitee"
              name="public"
            >
              <a-select
                v-model:value="formState.members"
                size="large"
                mode="tags"
                placeholder="Invitee"
                :options="[]"
              ></a-select>
            </a-form-item>

            <a-form-item
              label="H5AD file"
              name="h5ad_id"
              required
            >
              <a-button
                v-if="!formState.h5ad_id"
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                size="large"
                @click="fileModalRef?.open('h5ad_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                H5AD file
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                danger
                size="large"
                @click="formState.h5ad_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.h5ad_id }}
              </a-button>
            </a-form-item>

            <a-form-item
              v-if="!projectDetail.isPrivate"
              label="Excel file"
              name="excel_id"
            >
              <a-button
                v-if="!formState.excel_id"
                size="large"
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                @click="fileModalRef?.open('excel_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                Excel file
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                danger
                size="large"
                @click="formState.excel_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.excel_id }}
              </a-button>
              <div class="mt-2">
                Please upload in the following format:
                <a href="./update_file.xlsx">update_file.xlsx</a>
              </div>
            </a-form-item>
            <a-form-item
              label="UMap file"
              name="umap_id"
              required
            >
              <a-button
                v-if="!formState.umap_id"
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                size="large"
                @click="fileModalRef?.open('umap_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                UMap file
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                danger
                size="large"
                @click="formState.umap_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.umap_id }}
              </a-button>
            </a-form-item>
            <a-form-item
              label="CellMarker file"
              name="cell_marker_id"
            >
              <a-button
                v-if="!formState.cell_marker_id"
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                size="large"
                @click="fileModalRef?.open('cell_marker_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                CellMarker file
              </a-button>
              <a-button
                v-else
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                danger
                size="large"
                @click="formState.cell_marker_id = null"
              >
                <template #icon>
                  <MinusOutlined></MinusOutlined>
                </template>
                {{ formState.cell_marker_id }}
              </a-button>
            </a-form-item>

            <a-form-item
              label="Description"
              name="description"
              required
            >
              <a-textarea
                v-model:value="formState.description"
                show-count
                :maxlength="1000"
                size="large"
                :auto-size="{ minRows: 4 }"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <a-modal
      v-model:open="open"
      title="Transfer project"
      width="400px"
      :ok-button-props="{ shape: 'round' }"
      :cancel-button-props="{ shape: 'round' }"
      @ok="handleProjectTransfer"
    >
      <div class="py-5">
        <a-input
          v-model:value="transferMail"
          size="large"
          placeholder="enter the email address of new administrator"
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
  adminOfflineProject,
  adminProjectTransfer,
  getAdminProjectDetail,
  updateAdminProject,
} from "@/api/project.js"
import { message, Modal } from "ant-design-vue"
import FileModalView from "@/views/File/ModalView.vue"
import NavBarForProject from "@/components/NavBarForProject.vue"

const props = defineProps({
  id: { required: true, type: [Number, String] },
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
      message: "Project name can not be blank",
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: "Description can not be blank",
      trigger: "blur",
    },
  ],
  organ: [
    {
      required: true,
      message: "Organ can not be blank",
      trigger: "blur",
    },
  ],
  species_id: [
    {
      required: true,
      message: "Species can not be blank",
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
      other_file_ids: (data.project_analysis_meta[0].other_file_ids || "")
        .split(",")
        .filter((item) => item),
      pathway_id: data.project_analysis_meta[0].pathway_id,
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
      pathway_id,
      h5ad_id,
      other_file_ids,
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
      is_publish: isPublish ? true : projectDetail.value.isPublish,
      members: isPrivate ? members : [],
      description,
      excel_id,
      pathway_id,
      umap_id,
      other_file_ids,
      h5ad_id,
      cell_marker_id,
      analysis_id,
    })

    if (isPublish) {
      message.success("Save and publish success")
    } else {
      message.success("Save success")
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
    return message.error("Email can not be blank")
  }
  try {
    saving.value = true
    await adminProjectTransfer(props.id, transferMail.value)
    message.success("Transfer project success")
    await handleProjectFetch()
    open.value = false
  } finally {
    saving.value = false
  }
}

const handleProjectOffline = () => {
  Modal.confirm({
    title: "Offline confirm?",
    content:
      "Are you sure to bring this project offline as draft, no more shared with others? ",
    onOk: async () => {
      await adminOfflineProject(props.id)
      message.success("Offline project success")
      await handleProjectFetch()
    },
  })
}

// const handleProjectAduit = () => {
//   Modal.confirm({
//     title: "审核通过确认?",
//     content: "您确认现在审核通过改项目吗？",
//     onOk: async () => {
//       await approveProject(props.id)
//       message.success("审核通过项目成功")
//       await handleProjectFetch()
//     },
//   })
// }

const handleFileSelected = (record) => {
  formState.value[record.target] = record.file_id
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/screate.scss";
</style>
