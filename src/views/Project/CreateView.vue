<template>
  <div class="p-5 page">
    <a-card title="创建项目" :bordered="false">
      <div class="flex items-center flex-col w-full">
        <div class="max-w-lg w-full mt-6">
          <a-form
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            :label-col="{ span: 5 }"
            :label-wrap="{ span: 13 }"
            @finishFailed="onFinishFailed"
          >
            <a-form-item label="项目名称" name="name" required>
              <a-input v-model:value="formState.title" placeholder="项目名称" />
            </a-form-item>

            <a-form-item label="Species" name="species" required>
              <a-select
                v-model:value="formState.species"
                :options="SPECIES"
                placeholder="Species"
              ></a-select>
            </a-form-item>

            <a-form-item label="Organ" name="organ" required>
              <a-input v-model:value="formState.organ" placeholder="Organ" />
            </a-form-item>

            <a-form-item label="Samples" name="samples" required>
              <a-input v-model:value="formState.samples" placeholder="Samples" />
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
              <a-switch v-model:checked="formState.private" />
              私有，仅受邀人可看
            </a-form-item>

            <a-form-item label="可访问人员" name="public" v-if="!!formState.private">
              <a-select
                v-model:value="formState.members"
                mode="tags"
                placeholder="受邀人"
                :options="[]"
              ></a-select>
            </a-form-item>

            <a-form-item label="上传文件" name="file" required>
              <a-upload name="file">
                <a-button class="w-full flex items-center" type="dashed">
                  <template #icon>
                    <PlusOutlined></PlusOutlined>
                  </template>
                  H5AD 文件
                </a-button>
              </a-upload>
            </a-form-item>

            <a-form-item label="项目描述" name="remarks" required>
              <a-textarea
                v-model:value="formState.remarks"
                show-count
                :maxlength="1000"
                :autosize="{ minRows: 4 }"
              />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 5 }">
              <a-button type="primary">发布</a-button>
              <a-button class="ml-3">保存</a-button>
              <a-button class="ml-3">取消</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { SPECIES } from '@/constants/common'

const formState = reactive({
  title: '',
  species: undefined,
  organ: '',
  samples: '',
  tags: [],
  members: [],
  remarks: '',
  private: true
})
const onFinish = (values) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}
</script>

<style lang="scss" scoped></style>
