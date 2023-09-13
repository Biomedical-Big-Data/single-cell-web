<template>
  <div class="p-5 page">
    <a-card :title="projectDetail.title" :bordered="false">
      <div class="flex items-center flex-col w-full">
        <div class="max-w-lg w-full mt-6">
          <a-form
            :disabled="!projectDetail.isPrivate"
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

            <a-form-item label="可访问人员" name="public" v-if="!!formState.isPrivate">
              <a-select
                v-model:value="formState.members"
                mode="tags"
                placeholder="受邀人"
                :options="[]"
              ></a-select>
            </a-form-item>

            <a-form-item label="上传文件" name="file">
              <a-upload name="file">
                <a-button class="w-full flex items-center" type="dashed">
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  H5AD 文件
                </a-button>
              </a-upload>
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
                class="mr-3"
                :saving="saving"
                v-if="!projectDetail.isPublish"
                @click="handleProjectCreate(true)"
                >发布
              </a-button>
              <a-button
                class="mr-3"
                :saving="saving"
                v-if="projectDetail.isPrivate"
                @click="handleProjectCreate(false)"
                >保存
              </a-button>
              <a-button
                class="mr-3"
                :saving="saving"
                v-if="projectDetail.isPrivate && projectDetail.isPublish"
                @click="handleProjectOffline()"
                >下线
              </a-button>
              <a-button
                class="mr-3"
                danger
                v-if="projectDetail.isPrivate && projectDetail.isPublish"
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
    <a-modal title="转移项目" v-model:open="open" width="300px" @ok="handleProjectTransfer">
      <div class="py-5">
        <a-input v-model:value="transferMail" placeholder="请输入新管理员邮箱"></a-input>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { SPECIES } from '@/constants/common'
import { getProjectDetail, offlineProject, transferProject, updateProject } from '@/api/project.js'
import { message, Modal } from 'ant-design-vue'

const props = defineProps({
  id: { required: true }
})

const formState = ref({
  title: '',
  species_id: undefined,
  organ: '',
  tags: [],
  members: [],
  description: '',
  isPrivate: true
})
const projectDetail = ref({})

const transferMail = ref('')

const open = ref(false)
const loading = ref(false)
const saving = ref(false)
const formRef = ref()
const rules = {
  title: [
    {
      required: true,
      message: '项目名称不能为空',
      trigger: 'blur'
    }
  ],
  description: [
    {
      required: true,
      message: '项目描述不能为空',
      trigger: 'blur'
    }
  ],
  organ: [
    {
      required: true,
      message: 'Organ不能为空',
      trigger: 'blur'
    }
  ],
  species_id: [
    {
      required: true,
      message: 'Species不能为空',
      trigger: 'change'
    }
  ]
}

onMounted(() => {
  handleProjectFetch()
})

const handleProjectFetch = async () => {
  try {
    loading.value = true
    const data = await getProjectDetail(props.id)
    const result = {
      title: data.title,
      species_id:
        data.project_project_biosample_meta[0].project_biosample_biosample_meta.species_id,
      organ: data.project_project_biosample_meta[0].project_biosample_biosample_meta.organ,
      tags: data.tags ? data.tags.split(',') : [],
      members: data.project_project_user_meta
        .filter((item) => item.project_user_user_meta.id !== data.project_user_meta.id)
        .map((item) => item.project_user_user_meta.email_address),
      description: data.description,
      isPrivate: !!data.is_private
    }
    formState.value = result
    projectDetail.value = {
      ...result,
      isPublish: !!data.is_publish
    }
  } finally {
    loading.value = false
  }
}

const handleProjectCreate = async (isPublish) => {
  try {
    await formRef.value.validate()
    const { title, species_id, organ, tags, description, isPrivate, members } = formState.value
    saving.value = true
    await updateProject({
      project_id: props.id,
      title,
      species_id,
      organ,
      tags: tags.join(','),
      is_private: isPrivate,
      is_publish: isPublish,
      members: isPrivate ? members : [],
      description
    })

    if (isPublish) {
      message.success('保存并发布成功')
    } else {
      message.success('保存成功')
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
    return message.error('邮箱不能为空')
  }
  try {
    saving.value = true
    await transferProject(props.id, transferMail.value)
    message.success('转移项目成功')
    await handleProjectFetch()
    open.value = false
  } finally {
    saving.value = false
  }
}

const handleProjectOffline = () => {
  Modal.confirm({
    title: '下线确认?',
    content: '您确认现在下线改项目吗？',
    onOk: async () => {
      await offlineProject(props.id)
      message.success('下线项目成功')
      await handleProjectFetch()
    }
  })
}
</script>

<style lang="scss" scoped></style>
