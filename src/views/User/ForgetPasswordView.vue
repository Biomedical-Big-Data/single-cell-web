<template>
  <div class="p-5">
    <div class="flex items-center flex-col w-full bg-white py-5">
      <div class="text-lg">重置密码</div>
      <div class="max-w-lg w-full mt-6">
        <a-form
          layout="vertical"
          :model="formState"
          class="w-full"
          :rules="rules"
          ref="formRef"
        >
          <a-form-item label="用户邮箱" required name="mail">
            <a-input
              v-model:value="formState.mail"
              placeholder="请输入用户邮箱"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              class="flex items-center"
              :loading="loading"
              @click="handleSendResetPasswordMail()"
            >
              <template #icon>
                <MailOutlined />
              </template>
              发送重置邮件
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue"
import { MailOutlined } from "@ant-design/icons-vue"
import { sendResetPasswordMail } from "@/api/user"
import { message } from "ant-design-vue"
import { useRouter } from "vue-router"

const formState = ref({
  mail: "",
})
const formRef = ref()
const router = useRouter()
const loading = ref(false)

const rules = {
  mail: [
    {
      required: true,
      message: "请输入用户邮箱",
    },
    {
      type: "email",
      message: "请输入正确的邮箱格式",
    },
  ],
}

const handleSendResetPasswordMail = async function () {
  await formRef.value.validate()
  try {
    loading.value = true
    const { mail } = formState.value
    await sendResetPasswordMail(mail)
    message.success("重置邮件发送成功，请前往邮箱查看")
    await router.replace({ name: "login" })
  } finally {
    loading.value = false
  }
}
</script>
<style></style>
