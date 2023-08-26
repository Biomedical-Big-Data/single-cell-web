<template>
  <a-table
    :columns="columns"
    :data-source="list"
    :pagination="pagination"
    :loading="loading"
    size="middle"
    @change="handleTableChange"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="mr-4">Project: {{ count.project }}</span>
          <span class="mr-4">Samples: {{ count.sample }}</span>
          <span>Cells: {{ count.cell }}</span>
        </div>
        <div>
          <a-button>
            <template #icon>
              <SettingOutlined />
            </template>
            Column Setting
          </a-button>
          <a-button class="ml-4">
            <template #icon>
              <DownloadOutlined />
            </template>
            Download
          </a-button>
        </div>
      </div>
    </template>
    <template #expandedRowRender="{ record }">
      <div
        v-for="item in record.biosample_project_biosample_meta"
        :key="item.id"
        class="flex items-center justify-between px-4"
      >
        <div>{{ item.project_biosample_project_meta.title }}</div>
        <div>
          <a-button size="small">查看</a-button>
        </div>
      </div>
    </template>
    <template #expandColumnTitle> </template>
  </a-table>
</template>

<script setup>
import { usePagination } from 'vue-request'
import { getSampleProjectList } from '@/api/project.js'
import { computed, reactive, ref } from 'vue'
import { SettingOutlined, DownloadOutlined } from '@ant-design/icons-vue'

const condition = ref({})

const columns = [
  {
    title: 'Result',
    dataIndex: 'id',
    align: 'center',
    width: '20px'
  },
  {
    title: 'Disease',
    dataIndex: 'disease'
  },
  {
    title: 'Platform',
    dataIndex: 'sequencing_instrument_manufacturer_model'
  },
  {
    title: 'Species',
    dataIndex: ['biosample_species_meta', 'species']
  },
  {
    title: 'Organ',
    dataIndex: 'organ'
  },

  {
    title: 'Sex',
    dataIndex: ['biosample_donor_meta', 'sex']
  }
]

const count = reactive({
  project: 0,
  sample: 0,
  cell: 0
})

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize
} = usePagination(getSampleProjectList, {
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'page_size'
  }
})

const list = computed(() => {
  return dataSource?.value?.project_list || []
})

const pagination = computed(() => ({
  total: 0,
  current: current.value,
  pageSize: pageSize.value
}))

const handleTableChange = (pag, filters, sorter) => {
  run({
    results: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...getConditions(),
    ...filters
  })
}

const getConditions = () => {
  return condition.value
}

const handleSearch = (condition) => {
  condition.value = condition
  run({
    page: current,
    page_size: pageSize,
    ...getConditions()
  })
}

defineExpose({
  handleSearch
})
</script>

<style scoped lang="scss"></style>
