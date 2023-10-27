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
      <template v-if="column.dataIndex === 'disease'">
        {{
          record["cell_proportion_analysis_meta"][
            "analysis_biosample_analysis_meta"
          ][0]["biosample_analysis_biosample_meta"]["disease"]
        }}
      </template>
      <template v-if="column.dataIndex === 'organ'">
        {{
          record["cell_proportion_analysis_meta"][
            "analysis_biosample_analysis_meta"
          ][0]["biosample_analysis_biosample_meta"]["organ"]
        }}
      </template>
      <template v-if="column.dataIndex === 'sex'">
        {{
          record["cell_proportion_analysis_meta"][
            "analysis_biosample_analysis_meta"
          ][0]["biosample_analysis_biosample_meta"]["biosample_donor_meta"][
            "sex"
          ]
        }}
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { usePagination } from "vue-request"
import { downloadCellProjectList, getCellProjectList } from "@/api/project.js"
import { computed, h, reactive, ref } from "vue"
import {
  DownloadOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue"
import { useRouter } from "vue-router"
import { saveAs } from "file-saver"

const router = useRouter()
const downloading = ref(false)
const condition = ref({})

const columns = [
  {
    title: "Result",
    dataIndex: "index",
    align: "center",
    width: "20px",
  },
  {
    title: "Project",
    dataIndex: [
      "cell_proportion_analysis_meta",
      "analysis_project_meta",
      "title",
    ],
  },
  {
    title: "Proportion Of Cell",
    dataIndex: "cell_proportion",
    align: "center",
  },
  {
    title: "Cell Number",
    dataIndex: "cell_number",
    align: "center",
  },
  {
    title: "Disease",
    dataIndex: "disease",
  },
  {
    title: "Organ",
    dataIndex: "organ",
  },
  {
    title: "Sex",
    dataIndex: "sex",
  },
]

const columnSettings = ref(columns.map((item) => item.title))

const columnResult = computed(() => {
  return [
    ...columns.filter((item) => {
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

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
} = usePagination(getCellProjectList, {
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

const getTrueIndex = (index) => {
  return (current.value - 1) * pageSize.value + index + 1
}

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

const getConditions = () => {
  const result = {}
  const { positive, negative, species, cl_id, ci_id, searchBy } =
    condition.value
  if (species) {
    result.species_id = species
  }
  if (ci_id) {
    result.ci_id = ci_id
  }
  if (searchBy === "name") {
    if (cl_id) {
      result.cl_id = cl_id
    }
  } else {
    if (positive?.length) {
      result.genes_positive = positive.join(",")
    }
    if (negative?.length) {
      result.genes_negative = negative.join(",")
    }
  }

  return result
}

const handleSearch = (conditions) => {
  condition.value = conditions
  run({
    page: current.value,
    page_size: pageSize.value,
    ...getConditions(),
  })
}

const handleToProject = (record) => {
  const routeData = router.resolve({
    name: "project_detail",
    params: {
      id: record.cell_proportion_analysis_meta.analysis_project_meta.id,
    },
    query: {
      analysis_id: record.analysis_id,
    },
  })
  // console.log(routeData)
  window.open(routeData.href, "_blank")
}

const handleListDownload = async () => {
  try {
    downloading.value = true
    const data = await downloadCellProjectList({ ...getConditions() })
    saveAs(data, "cell_project_list.xlsx")
  } finally {
    downloading.value = false
  }
}

defineExpose({
  handleSearch,
})
</script>

<style scoped lang="scss"></style>
