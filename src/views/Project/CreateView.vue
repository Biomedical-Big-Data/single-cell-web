<template>
  <div class="p-5 page">
    <a-card title="创建项目" :bordered="false">
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

            <a-form-item label="Species" name="species_id" required>
              <a-select
                v-model:value="formState.species_id"
                :options="SPECIES"
                placeholder="Species"
              ></a-select>
            </a-form-item>

            <a-form-item label="Organ" name="organ" required>
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

            <a-form-item label="访问权限" name="public">
              <a-switch v-model:checked="formState.isPrivate" />
              私有，仅受邀人可看
            </a-form-item>

            <a-form-item
              label="可访问人员"
              name="public"
              v-if="!!formState.isPrivate"
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
                class="w-full flex items-center"
                type="dashed"
                @click="fileModalRef?.open('h5ad_id')"
                v-if="!formState.h5ad_id"
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
                @click="formState.h5ad_id = null"
                danger
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
                  class="w-full flex items-center"
                  type="dashed"
                  @click="fileModalRef?.open('umap_id')"
                  v-if="!formState.umap_id"
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
                  @click="formState.umap_id = null"
                  danger
                >
                  <template #icon>
                    <MinusOutlined></MinusOutlined>
                  </template>
                  {{ formState.umap_id }}
                </a-button>
              </div>
              <div class="mt-2">
                请按以下格式上传:
                <a
                  href="https://www.kegg.jp/kegg-bin/show_pathway?map=hsa04010&show_description=show"
                >
                  umap.csv
                </a>
              </div>
            </a-form-item>

            <a-form-item label="CellMarker文件" name="cell_marker_id">
              <div>
                <a-button
                  class="w-full flex items-center"
                  type="dashed"
                  @click="fileModalRef?.open('cell_marker_id')"
                  v-if="!formState.cell_marker_id"
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
                  @click="formState.cell_marker_id = null"
                  danger
                >
                  <template #icon>
                    <MinusOutlined></MinusOutlined>
                  </template>
                  {{ formState.cell_marker_id }}
                </a-button>
              </div>
              <div class="mt-2">
                请按以下格式上传:
                <a
                  href="https://www.kegg.jp/kegg-bin/show_pathway?map=hsa04010&show_description=show"
                >
                  cell_marker.csv
                </a>
              </div>
            </a-form-item>

            <a-form-item label="Pathway文件" name="pathway_id">
              <div>
                <a-button
                  class="w-full flex items-center"
                  type="dashed"
                  @click="fileModalRef?.open('pathway_id')"
                  v-if="!formState.pathway_id"
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
                  @click="formState.pathway_id = null"
                  danger
                >
                  <template #icon>
                    <MinusOutlined></MinusOutlined>
                  </template>
                  {{ formState.pathway_id }}
                </a-button>
              </div>
              <div class="mt-2">
                请按以下格式上传:
                <a
                  href="https://www.kegg.jp/kegg-bin/show_pathway?map=hsa04010&show_description=show"
                >
                  pathway_score.csv
                </a>
              </div>
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
                发布
              </a-button>
              <a-button
                class="ml-3"
                :loading="loading"
                @click="handleProjectCreate(false)"
              >
                保存
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
import { ref } from "vue";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons-vue";
import { SPECIES } from "@/constants/common";
import { createProject } from "@/api/project.js";
import { message } from "ant-design-vue";
import router from "@/router/index.js";
import FileModalView from "@/views/File/ModalView.vue";

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
  pathway_id: null,
  isPrivate: true,
});

const loading = ref(false);
const formRef = ref();
const fileModalRef = ref();
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
};

const handleFileSelected = (record) => {
  formState.value[record.target] = record.file_id;
};

const handleProjectCreate = async (isPublish) => {
  try {
    await formRef.value.validate();
    const {
      title,
      species_id,
      organ,
      tags,
      description,
      isPrivate,
      members,
      h5ad_id,
    } = formState.value;
    loading.value = true;
    const data = await createProject({
      title,
      species_id,
      organ,
      h5ad_id,
      tags: tags.join(","),
      is_private: isPrivate,
      is_publish: isPublish,
      members: isPrivate ? members : [],
      description,
    });
    if (isPublish) {
      await router.replace({
        name: "project_detail",
        params: {
          id: data.project_id,
        },
      });
    } else {
      message.success("保存成功");
      await router.replace({
        name: "project_detail_update",
        params: {
          id: data.project_id,
        },
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
