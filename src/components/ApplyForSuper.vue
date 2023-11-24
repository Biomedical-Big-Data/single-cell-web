<template>
  <a-popover placement="bottomRight">
    <template #content>
      <div class="user-tip">
        Apply for unlimited files, projects and storage spaces
        <a href="mailto:CasSF_aDM.siais@shanghaitech.edu.cn?subject=Apply to become a super user" target="_blank">Apply</a>

      </div>
    </template>
    <ExclamationCircleOutlined class="ml-2"/>
  </a-popover>
</template>
<script>

import { defineComponent } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: { ExclamationCircleOutlined }
})
</script>
<style scoped lang="scss">
.user-tip {
  display: flex;
  align-items: center;
  gap: 0.62rem;
}
</style>
