<template>
  <a-spin :spinning="loading">
    <div class="flex justify-end action-container">
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
        <a-button class="columns-setting" size="large">
          <template #icon>
            <SettingOutlined />
          </template>
          Column Setting
        </a-button>
      </a-popover>

      <a-button
        :loading="downloading"
        class="download"
        size="large"
        @click="handleFileDownload"
      >
        Download CSV
      </a-button>
      <div class="empty-fill" />
    </div>
    <div class="mt-4">
      <a-table
        :columns="columnResult"
        :data-source="result"
        :scroll="{ x: totalWidth, y: 393 }"
      >
        <template #headerCell="{ title }">
          <div>{{ title }}</div>
          <div class="mt-2">
            <a-input
              class="w-full"
              @click.stop
              @change="filterBy(title, $event)"
            ></a-input>
          </div>
        </template>
      </a-table>
    </div>
  </a-spin>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import csvtojson from "csvtojson"
import { SettingOutlined } from "@ant-design/icons-vue"
import { saveAs } from "file-saver"
import { getCellMarkerFile } from "../api/file"
import _ from "lodash"

const props = defineProps({
  fileId: {
    type: String,
    required: true,
  },
})

const loading = ref(false)
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

const totalWidth = computed(() => {
  return _.sumBy(columnResult.value, "width")
})

const handleCellTypeMarkersFetch = async () => {
  try {
    loading.value = true
    const data = await getCellMarkerFile(props.fileId)
    dataSource.value = await csvtojson({ output: "json" })
      .on("header", (header) => {
        columnSettings.value = header
        columns.value = header.map((item) => {
          return {
            title: item,
            width: item.length * 16 + 20,
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
  } finally {
    loading.value = false
  }
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

<style scoped lang="scss">
.action-container {
  height: 2.75rem;
  display: flex;
  align-items: stretch;
  background: #0081d8;
  padding-right: 1.25rem;

  .columns-setting {
    height: 100%;
    background: transparent;
    border-radius: 0;
    border: 0;
    color: #fff;
  }

  .download {
    height: 100%;
    background: #00a9dd;
    color: #fff;
    font-size: 1rem;
    font-weight: 400;
    border-radius: 0;
    border-left: 0.38rem solid #fff;
    border-right: 0.38rem solid #fff;
    border-top: 0;
    border-bottom: 0;
  }
}
</style>
