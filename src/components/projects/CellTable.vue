<template>
  <a-table
    :columns="columnResult"
    :data-source="list"
    :pagination="pagination"
    :loading="loading"
    :scroll="tableScroll"
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
            <a-popover trigger="click" placement="bottom">
              <template #content>
                <div class="overflow-y-auto table-column-setting">
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
</template>

<script setup>
import { usePagination } from "vue-request"
import { downloadCellProjectList, getCellProjectList } from "@/api/project.js"
import { computed, h, ref } from "vue"
import {
  DownloadOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue"
import { BIOSAMPLES_CLOUMNS } from "@/constants/biosample.js"
import { useRouter } from "vue-router"
import { saveAs } from "file-saver"
import _ from "lodash"

const router = useRouter()
const downloading = ref(false)
const condition = ref({})

const columns = ref(
  [
    {
      title: "Result",
      dataIndex: "index",
      align: "center",
    },
    {
      title: "Project",
      dataIndex: ["project_meta", "title"],
      width: 300,
    },
    {
      title: "Proportion Of Cell",
      dataIndex: ["cell_proportion_meta", "cell_proportion"],
      align: "center",
    },
    {
      title: "Cell Number",
      dataIndex: ["cell_proportion_meta", "cell_number"],
      align: "center",
    },
    {
      title: "Disease",
      dataIndex: ["biosample_meta", "disease"],
    },
    {
      title: "Organ",
      dataIndex: ["biosample_meta", "organ"],
    },
    {
      title: "Sex",
      dataIndex: ["biosample_meta", "biosample_donor_meta", "sex"],
    },
    ...BIOSAMPLES_CLOUMNS,
  ].map((item) => ({ width: 100, ...item, resizable: true })),
)

const columnSettings = ref(columns.value.map((item) => item.title))

const columnResult = computed(() => {
  return [
    ...columns.value.filter((item) => {
      return columnSettings.value.includes(item.title)
    }),
    {
      title: "",
      dataIndex: "action",
      fixed: "right",
      align: "center",
      width: 100,
    },
  ]
})

const tableScroll = computed(() => {
  return {
    x: _.sumBy(columns.value, (item) => item.width),
  }
})

// const count = reactive({
//   project: 0,
//   sample: 0,
//   cell: 0,
// })

const {
  data: dataSource,
  run,
  total,
  loading,
  current,
  pageSize,
} = usePagination(getCellProjectList, {
  manual: true,
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
    totalKey: "total",
  },
})

const list = computed(() => {
  return dataSource?.value?.project_list || []
})

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}))

const getTrueIndex = (index) => {
  return (current.value - 1) * pageSize.value + index + 1
}

const handleTableChange = (pag, filters, sorter) => {
  run({
    page_size: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field?.join("."),
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
      id: record.project_meta.id,
    },
    query: {
      analysis_id:
        record.analysis_meta.id,
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
