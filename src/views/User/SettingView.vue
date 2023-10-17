<template>
  <div class="p-5">
    <a-card title="修改个人信息" bordered>
      <div class="flex items-center flex-col w-full">
        <div class="max-w-lg w-full mt-6">
          <a-form
            :model="userInfo"
            :label-col="{ span: 5 }"
            :rules="rules"
            ref="formRef"
          >
            <a-form-item label="用户名">
              <a-input v-model:value="userInfo.user_name" disabled />
            </a-form-item>
            <a-form-item label="组织" name="organization">
              <a-input v-model:value="userInfo.organization" />
            </a-form-item>
            <a-form-item label="新密码" name="password">
              <a-input-password v-model:value="userInfo.password" />
            </a-form-item>
            <a-form-item label="确认密码" name="confirm_password">
              <a-input-password v-model:value="userInfo.confirm_password" />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 13, offset: 5 }">
              <a-button
                type="primary"
                @click="handleUpdateUser"
                :loading="loading"
              >
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getUserInfo, updateMyUserInfo } from "@/api/user"
import { message } from "ant-design-vue"

const loading = ref(false)
const userInfo = ref({})
const formRef = ref()
const rules = {
  organization: [{ required: true, message: "请输入组织", trigger: "blur" }],
  confirm_password: [
    {
      validator: (rule, value, callback) => {
        if (value !== userInfo.value.password) {
          callback(new Error("两次输入密码不一致"))
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
}
onMounted(() => {
  getPersonalInfo()
})

const getPersonalInfo = async function () {
  userInfo.value = await getUserInfo()
}

const handleUpdateUser = async function () {
  await formRef.value.validate()
  try {
    loading.value = true
    const { password, organization } = userInfo.value
    await updateMyUserInfo({ password, organization })
    message.success("修改用户信息成功")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
