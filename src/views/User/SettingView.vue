<template>
  <div class="create-container">
    <NavBarForProject>
      <a-button
        class="button-save"
        :loading="loading"
        @click="handleUpdateUser"
      >
        Save
      </a-button>
    </NavBarForProject>
    <div class="content-container">
      <div class="title">Personal information setting</div>

      <div class="flex items-center flex-col w-full">
        <div class="max-w-screen-lg w-full mt-6">
          <a-form
            ref="formRef"
            label-align="left"
            :model="userInfo"
            :label-col="{ style: { width: '8.75rem' } }"
            :rules="rules"
          >
            <a-form-item label="User Name">
              <a-input
                v-model:value="userInfo.user_name"
                disabled
                class="simple-input"
                size="large"
              />
            </a-form-item>
            <a-form-item label="Organization" name="organization">
              <a-input
                v-model:value="userInfo.organization"
                size="large"
                class="simple-input"
              />
            </a-form-item>
            <a-form-item label="New password" name="password">
              <a-input-password
                v-model:value="userInfo.password"
                size="large"
              />
            </a-form-item>
            <a-form-item label="Confirm password" name="confirm_password">
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
  organization: [
    {
      required: true,
      message: "Please input your organization",
      trigger: "blur",
    },
  ],
  confirm_password: [
    {
      validator: (rule, value, callback) => {
        if (value !== userInfo.value.password) {
          callback(new Error("The password entered twice is inconsistent"))
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
    message.success("Save user info success")
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/screate.scss";
</style>
