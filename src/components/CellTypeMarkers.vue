<template>
  <div class="pr-6">
    <div class="flex justify-end">
      <a-button :loading="downloading" @click="handleFileDownload">
        <template #icon>
          <DownloadOutlined />
        </template>
        Download
      </a-button>
    </div>
    <div class="mt-4">
      <a-table :columns="columns" :data-source="dataSource" :scroll="{ x: true }" />
    </div>
  </div>
</template>

<script setup>
import { getFile } from '@/api/file.js'
import { onMounted, ref } from 'vue'
import * as csv from 'csvtojson'
import { DownloadOutlined } from '@ant-design/icons-vue'
import { saveAs } from 'file-saver'

const props = defineProps({
  fileId: {
    type: String,
    default: 'fd6a51d26c7d40ab86146926827651f9.csv'
  }
})

const downloading = ref(false)

const columns = ref([])

// [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     filters: [
//       {
//         text: 'Joe',
//         value: 'Joe'
//       },
//       {
//         text: 'Jim',
//         value: 'Jim'
//       }
//     ],
//     // specify the condition of filtering result
//     // here is that finding the name started with `value`
//     onFilter: (value, record) => record.name.indexOf(value) === 0,
//     sorter: (a, b) => a.name.length - b.name.length,
//     sortDirections: ['descend']
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     defaultSortOrder: 'descend',
//     sorter: (a, b) => a.age - b.age
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     filters: [
//       {
//         text: 'London',
//         value: 'London'
//       },
//       {
//         text: 'New York',
//         value: 'New York'
//       }
//     ],
//     filterMultiple: false,
//     onFilter: (value, record) => record.address.indexOf(value) === 0,
//     sorter: (a, b) => a.address.length - b.address.length,
//     sortDirections: ['descend', 'ascend']
//   }
// ]

const dataSource = ref([])

onMounted(() => {
  handleCellTypeMarkersFetch()
})

const handleCellTypeMarkersFetch = async () => {
  const data = await getFile(props.fileId)
  dataSource.value = await csv({ output: 'json' })
    .on('header', (header) => {
      console.log(header)
      columns.value = header.map((item) => {
        return {
          title: item,
          dataIndex: item,
          sorter: (a, b) => a > b,
          sortDirections: ['descend', 'ascend']
        }
      })
    })
    .fromString(data)
}

const handleFileDownload = async () => {
  try {
    downloading.value = true
    const data = await getFile(props.fileId)
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'cell_type_markers.csv')
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
