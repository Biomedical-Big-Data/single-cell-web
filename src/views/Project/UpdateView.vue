<template>
  <div class="p-5 page">
    <a-card :title="projectDetail.title" :bordered="false">
      <div class="flex items-center flex-col w-full">
        <div class="max-w-screen-lg w-full mt-6">
          <a-form
            ref="formRef"
            :disabled="!projectDetail.isPrivate"
            :model="formState"
            name="basic"
            :rules="rules"
            autocomplete="off"
            :label-col="{ span: 5 }"
          >
            <a-form-item label="Project Name" name="title" required>
              <a-input
                v-model:value="formState.title"
                placeholder="Project Name"
              />
            </a-form-item>
            <!-- <a-form-item label="访问权限" name="public">
              <div class="flex items-center">
                <a-switch
                  v-model:checked="formState.isPrivate"
                  checked-children="私有"
                  un-checked-children="公开"
                />
                <a-tooltip placement="right" class="ml-2">
                  <template #title>
                    <span>
                      私有项目，仅受邀人可看，公开项目需要管理员审核后才可见
                    </span>
                  </template>
                  <a-button
                    type="text"

                    shape="circle"
                    :icon="h(QuestionCircleOutlined)"
                  ></a-button>
                </a-tooltip>
              </div>
            </a-form-item> -->

            <a-form-item
              v-if="!formState.isPrivate"
              label="Species"
              name="species_id"
              required
            >
              <a-select
                v-model:value="formState.species_id"
                :options="options.species"
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
              <a-input v-model:value="formState.organ" placeholder="Organ" />
            </a-form-item>

            <a-form-item label="Tags" name="tags">
              <a-select
                v-model:value="formState.tags"
                mode="tags"
                placeholder="Tags"
                :options="[]"
              ></a-select>
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
            <a-form-item label="UMap文件" name="umap_id">
              <div>
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
              </div>
              <div class="mt-2">
                请按以下格式上传:
                <a href="./umap.csv">umap.csv</a>
              </div>
            </a-form-item>

            <a-form-item label="CellMarker文件" name="cell_marker_id">
              <div>
                <a-button
                  v-if="!formState.cell_marker_id"
                  class="w-full flex items-center"
                  type="dashed"
                  @click="fileModalRef?.open('cell_marker_id')"
                >
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  CellMarker 文件
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
              </div>
              <div class="mt-2">
                请按以下格式上传:
                <a href="./cell_marker.csv">cell_marker.csv</a>
              </div>
            </a-form-item>

            <a-form-item
              v-if="formState.isPrivate"
              label="Pathway文件"
              name="pathway_id"
            >
              <div>
                <a-button
                  v-if="!formState.pathway_id"
                  class="w-full flex items-center"
                  type="dashed"
                  @click="fileModalRef?.open('pathway_id')"
                >
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  PathWay 文件
                </a-button>
                <a-button
                  v-else
                  class="w-full flex items-center"
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
                请按以下格式上传:
                <a href="./pathway_score.csv">pathway_score.csv</a>
              </div>
            </a-form-item>

            <a-form-item label="其他文件" name="other_file_ids">
              <div>
                <a-button
                  v-for="(item, index) in formState.other_file_ids"
                  :key="item"
                  class="w-full flex items-center mb-2"
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
                  class="w-full flex items-center"
                  type="dashed"
                  @click="fileModalRef?.open('other_file_ids')"
                >
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  其他文件
                </a-button>
              </div>
              <div class="mt-2">最多上传5个文件</div>
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
                v-if="!projectDetail.isPublish"
                type="primary"
                class="mr-3"
                :saving="saving"
                @click="handleProjectUpdate(true)"
              >
                保存并发布
              </a-button>
              <a-button
                v-if="projectDetail.isPrivate"
                class="mr-3"
                :saving="saving"
                @click="handleProjectUpdate(false)"
              >
                保存
              </a-button>
              <a-button
                v-if="projectDetail.isPublish"
                class="mr-3"
                :saving="saving"
                @click="handleProjectOffline()"
              >
                下线项目
              </a-button>
              <a-button
                class="mr-3"
                :saving="saving"
                @click="handleTransferModalShow('copy')"
              >
                拷贝项目
              </a-button>
              <a-button
                class="mr-3"
                danger
                :saving="saving"
                @click="handleTransferModalShow('transfer')"
              >
                转移项目
              </a-button>
              <a-button
                class="mr-3"
                danger
                :saving="saving"
                @click="handleTransferToPublic()"
              >
                申请为公开项目
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-card>
    <a-modal
      v-model:open="open"
      :title="modelTitle"
      width="300px"
      :confirm-loading="saving"
      @ok="handleProjectTransfer"
    >
      <div class="py-5">
        <a-input
          v-model:value="transferMail"
          :placeholder="modelPlaceholder"
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
import { onMounted, ref, computed } from "vue"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons-vue"
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
      message: "Project Name不能为空",
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

const modelTitle = computed(() => {
  return {
    transfer: "转移项目",
    copy: "拷贝项目",
  }[transferMethod.value]
})

const modelPlaceholder = computed(() => {
  return {
    transfer: "请输入新管理员邮箱",
    copy: "请输入接受人邮箱",
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

const handleTransferModalShow = (method) => {
  transferMethod.value = method
  open.value = true
}

const handleProjectTransfer = async () => {
  if (!transferMail.value) {
    return message.error("邮箱不能为空")
  }
  try {
    saving.value = true
    if (transferMethod.value === "transfer") {
      await transferProject(props.id, transferMail.value)
      message.success("转移项目成功")
    } else if (transferMethod.value === "copy") {
      await copyProject(props.id, transferMail.value)
      message.success("拷贝项目成功")
    }
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
    title: "申请公开项目确认?",
    content: "您确认申请公开项目吗？申请后管理员会联系您获取更多项目信息",
    onOk: async () => {
      await updateProject({
        ...project,
        is_publish: false,
        is_private: false,
        other_file_ids: project.other_file_ids.join(),
        tags: project.tags.join(),
      })
      message.success("申请公开项目成功")
      router.replace({
        name: "projects_manage",
      })
    },
  })
}
</script>

<style lang="scss" scoped></style>
