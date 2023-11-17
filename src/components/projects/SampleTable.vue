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
        <div class="flex items-center"></div>
        <div>
          <a-popover trigger="click" placement="bottom">
            <template #content>
              <div
                class="overflow-y-auto table-column-setting"
                style="width: 400px"
              >
                <a-collapse expand-icon-position="end" class="w-full">
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
                        <div v-for="item in v" :key="item.title" class="p-2">
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
    </template>
    <template #bodyCell="{ column, index, record, text }">
      <template v-if="column.dataIndex === 'index'">
        {{ getTrueIndex(index) }}
      </template>
      <template
        v-else-if="joinTableIndex(column.dataIndex) === 'analysis_meta.id'"
      >
        A{{ _.padStart(text, 6, "0") }}
        <br />
        <span class="link" @click="handleToProject(record)">view</span>
      </template>
      <template
        v-else-if="joinTableIndex(column.dataIndex) === 'biosample_meta.id'"
      >
        B{{ _.padStart(text, 6, "0") }}
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { usePagination } from "vue-request"
import {
  downloadSampleProjectList,
  getSampleProjectList,
} from "@/api/project.js"
import { computed, ref } from "vue"
import { SettingOutlined, DownloadOutlined } from "@ant-design/icons-vue"
import { BIOSAMPLES_COLUMNS } from "@/constants/biosample.js"
import { useRouter } from "vue-router"
import { saveAs } from "file-saver"
import _ from "lodash"
import { joinTableIndex } from "@/utils/common.js"
import { titleCase } from "text-case"

const router = useRouter()
const downloading = ref(false)
const condition = ref({})

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
      width: 400,
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
    },
    {
      title: "Sex",
      dataIndex: ["donor_meta", "sex"],
    },
    ...BIOSAMPLES_COLUMNS,
  ].map((item) => ({
    width: 150,
    sorter: true,
    ...item,
    resizable: true,
  })),
)

const columnSettings = ref({
  sample_basic_information: columns.value
    .filter(
      (item) => !item.autoHidden && item.group === "sample_basic_information",
    )
    .map((item) => item.title),
  disease_information: columns.value
    .filter((item) => !item.autoHidden && item.group === "disease_information")
    .map((item) => item.title),
  vaccination_information: columns.value
    .filter(
      (item) => !item.autoHidden && item.group === "vaccination_information",
    )
    .map((item) => item.title),
  perturbation_information: columns.value
    .filter(
      (item) => !item.autoHidden && item.group === "perturbation_information",
    )
    .map((item) => item.title),
  experiment_method: columns.value
    .filter((item) => !item.autoHidden && item.group === "experiment_method")
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
      const {
        sample_basic_information,
        disease_information,
        vaccination_information,
        perturbation_information,
        experiment_method,
      } = columnSettings.value
      return (
        !item.group ||
        [
          ...sample_basic_information,
          ...disease_information,
          ...vaccination_information,
          ...perturbation_information,
          ...experiment_method,
        ].includes(item.title)
      )
    }),
  ]
})

const tableScroll = computed(() => {
  return {
    x: _.sumBy(columnResult.value, (item) => item.width),
  }
})

const {
  data: dataSource,
  run,
  total,
  loading,
  current,
  pageSize,
} = usePagination(getSampleProjectList, {
  // manual: true,
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

const getTitleName = (k) => {
  return titleCase(k.replace(/_/g, " "))
}

const handleTableChange = (pag, filters, sorter) => {
  run({
    page_size: pag?.pageSize,
    page: pag?.current,
    order_by: sorter.field?.join("."),
    asc: sorter.order ? sorter.order === "ascend" : null,
    ...getConditions(),
    ...filters,
  })
}

const getConditions = () => {
  const {
    species,
    organ,
    external_sample_accession,
    disease,
    development_stage,
  } = condition.value
  const result = {}
  if (species) {
    result.species_id = species
  }
  if (organ) {
    result.organ = organ
  }
  return {
    ...(species ? { species_id: species } : {}),
    ...(organ ? { organ } : {}),
    ...(external_sample_accession ? { external_sample_accession } : {}),
    ...(disease ? { disease } : {}),
    ...(development_stage ? { development_stage } : {}),
  }
}

const handleSearch = (conditions) => {
  condition.value = conditions
  run({
    page: pagination.value.current,
    page_size: pagination.value.pageSize,
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
      analysis_id: record.analysis_meta.id,
    },
  })
  window.open(routeData.href, "_blank")
}

const handleListDownload = async () => {
  try {
    downloading.value = true
    const data = await downloadSampleProjectList(getConditions())
    saveAs(data, "sample_project_list.xlsx")
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
