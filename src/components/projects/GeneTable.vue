<template>
  <a-table
    :columns="columnResult"
    :data-source="list"
    :pagination="pagination"
    :loading="loading"
    :scroll="tableScroll"
    :bordered="true"
    @change="handleTableChange"
    @resize-column="handleResizeColumn"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <!-- <span class="mr-4">Project: {{ count.project }}</span>
          <span class="mr-4">Samples: {{ count.sample }}</span>
          <span>Cells: {{ count.cell }}</span> -->
        </div>
        <div>
          <div>
            <a-button
              v-if="list.length"
              @click="handleChartModalOpen"
            >
              <template #icon>
                <DotChartOutlined />
              </template>
              Chart
            </a-button>
            <a-popover
              trigger="click"
              placement="bottom"
              class="ml-4"
            >
              <template #content>
                <div
                  class="overflow-y-auto table-column-setting"
                  style="width: 400px"
                >
                  <a-collapse
                    expand-icon-position="end"
                    class="w-full"
                  >
                    <a-collapse-panel
                      v-for="(v, k) in columnGroup"
                      :key="k"
                      :header="getTitleName(k)"
                    >
                      <div>
                        <a-checkbox-group
                          v-model:value="columnSettings[k]"
                          class="w-full"
                        >
                          <div
                            v-for="item in v"
                            :key="item.title"
                            class="p-2"
                          >
                            <a-checkbox :value="item.title">
                              {{ item.title }}
                            </a-checkbox>
                          </div>
                        </a-checkbox-group>
                      </div>
                      <template #extra>
                        <a-badge
                          :count="columnSettings[k]?.length || 0"
                          :number-style="{ backgroundColor: '#1677ff' }"
                        />
                      </template>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              </template>
              <a-button>
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
    <template #bodyCell="{ column, record, index, text }">
      <template v-if="column.dataIndex === 'index'">
        {{ getTrueIndex(index) }}
      </template>
      <template
        v-else-if="joinTableIndex(column.dataIndex) === 'analysis_meta.id'"
      >
        A{{ _.padStart(text, 6, "0") }}
        <br />
        <span
          class="link"
          @click="handleToProject(record)"
        >
          view
        </span>
      </template>
      <template
        v-else-if="joinTableIndex(column.dataIndex) === 'biosample_meta.id'"
      >
        B{{ _.padStart(text, 6, "0") }}
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
      <a-tab-pane
        key="percent"
        tab="Cell Number Percentage"
      >
        <GeneExpressionLevelChart
          :data="geneChartData"
          title="Cell Number Percentage"
          value-key="cell_proportion_expression_the_gene"
        ></GeneExpressionLevelChart>
      </a-tab-pane>
      <a-tab-pane
        key="expression"
        tab="Gene Expression Level"
      >
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
import { computed, ref } from "vue"
import {
  DotChartOutlined,
  DownloadOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue"
import GeneExpressionLevelChart from "@/components/charts/GeneExpressionChart.vue"
import { useRouter } from "vue-router"
import { saveAs } from "file-saver"
import _ from "lodash"
import { joinTableIndex } from "@/utils/common.js"
import { titleCase } from "text-case"
import { GENE_COLUMNS } from "@/constants/gene.js"
import { message } from "ant-design-vue"

const downloading = ref(false)
const chartLoading = ref(false)
const condition = ref({})
const open = ref(false)
const geneChartType = ref("percent")
const geneChartData = ref([])

const router = useRouter()

const columns = ref(
  [
    {
      title: "Result",
      dataIndex: "index",
      align: "center",
      sorter: false,
    },
    {
      title: "Analysis ID",
      dataIndex: ["analysis_meta", "id"],
      width: 180,
      sorter: false,
    },
    {
      title: "Project",
      dataIndex: ["project_meta", "title"],
      width: 300,
    },

    {
      title: "Biosample Number",
      dataIndex: ["project_meta", "biosample_number"],
    },
    {
      title: "External Project Accesstion",
      dataIndex: ["project_meta", "external_project_accesstion"],
    },

    {
      title: "Species",
      dataIndex: ["species_meta", "species"],
      align: "center",
    },
    {
      title: "Cell Type ID",
      dataIndex: ["cell_type_meta", "cell_type_id"],
      align: "center",
    },
    {
      title: "Cell Type Name",
      dataIndex: ["cell_type_meta", "cell_type_name"],
      align: "center",
    },
    {
      title: "Proportion Expression",
      dataIndex: [
        "gene_expression_meta",
        "cell_proportion_expression_the_gene",
      ],
      group: "gene_expression",
      customRender: ({ text }) => {
        return text ? `${(text * 100).toFixed(2)}%` : ""
      },
    },

    {
      title: "Average Gene Expression",
      dataIndex: ["gene_expression_meta", "average_gene_expression"],
      customRender: ({ text }) => {
        return text ? `${(text * 100).toFixed(2)}%` : ""
      },
      group: "gene_expression",
    },
    ...GENE_COLUMNS,
  ].map((item) => ({
    width: 150,
    sorter: true,
    ...item,
    resizable: true,
  })),
)

const columnSettings = ref({
  gene_expression: columns.value
    .filter((item) => !item.autoHidden && item.group === "gene_expression")
    .map((item) => item.title),
})

const columnGroup = computed(() => {
  return _.chain(columns.value)
    .filter((item) => !!item.group)
    .groupBy("group")
    .value()
})

const columnResult = computed(() => {
  return [
    ...columns.value.filter((item) => {
      const { gene_expression } = columnSettings.value
      return !item.group || [...gene_expression].includes(item.title)
    }),
  ]
})

const tableScroll = computed(() => {
  return {
    x: _.sumBy(columnResult.value, (item) => item.width),
  }
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

const getTitleName = (k) => {
  return titleCase(k.replace(/_/g, " "))
}

const handleGeneChartDataFetch = async () => {
  try {
    chartLoading.value = true
    geneChartData.value = await getProjectGeneChartData(getConditions())
  } finally {
    chartLoading.value = false
  }
}

const queryData = (params) => {
  return getGeneProjectList(params)
}

const {
  data: dataSource,
  run,
  total,
  loading,
  current,
  pageSize,
} = usePagination(queryData, {
  manual: true,
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
    totalKey: "total",
  },
})

const list = computed(() => {
  return dataSource.value?.project_list || []
})

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}))

const handleTableChange = (pag, filters, sorter) => {
  run({
    page_size: pag.pageSize,
    page: pag?.current,
    order_by: sorter.field?.join("."),
    asc: sorter.order ? sorter.order === "ascend" : null,
    ...getConditions(),
    ...filters,
  })
}

const handleSearch = (conditions) => {
  console.log(conditions)
  condition.value = conditions
  run({
    page: current,
    page_size: pageSize,
    ...getConditions(),
  })
}

const handleChartModalOpen = () => {
  open.value = true
  handleGeneChartDataFetch()
}

const handleToProject = (record) => {
  const routeData = router.resolve({
    name: "project_detail",
    params: {
      id: record.project_meta.id,
    },
    query: {
      analysis_id: record.analysis_meta.id,
    },
  })
  window.open(routeData.href, "_blank")
}

const handleListDownload = async () => {
  try {
    downloading.value = true
    const conditions = getConditions()
    if (conditions.species_id && conditions.gene_symbol) {
      const data = await downloadGeneProjectList(conditions)
      saveAs(data, "sample_project_list.xlsx")
    } else {
      message.error("Please select species and gene symbol")
    }
  } finally {
    downloading.value = false
  }
}

const handleResizeColumn = (w, col) => {
  col.width = w
}

defineExpose({
  handleSearch,
})
</script>

<style scoped lang="scss">
.table-column-setting {
  max-height: 75vh;
}
</style>
