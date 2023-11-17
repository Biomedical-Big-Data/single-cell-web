<template>
  <div class="create-container">
    <NavBarForProject>
      <a-button
        class="button-save"
        :loading="loading"
        @click="handleUpdateUser"
      >
        保存
      </a-button>
    </NavBarForProject>
    <div class="content-container">
      <div class="title">修改个人信息</div>

      <div class="flex items-center flex-col w-full">
        <div class="max-w-screen-lg w-full mt-6">
          <a-form
            ref="formRef"
            label-align="left"
            :model="userInfo"
            :label-col="{ style: { width: '8.75rem' } }"
            :rules="rules"
          >
            <a-form-item label="用户名">
              <a-input
                v-model:value="userInfo.user_name"
                disabled
                class="simple-input"
                size="large"
              />
            </a-form-item>
            <a-form-item label="组织" name="organization">
              <a-input
                v-model:value="userInfo.organization"
                size="large"
                class="simple-input"
              />
            </a-form-item>
            <a-form-item label="新密码" name="password">
              <a-input-password
                v-model:value="userInfo.password"
                size="large"
              />
            </a-form-item>
            <a-form-item label="确认密码" name="confirm_password">
              <a-input-password
                v-model:value="userInfo.confirm_password"
                size="large"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getUserInfo, updateMyUserInfo } from "@/api/user"
import { message } from "ant-design-vue"
import NavBarForProject from "@/components/NavBarForProject.vue"

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

<style lang="scss" scoped>
@import "@/assets/styles/screate.scss";
</style>
