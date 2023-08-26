<template>
  <div v-if="loading">
    <a-result title="正在激活用户" sub-title="请稍后...">
      <template #icon>
        <LoadingOutlined />
      </template>
    </a-result>
  </div>
  <div v-else>
    <a-result
      v-if="success"
      status="success"
      title="用户激活成功"
      sub-title="请返回登录页面进行登录"
    >
    </a-result>
    <a-result
      v-else
      status="error"
      title="用户激活失败"
      sub-title="请确认您未激活，或联系管理员获取更多信息"
    >
    </a-result>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { activeUser } from '@/api/user'
import { useRoute } from 'vue-router'

const success = ref(false)
const loading = ref(true)
const route = useRoute()

onMounted(async () => {
  const { token } = route.query
  if (token) {
    try {
      await activeUser(token)
      success.value = true
    } catch (e) {
      success.value = false
    } finally {
      loading.value = false
    }
  } else {
    success.value = false
  }
})
</script>

<style scoped lang="scss"></style>
