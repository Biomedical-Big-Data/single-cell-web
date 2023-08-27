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
          <div>
            <a-button @click="handleChartModalOpen">
              <template #icon>
                <DotChartOutlined />
              </template>
              Chart
            </a-button>
            <a-button class="ml-4">
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
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'action'">
        <a-button shape="circle" :icon="h(EyeOutlined)" @click="handleToProject(record)" />
      </template>
    </template>
  </a-table>

  <a-modal v-model:open="open" width="100%" wrap-class-name="full-modal" :footer="null">
    <a-tabs v-model:activeKey="geneChartType">
      <a-tab-pane key="percent" tab="Cell Number Percentage">
        <CellPercentageChart></CellPercentageChart>
      </a-tab-pane>
      <a-tab-pane key="expression" tab="Gene Expression Level">
        <GeneExpressionLevelChart></GeneExpressionLevelChart>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { usePagination } from 'vue-request'
import { getGeneProjectList } from '@/api/project.js'
import { computed, h, reactive, ref } from 'vue'
import {
  DownloadOutlined,
  SettingOutlined,
  DotChartOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import CellPercentageChart from '@/components/charts/CellPercentageChart.vue'
import GeneExpressionLevelChart from '@/components/charts/GeneExpressionLevelChart.vue'
import { useRouter } from 'vue-router'

const condition = ref({})
const open = ref(false)
const geneChartType = ref('percent')

const router = useRouter()

const columns = [
  {
    title: 'Result',
    dataIndex: 'id',
    align: 'center',
    width: '20px'
  },
  {
    title: 'CellType',
    dataIndex: ['gene_expression_proportion_meta', 'proportion_cell_type_meta', 'cell_type_name'],
    align: 'center',
    width: 150
  },
  {
    title: 'Project',
    dataIndex: [
      'gene_expression_proportion_meta',
      'cell_proportion_analysis_meta',
      'analysis_project_meta',
      'title'
    ],
    width: 200
  },
  {
    title: 'Disease',
    dataIndex: [
      'gene_expression_proportion_meta',
      'cell_proportion_analysis_meta',
      'analysis_biosample_analysis_meta',
      '0',
      'biosample_analysis_biosample_meta',
      'disease'
    ]
  },
  {
    title: 'Organ',
    dataIndex: [
      'gene_expression_proportion_meta',
      'cell_proportion_analysis_meta',
      'analysis_biosample_analysis_meta',
      '0',
      'biosample_analysis_biosample_meta',
      'organ'
    ]
  },
  {
    title: 'Sex',
    dataIndex: [
      'gene_expression_proportion_meta',
      'cell_proportion_analysis_meta',
      'analysis_biosample_analysis_meta',
      '0',
      'biosample_analysis_biosample_meta',
      'biosample_donor_meta',
      'sex'
    ]
  },
  {
    title: '',
    dataIndex: 'action',
    align: 'center',
    width: 100
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
} = usePagination(getGeneProjectList, {
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
  pageSize: pageSize.value,
  size: 'small'
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

const handleChartModalOpen = () => {
  open.value = true
}

const handleToProject = (record) => {
  console.log()
  const routeData = router.resolve({
    name: 'project_detail',
    params: {
      id: record.gene_expression_proportion_meta.cell_proportion_analysis_meta.project_id
    },
    query: {
      analysis_id: record.gene_expression_proportion_meta.cell_proportion_analysis_meta.id
    }
  })
  window.open(routeData.href, '_blank')
}

defineExpose({
  handleSearch
})
</script>

<style scoped lang="scss"></style>
