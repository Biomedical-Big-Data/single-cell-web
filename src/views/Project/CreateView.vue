<template>
  <div class="create-container">
    <NavBarForProject>
      <a-button
        type="primary"
        :loading="loading"
        @click="handleProjectCreate(true)"
      >
        {{ formState.isPrivate ? "保存并发布" : "申请公开项目" }}
      </a-button>
      <a-button
        class="ml-3"
        :loading="loading"
        @click="handleProjectCreate(false)"
      >
        保存为草稿
      </a-button>
    </NavBarForProject>
    <div class="content-container">
      <div class="title">Create a new project</div>
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
            <a-form-item label="Project Name" name="title" required>
              <a-input
                v-model:value="formState.title"
                placeholder="Project Name"
                size="large"
              />
            </a-form-item>

            <a-form-item label="Access rights" name="public">
              <div class="flex items-center">
                <a-switch
                  v-model:checked="formState.isPrivate"
                  size="large"
                  checked-children="Private"
                  un-checked-children="Public"
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
                placeholder="Species"
                size="large"
                :field-names="{ label: 'species', value: 'id' }"
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
                placeholder="Organ"
                size="large"
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
              label="Invitee:"
              name="public"
            >
              <a-select
                v-model:value="formState.members"
                mode="tags"
                size="large"
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

            <a-form-item label="UMap文件" name="umap_id">
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
                请按以下格式上传:
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
                请按以下格式上传:
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
                请按以下格式上传:
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
              <div class="mt-2">Max file count: 5</div>
            </a-form-item>

            <a-form-item label="Description" name="description" required>
              <a-textarea
                v-model:value="formState.description"
                show-count
                :maxlength="1000"
                :auto-size="{ minRows: 4 }"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
  <FileModalView
    ref="fileModalRef"
    @selected="handleFileSelected"
  ></FileModalView>
</template>

<script setup>
import { ref, h, onMounted } from "vue"
import {
  PlusOutlined,
  MinusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue"
import { createProject } from "@/api/project.js"
import { message } from "ant-design-vue"
import router from "@/router/index.js"
import FileModalView from "@/views/File/ModalView.vue"
import { getSpecieList } from "@/api/options.js"
import NavBarForProject from "@/components/NavBarForProject.vue"

const formState = ref({
  title: "",
  species: undefined,
  organ: "",
  tags: [],
  members: [],
  description: "",
  h5ad_id: null,
  cell_marker_id: null,
  umap_id: null,
  other_file_ids: [],
  pathway_id: null,
  isPrivate: true,
})

const loading = ref(false)
const formRef = ref()
const fileModalRef = ref()

const options = ref({
  species: [],
})

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
  getSpecieOptions()
})

const handleFileSelected = (record) => {
  if (Array.isArray(formState.value[record.target])) {
    formState.value[record.target].push(record.file_id)
  } else {
    formState.value[record.target] = record.file_id
  }
}

const handleProjectCreate = async (isPublish) => {
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
      umap_id,
      cell_marker_id,
      pathway_id,
      other_file_ids,
    } = formState.value
    loading.value = true
    const data = await createProject({
      title,
      species_id,
      organ,
      h5ad_id,
      tags: tags.join(","),
      is_private: isPrivate,
      is_publish: isPublish,
      members: isPrivate ? members : [],
      umap_id,
      cell_marker_id,
      pathway_id,
      description,
      other_file_ids: other_file_ids.join(","),
    })
    if (isPublish) {
      if (isPrivate) {
        await router.replace({
          name: "project_detail",
          params: {
            id: data.project_id,
          },
        })
      } else {
        message.success("申请成功")
        router.replace({
          name: "projects",
        })
      }
    } else {
      message.success("保存成功")
      await router.replace({
        name: "project_detail_update",
        params: {
          id: data.project_id,
        },
      })
    }
  } finally {
    loading.value = false
  }
}

const getSpecieOptions = async () => {
  const data = await getSpecieList()
  options.value.species = data
}

const handleRemoveOtherFile = (file_id, index) => {
  formState.value.other_file_ids.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.create-container {
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;

  .content-container {
    padding: 2.25rem 0.75rem;
    width: 50rem;

    .title {
      color: #000;
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.375rem; /* 91.667% */
    }

    :deep(.ant-form-item-control-input) {
      .ant-select-selector,
      .ant-input {
        border-radius: 1.25rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }
    }

    :deep(.ant-form-item-label) {
      label {
        margin-top: 2px;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.375rem;
      }
    }

    .upload-button {
      border-radius: 1.25rem;
    }
  }
}

.button-base {
  display: flex;
  width: 8.9375rem;
  height: 2.25rem;
  justify-content: center;
  align-items: center;
  border-radius: 2.9375rem;
  box-sizing: border-box;
}

.button-save {
  @extend .button-base;
  background: #ffffff;
  color: #0062ff;
  border: 2px solid #0062ff;
}

.button-publish {
  @extend .button-base;
  color: #0062ff;
  background: #0062ff;
}

.button-warning {
  @extend .button-base;
  background: #ffffff;
  color: #ff7555;
  border: 2px solid #ff7555;
}
</style>
