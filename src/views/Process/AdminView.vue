<template>
  <div class="p-5">
    <div class="p-3 bg-white">
      <a-table
        :columns="columns"
        :row-key="(record) => record.ip"
        :data-source="dataSource"
        :pagination="false"
        :loading="loading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'entry_list'">
            <ul>
              <li v-for="(item, index) in record.entry_list" :key="index">
                {{ item.name }}
                <a-button size="small" @click="handleTerminateProcess(item)">
                  终止
                </a-button>
              </li>
            </ul>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from "vue-request"
import { getSeverList, terminateProcess } from "@/api/process.js"
import { message } from "ant-design-vue"
import { ref } from "vue"

const terminating = ref(false)

const columns = [
  {
    title: "目标IP端口",
    dataIndex: "ip",
  },
  {
    title: "可用内存(G)",
    dataIndex: "available_memory",
  },
  {
    title: "进程",
    dataIndex: "entry_list",
  },

  {
    title: "服务器时间",
    dataIndex: "server_time",
    width: 200,
  },
]

const { data: dataSource, loading, run } = useRequest(getSeverList, {})

const handleTerminateProcess = async (record) => {
  try {
    terminating.value = true
    await terminateProcess(record)
    message.success("终止进程成功")
    run()
  } finally {
    terminating.value = false
  }
}
</script>

<style scoped lang="scss">
.condition-item {
  width: 100px !important;
}

.condition-item-lg {
  width: 130px !important;
}
</style>
