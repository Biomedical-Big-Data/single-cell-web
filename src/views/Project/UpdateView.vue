<template>
  <div class="create-container">
    <NavBarForProject>
      <template #back>
        <div class="back-container" @click="handleGoPrivateProject()">
          <img src="@/assets/icons/icon-back.svg" alt="" />
          <span>Back to my personal projects</span>
        </div>
      </template>
      <a-button
        v-if="!projectDetail.isPublish"
        type="primary"
        class="mr-3 button-publish"
        :saving="saving"
        @click="handleProjectUpdate(true)"
      >
        Save and publish
      </a-button>
      <a-button
        v-if="projectDetail.isPrivate"
        class="mr-3 button-save"
        :saving="saving"
        @click="handleProjectUpdate(false)"
      >
        Save
      </a-button>
      <a-button
        v-if="projectDetail.isPublish"
        class="mr-3 button-save"
        :saving="saving"
        @click="handleProjectOffline()"
      >
        Offline
      </a-button>
      <a-button
        class="mr-3 button-save"
        :saving="saving"
        @click="handleTransferModalShow('copy')"
      >
        Copy
      </a-button>
      <a-button
        class="mr-3 button-warning"
        :saving="saving"
        @click="handleTransferModalShow('transfer')"
      >
        Transfer
      </a-button>
      <a-button
        class="mr-3 button-warning"
        :saving="saving"
        @click="handleTransferToPublic()"
      >
        Apply for public release
      </a-button>
    </NavBarForProject>
    <div class="content-container">
      <div class="title">{{ projectDetail.title }}</div>
      <div class="flex items-center flex-col w-full">
        <div class="max-w-screen-lg w-full mt-6">
          <a-form
            ref="formRef"
            label-align="left"
            :disabled="!projectDetail.isPrivate"
            :model="formState"
            name="basic"
            :rules="rules"
            autocomplete="off"
            :label-col="{ style: { width: '8.75rem' } }"
          >
            <a-form-item label="Project name" name="title" required>
              <a-input
                v-model:value="formState.title"
                placeholder="Project name"
                size="large"
              />
            </a-form-item>
            <a-form-item
              v-if="!formState.isPrivate"
              label="Species"
              name="species_id"
              required
            >
              <a-select
                v-model:value="formState.species_id"
                :options="options.species"
                size="large"
                :field-names="{ label: 'species', value: 'id' }"
                placeholder="Species"
              ></a-select>
            </a-form-item>

            <a-form-item
              v-if="!formState.isPrivate"
              label="Organ"
              name="organ"
              required
            >
              <a-input
                v-model:value="formState.organ"
                size="large"
                placeholder="Organ"
              />
            </a-form-item>

            <a-form-item label="Tags" name="tags">
              <a-select
                v-model:value="formState.tags"
                mode="tags"
                placeholder="Tags"
                size="large"
                :options="[]"
              ></a-select>
            </a-form-item>

            <a-form-item
              v-if="!!formState.isPrivate"
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

            <a-form-item label="H5AD file" name="h5ad_id" required>
              <a-button
                v-if="!formState.h5ad_id"
                size="large"
                class="w-full flex items-center justify-center upload-button"
                type="dashed"
                @click="fileModalRef?.open('h5ad_id')"
              >
                <template #icon>
                  <PlusOutlined></PlusOutlined>
                </template>
                H5AD file
              </a-button>
              <a-button
                v-else
                size="large"
                class="w-full flex items-center justify-center upload-button"
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
            <a-form-item label="UMap file" name="umap_id">
              <div>
                <a-button
                  v-if="!formState.umap_id"
                  size="large"
                  class="w-full flex items-center justify-center upload-button"
                  type="dashed"
                  @click="fileModalRef?.open('umap_id')"
                >
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  UMap file
                </a-button>
                <a-button
                  v-else
                  size="large"
                  class="w-full flex items-center justify-center upload-button"
                  type="dashed"
                  danger
                  @click="formState.umap_id = null"
                >
                  <template #icon>
                    <MinusOutlined></MinusOutlined>
                  </template>
                  {{ formState.umap_id }}
                </a-button>
              </div>
              <div class="mt-2">
                Please upload in the following format:
                <a href="./umap.csv">umap.csv</a>
              </div>
            </a-form-item>

            <a-form-item label="CellMarker file" name="cell_marker_id">
              <div>
                <a-button
                  v-if="!formState.cell_marker_id"
                  size="large"
                  class="w-full flex items-center justify-center upload-button"
                  type="dashed"
                  @click="fileModalRef?.open('cell_marker_id')"
                >
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  CellMarker file
                </a-button>
                <a-button
                  v-else
                  size="large"
                  class="w-full flex items-center justify-center upload-button"
                  type="dashed"
                  danger
                  @click="formState.cell_marker_id = null"
                >
                  <template #icon>
                    <MinusOutlined></MinusOutlined>
                  </template>
                  {{ formState.cell_marker_id }}
                </a-button>
              </div>
              <div class="mt-2">
                Please upload in the following format:
                <a href="./cell_marker.csv">cell_marker.csv</a>
              </div>
            </a-form-item>

            <a-form-item
              v-if="formState.isPrivate"
              label="Pathway file"
              name="pathway_id"
            >
              <div>
                <a-button
                  v-if="!formState.pathway_id"
                  size="large"
                  class="w-full flex items-center justify-center upload-button"
                  type="dashed"
                  @click="fileModalRef?.open('pathway_id')"
                >
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  PathWay file
                </a-button>
                <a-button
                  v-else
                  size="large"
                  class="w-full flex items-center justify-center upload-button"
                  type="dashed"
                  danger
                  @click="formState.pathway_id = null"
                >
                  <template #icon>
                    <MinusOutlined></MinusOutlined>
                  </template>
                  {{ formState.pathway_id }}
                </a-button>
              </div>
              <div class="mt-2">
                Please upload in the following format:
                <a href="./pathway_score.csv">pathway_score.csv</a>
              </div>
            </a-form-item>

            <a-form-item label="Other file" name="other_file_ids">
              <div>
                <a-button
                  v-for="(item, index) in formState.other_file_ids"
                  :key="item"
                  size="large"
                  class="w-full flex items-center justify-center upload-button mb-2"
                  type="dashed"
                  danger
                  @click="handleRemoveOtherFile(item, index)"
                >
                  <template #icon>
                    <MinusOutlined></MinusOutlined>
                  </template>
                  {{ item }}
                </a-button>
                <a-button
                  v-if="formState.other_file_ids.length < 5"
                  size="large"
                  class="w-full flex items-center justify-center upload-button"
                  type="dashed"
                  @click="fileModalRef?.open('other_file_ids')"
                >
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  Other file
                </a-button>
              </div>
              <div class="mt-2">Up to 5 files can be uploaded</div>
            </a-form-item>

            <a-form-item label="Description" name="description" required>
              <a-textarea
                v-model:value="formState.description"
                show-count
                size="large"
                :maxlength="1000"
                :auto-size="{ minRows: 4 }"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
      <a-modal
        v-model:open="open"
        :title="modelTitle"
        width="400px"
        :confirm-loading="saving"
        :ok-button-props="{ shape: 'round' }"
        :cancel-button-props="{ shape: 'round' }"
        @ok="handleProjectTransfer"
      >
        <div class="py-5">
          <a-input
            v-model:value="transferMail"
            size="large"
            :placeholder="modelPlaceholder"
          ></a-input>
        </div>
      </a-modal>
    </div>
  </div>
  <FileModalView
    ref="fileModalRef"
    @selected="handleFileSelected"
  ></FileModalView>
</template>

<script setup>
import { onMounted, ref, computed, createVNode } from "vue"
import {
  CheckCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue"
import { getSpecieList } from "@/api/options.js"
import {
  getProjectDetail,
  offlineProject,
  transferProject,
  copyProject,
  updateProject,
} from "@/api/project.js"
import { message, Modal } from "ant-design-vue"
import FileModalView from "@/views/File/ModalView.vue"
import { useRouter } from "vue-router"
import NavBarForProject from "@/components/NavBarForProject.vue"

const router = useRouter()

const props = defineProps({
  id: { required: true, type: [Number, String] },
})

const formState = ref({
  title: "",
  h5ad_id: null,
  species_id: undefined,
  organ: "",
  tags: [],
  members: [],
  description: "",
  isPrivate: true,
  other_file_ids: [],
  umap_id: null,
  cell_marker_id: null,
  pathway_id: null,
})
const projectDetail = ref({})

const transferMail = ref("")

const open = ref(false)
const transferMethod = ref("transfer")
const loading = ref(false)
const saving = ref(false)
const formRef = ref()
const fileModalRef = ref()

const options = ref({
  species: [],
})

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

const modelTitle = computed(() => {
  return {
    transfer: "Transfer project",
    copy: "Copy project",
  }[transferMethod.value]
})

const modelPlaceholder = computed(() => {
  return {
    transfer: "Please enter the new administrator's email address",
    copy: "Please enter the recipient's email address",
  }[transferMethod.value]
})

onMounted(() => {
  getSpecieOptions().then(handleProjectFetch)
})

const handleProjectFetch = async () => {
  try {
    loading.value = true
    const data = await getProjectDetail(props.id)
    const result = {
      project_id: data.id,
      title: data.title,
      species_id:
        data.project_project_biosample_meta[0]?.project_biosample_biosample_meta
          .species_id,
      organ:
        data.project_project_biosample_meta[0]?.project_biosample_biosample_meta
          .organ,
      tags: data.tags ? data.tags.split(",") : [],
      members: data.project_project_user_meta
        .filter(
          (item) =>
            item.project_user_user_meta.id !== data.project_user_meta.id,
        )
        .map((item) => item.project_user_user_meta.email_address),
      description: data.description,
      isPrivate: !!data.is_private,
      isPublish: data.is_publish,
      h5ad_id: data.project_analysis_meta[0].h5ad_id,
      umap_id: data.project_analysis_meta[0].umap_id,
      cell_marker_id: data.project_analysis_meta[0].cell_marker_id,
      other_file_ids: (data.project_analysis_meta[0].other_file_ids || "")
        .split(",")
        .filter((item) => item),
      pathway_id: data.project_analysis_meta[0].pathway_id,
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
      h5ad_id,
      cell_marker_id,
      pathway_id,
      umap_id,
      other_file_ids,
    } = formState.value
    saving.value = true
    await updateProject({
      project_id: props.id,
      title,
      species_id,
      organ,
      h5ad_id,
      cell_marker_id,
      pathway_id,
      umap_id,
      tags: tags.join(","),
      is_private: isPrivate,
      is_publish: isPublish ? true : projectDetail.value.isPublish,
      members: isPrivate ? members : [],
      other_file_ids: other_file_ids.join(","),
      description,
    })

    Modal.confirm({
      icon: createVNode(CheckCircleOutlined, {
        style: { color: "#52c41a" },
      }),
      title: isPublish ? "Save and publish success" : "Save success",
      okText: "Edit other projects",
      cancelText: "Continue editing",
      onOk: () => {
        handleGoPrivateProject()
      },
      onCancel() {
        handleProjectFetch()
      },
    })
  } finally {
    saving.value = false
  }
}

const handleTransferModalShow = (method) => {
  transferMethod.value = method
  open.value = true
}

const handleProjectTransfer = async () => {
  if (!transferMail.value) {
    return message.error("Email can not be blank")
  }
  try {
    saving.value = true
    if (transferMethod.value === "transfer") {
      await transferProject(props.id, transferMail.value)
      message.success("Transfer project success")
    } else if (transferMethod.value === "copy") {
      await copyProject(props.id, transferMail.value)
      message.success("Copy project success")
    }
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
      "Are you sure to bring this project offline as draft, no more shared with others?",
    onOk: async () => {
      await offlineProject(props.id)
      message.success("Offline project success")
      await handleProjectFetch()
    },
  })
}

const handleFileSelected = (record) => {
  if (Array.isArray(formState.value[record.target])) {
    formState.value[record.target].push(record.file_id)
  } else {
    formState.value[record.target] = record.file_id
  }
}

const getSpecieOptions = async () => {
  const data = await getSpecieList()
  options.value.species = data
}

const handleRemoveOtherFile = (file_id, index) => {
  formState.value.other_file_ids.splice(index, 1)
}

const handleTransferToPublic = () => {
  const project = projectDetail.value
  Modal.confirm({
    title: "Apply for public release confirmation",
    content:
      "Are you sure you are going to release this project as publicly accessible? " +
      "After application, the administrator may contact you for more meta information and handle with the release procedure.  " +
      "We will minimize your burden of work.",
    onOk: async () => {
      await updateProject({
        ...project,
        is_publish: false,
        is_private: false,
        other_file_ids: project.other_file_ids.join(),
        tags: project.tags.join(),
      })
      message.success("Apply public project success")
      router.replace({
        name: "projects_manage",
      })
    },
  })
}

const handleGoPrivateProject = () => {
  router.replace({
    name: "projects_manage",
  })
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/screate.scss";
</style>
