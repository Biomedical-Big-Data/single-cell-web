<template>
  <div class="auth-container">
    <div class="content-container">
      <div class="title-container">
        <div class="title-sm text-center">Reset your password</div>
      </div>
      <a-form ref="formRef" :model="formState" :rules="rules">
        <a-form-item class="w-full form-item" name="mail">
          <div class="label">
            Enter your user account‘s verified email address and we will send you a password reset link.
          </div>
          <div>
            <a-input
                v-model:value="formState.mail" class="simple-input"
                placeholder="Enter your email address"></a-input>
          </div>
        </a-form-item>
      </a-form>

      <div>
        <div class="w-full justify-center flex">
          <a-button class="login" :loading="loading" @click="handleSendResetPasswordMail">
            Send password reset email
          </a-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { sendResetPasswordMail } from '@/api/user'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const formState = ref({
  mail: '',
})
const formRef = ref()
const router = useRouter()
const loading = ref(false)

const rules = {
  mail: [
    {
      required: true,
      message: 'Enter your email address',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Enter a valid email address',
      trigger: 'blur',
    },
  ],
}

const handleSendResetPasswordMail = async function () {
  await formRef.value.validate()
  try {
    loading.value = true
    const { mail } = formState.value
    await sendResetPasswordMail(mail)
    message.success('重置邮件发送成功，请前往邮箱查看')
    await router.replace({ name: 'login' })
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss" scoped>
</style>
