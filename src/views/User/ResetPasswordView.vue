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
          <a-form-item label="重置密码" required name="password">
            <a-input-password
              v-model:value="formState.password"
              placeholder="请输入重置密码"
            />
          </a-form-item>
          <a-form-item label="确认重置密码" required name="confirm_password">
            <a-input-password
              v-model:value="formState.confirm_password"
              placeholder="请再次输入重置密码"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              class="flex items-center"
              @click="handleResetPassword"
              :loading="loading"
            >
              <template #icon>
                <CheckOutlined />
              </template>
              确认修改
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { CheckOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { resetPassword } from "@/api/user";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();

const formState = reactive({
  password: "",
  confirm_password: "",
});
const loading = ref(false);
const formRef = ref();

const rules = {
  password: [
    {
      required: true,
      message: "请输入重置密码",
    },
  ],
  confirm_password: [
    {
      required: true,
      message: "请再次输入重置密码",
    },
    {
      validator: (rule, value) => {
        if (value !== formState.password) {
          return Promise.reject("两次输入的密码不一致");
        }
        return Promise.resolve();
      },
    },
  ],
};

const handleResetPassword = async function () {
  await formRef.value.validate();

  try {
    loading.value = true;
    const { token } = route.query;
    await resetPassword({ token, password: formState.password });
    message.success("重置密码成功，请重新登录");
    await router.replace({ name: "login" });
  } finally {
    loading.value = false;
  }
};
</script>
<style></style>
