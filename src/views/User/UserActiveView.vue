<template>
  <div v-if="loading">
    <a-result title="Activating user" sub-title="please wait...">
      <template #icon>
        <LoadingOutlined />
      </template>
    </a-result>
  </div>
  <div v-else>
    <a-result
      v-if="success"
      status="success"
      title="User activation successful"
      sub-title="Please return to the login page to log in"
    ></a-result>
    <a-result
      v-else
      status="error"
      title="User activation failed"
      sub-title="Please confirm if you have activated or contact the administrator for more information"
    ></a-result>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { LoadingOutlined } from "@ant-design/icons-vue"
import { activeUser } from "@/api/user"
import { useRoute } from "vue-router"

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
