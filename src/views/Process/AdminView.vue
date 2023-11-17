<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">H5AD Process List</div>
      <div class="content-container">
        <div class="table-container">
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
                    <a-button @click="handleTerminateProcess(item)">
                      终止
                    </a-button>
                  </li>
                </ul>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRequest } from "vue-request"
import { getSeverList, terminateProcess } from "@/api/process.js"
import { message } from "ant-design-vue"
import { ref } from "vue"
import NavBar from "@/components/NavBar.vue"

const terminating = ref(false)

const columns = [
  {
    title: "Target IP",
    dataIndex: "ip",
  },
  {
    title: "Free Memory(G)",
    dataIndex: "available_memory",
  },
  {
    title: "Entries",
    dataIndex: "entry_list",
  },

  {
    title: "Server Time",
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

<style scoped lang="scss"></style>
