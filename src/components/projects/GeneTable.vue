<template>
  <a-table
    :columns="columnResult"
    :data-source="list"
    :pagination="pagination"
    :loading="loading"
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
            <a-popover trigger="click" placement="bottom">
              <template #content>
                <a-checkbox-group
                  v-model:value="columnSettings"
                  class="flex-col"
                >
                  <div v-for="item in columns" :key="item.title" class="p-2">
                    <a-checkbox :value="item.title">
                      {{ item.title }}
                    </a-checkbox>
                  </div>
                </a-checkbox-group>
              </template>
              <a-button class="ml-4">
                <template #icon>
                  <SettingOutlined />
                </template>
                Column Setting
              </a-button>
            </a-popover>
            <a-button
              class="ml-4"
              :loading="downloading"
              @click="handleListDownload"
            >
              <template #icon>
                <DownloadOutlined />
              </template>
              Download
            </a-button>
          </div>
        </div>
      </div>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ getTrueIndex(index) }}
      </template>
      <template v-if="column.dataIndex === 'action'">
        <a-button
          shape="circle"
          :icon="h(EyeOutlined)"
          @click="handleToProject(record)"
        />
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="open"
    width="60%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <a-tabs v-model:activeKey="geneChartType">
      <a-tab-pane key="percent" tab="Cell Number Percentage">
        <GeneExpressionLevelChart
          :data="geneChartData"
          title="Cell Number Percentage"
          value-key="cell_proportion_expression_the_gene"
        ></GeneExpressionLevelChart>
      </a-tab-pane>
      <a-tab-pane key="expression" tab="Gene Expression Level">
        <GeneExpressionLevelChart
          :data="geneChartData"
          title="Gene Expression Level"
          value-key="average_gene_expression"
        ></GeneExpressionLevelChart>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { usePagination } from "vue-request"
import {
  downloadGeneProjectList,
  getGeneProjectList,
  getProjectGeneChartData,
} from "@/api/project.js"
import { computed, h, reactive, ref } from "vue"
import {
  DotChartOutlined,
  DownloadOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue"
import GeneExpressionLevelChart from "@/components/charts/GeneExpressionChart.vue"
import { useRouter } from "vue-router"
import { saveAs } from "file-saver"

const downloading = ref(false)
const condition = ref({})
const open = ref(false)
const geneChartType = ref("percent")
const geneChartData = ref([])

const router = useRouter()

const columns = [
  {
    title: "Result",
    dataIndex: "index",
    align: "center",
    width: "20px",
  },
  {
    title: "CellType",
    dataIndex: [
      "gene_expression_proportion_meta",
      "proportion_cell_type_meta",
      "cell_type_name",
    ],
    align: "center",
    width: 150,
  },
  {
    title: "Project",
    dataIndex: [
      "gene_expression_proportion_meta",
      "cell_proportion_analysis_meta",
      "analysis_project_meta",
      "title",
    ],
    width: 200,
  },
  {
    title: "Disease",
    dataIndex: [
      "gene_expression_proportion_meta",
      "cell_proportion_analysis_meta",
      "analysis_biosample_analysis_meta",
      "0",
      "biosample_analysis_biosample_meta",
      "disease",
    ],
  },
  {
    title: "Organ",
    dataIndex: [
      "gene_expression_proportion_meta",
      "cell_proportion_analysis_meta",
      "analysis_biosample_analysis_meta",
      "0",
      "biosample_analysis_biosample_meta",
      "organ",
    ],
  },
  {
    title: "Sex",
    dataIndex: [
      "gene_expression_proportion_meta",
      "cell_proportion_analysis_meta",
      "analysis_biosample_analysis_meta",
      "0",
      "biosample_analysis_biosample_meta",
      "biosample_donor_meta",
      "sex",
    ],
  },
]

const columnSettings = ref(columns.map((item) => item.title))

const columnResult = computed(() => {
  return [
    ...columns.value.filter((item) => {
      return columnSettings.value.includes(item.title)
    }),
    {
      title: "",
      dataIndex: "action",
      align: "center",
      width: 100,
    },
  ]
})

const count = reactive({
  project: 0,
  sample: 0,
  cell: 0,
})

const getConditions = () => {
  const { species, symbol } = condition.value
  return {
    ...(species ? { species_id: species } : {}),
    ...(symbol ? { gene_symbol: symbol } : {}),
  }
}

const getTrueIndex = (index) => {
  return (current.value - 1) * pageSize.value + index + 1
}

const handleGeneChartDataFetch = async () => {
  geneChartData.value = await getProjectGeneChartData(getConditions())
}

const queryData = (params) => {
  return handleGeneChartDataFetch().then(() => getGeneProjectList(params))
}

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
} = usePagination(queryData, {
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
  },
})

const list = computed(() => {
  return dataSource?.value?.project_list || []
})

const pagination = computed(() => ({
  total: 0,
  current: current.value,
  pageSize: pageSize.value,
  size: "small",
}))

const handleTableChange = (pag, filters, sorter) => {
  run({
    results: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...getConditions(),
    ...filters,
  })
}

const handleSearch = (conditions) => {
  condition.value = conditions
  run({
    page: current,
    page_size: pageSize,
    ...getConditions(),
  })
}

const handleChartModalOpen = () => {
  open.value = true
}

const handleToProject = (record) => {
  const routeData = router.resolve({
    name: "project_detail",
    params: {
      id: record.gene_expression_proportion_meta.cell_proportion_analysis_meta
        .project_id,
    },
    query: {
      analysis_id:
        record.gene_expression_proportion_meta.cell_proportion_analysis_meta.id,
    },
  })
  window.open(routeData.href, "_blank")
}

const handleListDownload = async () => {
  try {
    downloading.value = true
    const data = await downloadGeneProjectList(...getConditions())
    saveAs(data, "sample_project_list.xlsx")
  } finally {
    downloading.value = false
  }
}

defineExpose({
  handleSearch,
})
</script>

<style scoped lang="scss"></style>
