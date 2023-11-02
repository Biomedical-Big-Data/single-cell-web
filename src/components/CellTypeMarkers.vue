<template>
  <div class="pr-6">
    <div class="flex justify-end">
      <a-popover trigger="click" placement="bottom">
        <template #content>
          <a-checkbox-group v-model:value="columnSettings" class="flex-col">
            <div v-for="item in columns" :key="item.title" class="p-2">
              <a-checkbox :value="item.title">
                {{ item.title }}
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </template>
        <a-button>
          <template #icon>
            <SettingOutlined />
          </template>
          Column Setting
        </a-button>
      </a-popover>

      <a-button :loading="downloading" class="ml-4" @click="handleFileDownload">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </a-button>
    </div>
    <div class="mt-4">
      <a-table
        :columns="columnResult"
        :data-source="result"
        :scroll="{ x: columnSettings.length * 150 }"
      >
        <template #headerCell="{ title }">
          <div>{{ title }}</div>
          <div class="mt-2">
            <a-input
              size="small"
              @click.stop
              @change="filterBy(title, $event)"
            ></a-input>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import * as csv from "csvtojson"
import { DownloadOutlined, SettingOutlined } from "@ant-design/icons-vue"
import { saveAs } from "file-saver"
import { getCellMarkerFile } from "../api/file"

const props = defineProps({
  fileId: {
    type: String,
    required: true,
  },
})

const downloading = ref(false)
const condition = ref({})
const columns = ref([])
const columnSettings = ref([])

const dataSource = ref([])

onMounted(() => {
  handleCellTypeMarkersFetch()
})

const result = computed(() => {
  const conditionKeys = Object.keys(condition.value)
  return dataSource.value.filter((item) => {
    const temp = conditionKeys.every((key) => {
      return String(item[key])
        .toLowerCase()
        .includes(condition.value[key].toLowerCase())
    })
    return temp
  })
})

const columnResult = computed(() => {
  return columns.value.filter((item) => {
    return columnSettings.value.includes(item.title)
  })
})

const handleCellTypeMarkersFetch = async () => {
  const data = await getCellMarkerFile(props.fileId)
  dataSource.value = await csv({ output: "json" })
    .on("header", (header) => {
      columnSettings.value = header
      columns.value = header.map((item) => {
        return {
          title: item,
          key: item,
          dataIndex: item,
          align: "center",
          sorter: (a, b) => {
            return a[item] > b[item] ? 1 : -1
          },
          sortDirections: ["descend", "ascend"],
        }
      })
    })
    .fromString(data)
}

const handleFileDownload = async () => {
  try {
    downloading.value = true
    const data = await getCellMarkerFile(props.fileId)
    const blob = new Blob([data], { type: "text/csv;charset=utf-8" })
    saveAs(blob, "cell_type_markers.csv")
  } finally {
    downloading.value = false
  }
}

const filterBy = (title, event) => {
  condition.value[title] = event.target.value
}
</script>

<style scoped lang="scss"></style>
