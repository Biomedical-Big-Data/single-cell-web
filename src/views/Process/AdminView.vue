<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">H5AD Process List</div>
      <div class="content-container">
        <div class="table-container">
          <a-table
            size="large"
            :columns="columns"
            bordered
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
                      Terminate
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
    message.success("Terminate process success")
    run()
  } finally {
    terminating.value = false
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/styles/stable.scss";
</style>
