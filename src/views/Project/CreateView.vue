<template>
  <div class="p-5 page">
    <a-card title="创建项目" :bordered="false">
      <div class="flex items-center flex-col w-full">
        <div class="max-w-screen-lg w-full mt-6">
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

            <a-form-item label="访问权限" name="public">
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
                :field-names="{ label: 'species', value: 'id' }"
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

            <a-form-item label="标签" name="tags">
              <a-select
                v-model:value="formState.tags"
                mode="tags"
                placeholder="标签"
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
              <a-button class="ml-3" :loading="loading">取消</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-card>
    <FileModalView
      ref="fileModalRef"
      @selected="handleFileSelected"
    ></FileModalView>
  </div>
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

<style lang="scss" scoped></style>
