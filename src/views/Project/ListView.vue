<template>
  <div class="h-screen list-container">
    <NavBar></NavBar>
    <div class="content-container">
      <div class="top">
        <div class="type">
          <a-dropdown
            size="large"
            placement="bottom"
            class="selector"
            arrow
            trigger="click"
          >
            <div class="selector-name">
              Search by
              <span class="capitalize">{{ filter }}</span>
              <CaretDownOutlined />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a
                    class="selector-item"
                    @click="handleTableTypeChange('sample')"
                  >
                    sample
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="selector-item"
                    @click="handleTableTypeChange('cell')"
                  >
                    cell
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="selector-item"
                    @click="handleTableTypeChange('gene')"
                  >
                    gene
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <ColumnSetting
          v-model:columns="columnsSetting[filter]"
          class="columns"
          :total-columns="columnsTotal[filter]"
        ></ColumnSetting>
        <a-button
          v-if="isChartAvailable"
          class="chart"
          @click="handleChartModalOpen"
        >
          <template #icon>
            <DotChartOutlined />
          </template>
          Chart
        </a-button>
        <a-button
          class="download"
          :loading="downloading"
          @click="handleListDownload"
        >
          Download CSV
        </a-button>
        <div class="fill" />
      </div>
      <div class="bottom">
        <div class="left">
          <div v-if="filter === 'sample'">
            <a-form ref="sampleFormRef" layout="vertical" :model="sample">
              <a-form-item label="Organ" name="organ" class="condition-item">
                <a-select
                  v-model:value="sample.organ"
                  size="large"
                  show-search
                  placeholder="Organ"
                  :options="options.organ"
                  allow-clear
                  @search="handleOrganSearch"
                >
                  <template v-if="state.organFetching" #notFoundContent>
                    <a-spin />
                  </template>
                </a-select>
              </a-form-item>

              <a-form-item
                label="Species"
                name="species"
                class="condition-item"
              >
                <a-select
                  v-model:value="sample.species"
                  :options="options.species"
                  size="large"
                  placeholder="Species"
                  :field-names="{ label: 'species', value: 'id' }"
                  allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item
                label="External Accession"
                name="external_sample_accesstion"
                class="condition-item"
              >
                <a-input
                  v-model:value="sample.external_sample_accesstion"
                  placeholder="External Accession"
                  size="large"
                ></a-input>
              </a-form-item>
              <a-form-item
                label="Disease"
                name="disease"
                class="condition-item"
              >
                <a-auto-complete
                  v-model:value="sample.disease"
                  placeholder="Disease"
                  size="large"
                  :options="options.disease"
                  @search="
                    handleSearchConditionByType(
                      $event,
                      'disease',
                      'diseaseFetching',
                    )
                  "
                ></a-auto-complete>
              </a-form-item>
              <a-form-item
                label="Development Stage"
                name="development_stage"
                class="condition-item"
              >
                <a-auto-complete
                  v-model:value="sample.development_stage"
                  placeholder="Development Stage"
                  size="large"
                  :options="options.development_stage"
                  @search="
                    handleSearchConditionByType(
                      $event,
                      'development_stage',
                      'developmentStageFetching',
                    )
                  "
                ></a-auto-complete>
              </a-form-item>
            </a-form>
          </div>
          <div v-if="filter === 'cell'">
            <a-form
              ref="cellFormRef"
              layout="vertical"
              :model="cell"
              :rules="cellRules"
            >
              <a-form-item
                label="Species"
                name="species"
                class="condition-item"
              >
                <a-select
                  v-model:value="cell.species"
                  :options="options.species"
                  :field-names="{ label: 'species', value: 'id' }"
                  placeholder="Species"
                  allow-clear
                  size="large"
                ></a-select>
              </a-form-item>
              <template v-if="cell.species">
                <a-form-item
                  label="Search By"
                  name="searchBy"
                  class="condition-item"
                >
                  <a-radio-group v-model:value="cell.searchBy">
                    <a-radio value="id">ID</a-radio>
                    <a-radio value="name">Name</a-radio>
                    <a-radio value="gene">Gene</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  v-if="cell.searchBy === 'id'"
                  label="Name"
                  name="name"
                  class="condition-item"
                >
                  <a-select
                    v-model:value="cell.ct_id"
                    placeholder="Search Cell"
                    show-search
                    :options="options.cellIds"
                    allow-clear
                    size="large"
                    @search="handleCellIDSearch"
                  >
                    <template v-if="state.cellIDFetching" #notFoundContent>
                      <a-spin />
                    </template>
                  </a-select>
                </a-form-item>
                <a-form-item
                  v-else-if="cell.searchBy === 'name'"
                  label="Name"
                  name="name"
                  class="condition-item"
                >
                  <a-textarea
                    ref="cellNameInput"
                    v-model:value="cell.name"
                    :auto-size="true"
                    placeholder="Click to search"
                    size="large"
                    @focus="handleCellNameSearch"
                  />
                </a-form-item>
                <a-form-item
                  v-else
                  label="Name"
                  name="names"
                  class="condition-item"
                >
                  <a-textarea
                    ref="geneNameInput"
                    v-model:value="cell.names"
                    :auto-size="true"
                    placeholder="Click to search"
                    size="large"
                    @focus="handleGeneNameSearch"
                  />
                </a-form-item>
              </template>
            </a-form>
          </div>
          <div v-if="filter === 'gene'">
            <a-form
              ref="geneFormRef"
              layout="vertical"
              :model="gene"
              :rules="geneRules"
            >
              <a-form-item
                label="Species"
                name="species"
                class="condition-item"
              >
                <a-select
                  v-model:value="gene.species"
                  :options="options.species"
                  :field-names="{ label: 'species', value: 'id' }"
                  placeholder="Species"
                  allow-clear
                  size="large"
                ></a-select>
              </a-form-item>
              <a-form-item
                label="Search by gene symbol"
                name="symbol"
                class="condition-item"
              >
                <a-select
                  v-model:value="gene.symbol"
                  show-search
                  size="large"
                  placeholder="Gene Symbol"
                  :options="options.geneSymbol"
                  allow-clear
                  @search="handleGeneSymbolSearch"
                >
                  <template v-if="state.geneSymbolFetching" #notFoundContent>
                    <a-spin />
                  </template>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
          <div class="action">
            <a-button type="primary" class="search" @click="handleSearch">
              Search all
            </a-button>
            <a-button class="reset" @click="resetForm">
              <span>Reset</span>
            </a-button>
          </div>
        </div>
        <div class="right">
          <ProjectTable
            ref="projectTableRef"
            :columns="columns"
            :conditions="searchCondition"
            :search="searchFunc"
          ></ProjectTable>
        </div>
      </div>
    </div>
  </div>

  <CellNameModal ref="cellNameRef" @confirm="handleCellNameChange" />
  <GeneNameModal
    ref="geneNameRef"
    @confirm="handleGeneNameChange"
    @tree-open="handleTreeOpen"
  />
  <GeneChartModal ref="geneChartRef" />
</template>
<script setup>
import { computed, nextTick, onMounted, ref } from "vue"
import { CaretDownOutlined, DotChartOutlined } from "@ant-design/icons-vue"
import {
  downloadCellProjectList,
  downloadGeneProjectList,
  downloadSampleProjectList,
  getCellProjectList,
  getGeneProjectList,
  getOrganList,
  getSampleProjectList,
  searchItemsByType,
} from "@/api/project"
import ProjectTable from "@/components/projects/ProjectTable.vue"
import {
  getCellTypeList,
  getGeneSymbolList,
  getSpecieList,
} from "@/api/options.js"
import CellNameModal from "@/components/projects/CellNameModal.vue"
import GeneNameModal from "@/components/projects/GeneNameModal.vue"
import GeneChartModal from "@/components/charts/GeneChartModal.vue"
import { useRoute } from "vue-router"
import ColumnSetting from "@/components/ColumnSetting.vue"
import { BIOSAMPLES_COLUMNS } from "@/constants/biosample.js"
import { saveAs } from "file-saver"
import NavBar from "@/components/NavBar.vue"
import { GENE_COLUMNS } from "@/constants/gene.js"

const route = useRoute()

const columnsTotal = ref({
  sample: [
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
  cell: [
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
      title: "Proportion Of Cell",
      dataIndex: ["cell_proportion_meta", "cell_proportion"],
      align: "center",
      customRender: ({ text }) => `${(text * 100).toFixed(2)}%`,
    },
    {
      title: "Cell Number",
      dataIndex: ["cell_proportion_meta", "cell_number"],
      align: "center",
    },

    {
      title: "Donor ID",
      dataIndex: ["donor_meta", "id"],
    },
    {
      title: "Sex",
      dataIndex: ["donor_meta", "sex"],
    },
    {
      title: "Species",
      dataIndex: ["species_meta", "species"],
    },
    {
      title: "Cell Type ID",
      dataIndex: ["cell_type_meta", "cell_type_id"],
    },
    {
      title: "Cell Type Name",
      dataIndex: ["cell_type_meta", "cell_type_name"],
    },
    ...BIOSAMPLES_COLUMNS,
  ].map((item) => ({ width: 150, sorter: true, ...item, resizable: true })),
  gene: [
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
})

const columnsSetting = ref({
  sample: columnsTotal.value.sample
    .filter((item) => !item.autoHidden)
    .map(({ title }) => title),
  cell: columnsTotal.value.cell
    .filter((item) => !item.autoHidden)
    .map(({ title }) => title),
  gene: columnsTotal.value.gene
    .filter((item) => !item.autoHidden)
    .map(({ title }) => title),
})

const columns = computed(() => {
  const type = filter.value
  return columnsTotal.value[type].filter((item) => {
    return columnsSetting.value[type].includes(item.title)
  })
})

const isChartAvailable = computed(() => {
  const { species, symbol } = gene.value
  return filter.value === "gene" && species && symbol
})

const cellRules = {
  species: [
    {
      required: true,
      message: "Please select species",
    },
  ],
}

const geneRules = {
  species: [
    {
      required: true,
      message: "Please select species",
    },
  ],
  symbol: [
    {
      required: true,
      message: "Please select gene symbol",
    },
  ],
}

const options = ref({
  species: [],
  organ: [],
  cell: [],
  geneSymbol: [],
  cellIds: [],
  external_sample_accesstion: [],
  development_stage: [],
  disease: [],
})

const state = ref({
  organFetching: false,
  geneSymbolFetching: false,
  cellIDFetching: false,
  diseaseFetching: false,
  developmentStageFetching: false,
})

const downloading = ref(false)
const filter = ref("sample")
const projectTableRef = ref()

const sample = ref({
  species: undefined,
  organ: undefined,
  external_sample_accesstion: "",
  disease: "",
  development_stage: "",
})

const sampleFormRef = ref()

const cellNameRef = ref()
const geneNameRef = ref()
const geneChartRef = ref()
const cellNameInput = ref()
const geneNameInput = ref()

const cell = ref({
  species: undefined,
  ct_id: undefined,
  cl_cell_id: "",
  ct_gene_ids: [],
  searchBy: "name",
  name: "",
  names: "",
})

const cellFormRef = ref()

const gene = ref({
  species: undefined,
  symbol: undefined,
})

const geneFormRef = ref()

const searchCondition = computed(() => {
  switch (filter.value) {
    case "sample":
      return getSampleConditions()
    case "cell":
      return getCellConditions()
    case "gene":
      return getGeneCondition()
    default:
      return {}
  }
})

const getSampleConditions = () => {
  const {
    species,
    organ,
    external_sample_accesstion,
    disease,
    development_stage,
  } = sample.value
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
    ...(external_sample_accesstion ? { external_sample_accesstion } : {}),
    ...(disease ? { disease } : {}),
    ...(development_stage ? { development_stage } : {}),
  }
}

const getCellConditions = () => {
  const result = {}
  const { species, ct_id, cl_cell_id, ct_gene_ids, searchBy } = cell.value
  if (species) {
    result.species_id = species
  }
  if (searchBy === "id") {
    if (ct_id) {
      result.ct_id = ct_id
    }
  } else if (searchBy === "name") {
    if (cl_cell_id) {
      result.cl_id = cl_cell_id
    }
  } else if (searchBy === "gene") {
    if (ct_gene_ids) {
      result.ct_id = ct_gene_ids.join()
    }
  }
  return result
}

const getGeneCondition = () => {
  const { species, symbol } = gene.value
  return {
    ...(species ? { species_id: species } : {}),
    ...(symbol ? { gene_symbol: symbol } : {}),
  }
}

const searchFunc = computed(() => {
  switch (filter.value) {
    case "sample":
      return getSampleProjectList
    case "cell":
      return getCellProjectList
    case "gene":
      return getGeneProjectList
    default:
      return () => {}
  }
})

const resetForm = () => {
  switch (filter.value) {
    case "sample":
      sampleFormRef.value.resetFields()
      break
    case "cell":
      cellFormRef.value.resetFields()
      break
    case "gene":
      geneFormRef.value.resetFields()
      break
    default:
      break
  }
}

const handleOrganSearch = async (keywords) => {
  try {
    state.value.organFetching = true
    const data = await getOrganList(keywords)
    options.value.organ = data.map((item) => ({ label: item, value: item }))
  } finally {
    state.value.organFetching = false
  }
}

const handleCellIDSearch = async (keywords) => {
  try {
    state.value.cellIDFetching = true
    const data = await getCellTypeList({
      cell_type_id: keywords,
      species_id: cell.value.species,
    })
    options.value.cellIds = data.cell_type_list.map((item) => ({
      label: item.cell_type_name,
      value: item.cell_taxonomy_id,
    }))
  } finally {
    state.value.cellIDFetching = false
  }
}

const handleGeneSymbolSearch = async (keywords) => {
  try {
    state.value.geneSymbolFetching = true
    const data = await getGeneSymbolList({ gene_symbol: keywords })
    options.value.geneSymbol = data.map((item) => ({
      label: item,
      value: item,
    }))
  } finally {
    state.value.geneSymbolFetching = false
  }
}

const validate = () => {
  switch (filter.value) {
    case "cell":
      return cellFormRef.value.validate()
    case "gene":
      return geneFormRef.value.validate()
    default:
      return Promise.resolve()
  }
}

const handleSearch = () => {
  validate().then(() => {
    projectTableRef.value.handleSearch()
  })
}

const handleCellNameSearch = () => {
  cellNameInput.value.blur()
  cellNameRef.value.showModal()
}

const handleGeneNameSearch = () => {
  geneNameInput.value.blur()
  geneNameRef.value.showModal(cell.value.species)
}

const handleCellNameChange = (result) => {
  cell.value.name = result.name
  cell.value.cl_cell_id = result.cl_id
}

const handleGeneNameChange = (result) => {
  cell.value.names = result.map((item) => item.cell_type_name).join()
  cell.value.ct_gene_ids = result.map((item) => item.cell_type_id)
}

const handleTreeOpen = (cell_record) => {
  cell.value.searchBy = "name"
  cellNameRef.value.showModal(cell_record)
}

onMounted(() => {
  getOptions().then(() => {
    const { organ, species } = route.query
    Object.assign(sample.value, {
      organ,
      species: species ? Number(species) : undefined,
    })
    handleSearch()
  })
})

const handleSearchConditionByType = async (key, type, loadingKey) => {
  try {
    state.value[loadingKey] = true
    if (key) {
      const data = await searchItemsByType(key, type)
      console.log(data)
      options.value[type] = data.biosample_list.map((item) => ({ value: item }))
    } else {
      options.value[type] = []
    }
  } finally {
    state.value[loadingKey] = false
  }
}

const handleTableTypeChange = (type) => {
  filter.value = type
  columns.value[type] = columnsTotal.value[type]
  projectTableRef.value.handleReset()
  nextTick(() => {
    if (type === "sample") {
      handleSearch()
    }
  })
}

const getOptions = () => {
  return Promise.all([getSpecieOptions(), handleOrganSearch()])
}

const getSpecieOptions = async () => {
  const data = await getSpecieList()
  options.value.species = data
}

const handleChartModalOpen = () => {
  geneChartRef.value.openModal(getGeneCondition())
}

const handleListDownload = async () => {
  try {
    downloading.value = true
    await validate()
    const data = await {
      sample: downloadSampleProjectList,
      cell: downloadCellProjectList,
      gene: downloadGeneProjectList,
    }[filter.value]?.(searchCondition.value)
    saveAs(data, `${filter.value}_project_list.xlsx`)
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped lang="scss">
//.conditions {
//  width: 300px;
//}
.list-container {
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;

  .content-container {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0 0 0.75rem;
    align-items: stretch;
    flex: 1 0 0;
    height: 0;

    .top {
      display: flex;
      flex: none;
      height: 4rem;
      align-items: stretch;
      border-radius: 1.875rem 0 0 0;
      overflow: hidden;
      box-sizing: border-box;

      .type {
        flex: 1;
        display: flex;
        align-items: center;
        background: #0081d8;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);

        .selector {
          cursor: pointer;
          width: 14rem;

          &-name {
            color: #fff;
            font-size: 1.25rem;
            font-weight: 400;
            line-height: 1.375rem; /* 110% */
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
        }
      }

      :deep(.columns) {
        background: #0081d8;
      }

      .download {
        height: 100%;
        border-radius: 0;
        border: 0;
        background: #00a9dd;
        display: flex;
        align-items: center;
        margin: 0 0.38rem;
        padding: 0 1.25rem;
        cursor: pointer;
        color: #fff;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.375rem;

        &:hover {
          background: rgba(#00a9dd, 0.8);
        }
      }

      .chart {
        @extend .download;
        margin-right: 0;
      }

      .fill {
        background: #0081d8;
        width: 2.5rem;
      }
    }

    .bottom {
      display: flex;
      flex: 1;
      align-items: stretch;
      background: #0081d8;

      .left {
        background: #0081d8;
        width: 12.5rem;

        .condition-item {
          padding: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 0;

          :deep(.ant-form-item-label) {
            label {
              color: #fff;
              font-size: 1rem;
              font-weight: 600;
              text-transform: capitalize;
            }
          }

          :deep(.ant-form-item-control-input) {
            .ant-select-selector,
            .ant-input {
              border-radius: 1.25rem;
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
          }

          :deep(.ant-radio-wrapper) {
            color: #fff;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.375rem;

            .ant-radio-inner {
              width: 18px;
              height: 18px;

              &:after {
                margin-block-start: -9px;
              }
            }

            .ant-radio-checked .ant-radio-inner {
              border-color: #ff7555;
              background-color: #ff7555;
            }
          }

          :deep(.ant-form-item-explain-error) {
            text-align: center;
            color: #ffffff;
          }

          :deep(.ant-form-item-required) {
            &:before {
              color: #ffffff;
            }
          }
        }

        .action {
          display: flex;
          padding: 1.5rem 0.75rem;
          flex-direction: column;
          align-items: stretch;
          gap: 0.625rem;
          align-self: stretch;

          .search {
            border-radius: 2.9375rem;
            background: #ff7555;
            border: 1px solid transparent;
            height: 2.375rem;
            padding: 0 1.75rem;
            gap: 0.625rem;
            align-self: stretch;
            color: #fff;
            font-size: 1rem;
            font-weight: 400;
          }

          .reset {
            border-radius: 2.9375rem;
            background: transparent;
            border: 1px solid #fff;
            height: 2.375rem;
            padding: 0 1.75rem;
            gap: 0.625rem;
            align-self: stretch;
            color: #fff;
            font-size: 1rem;
            font-weight: 400;
          }
        }
      }

      .right {
        background-color: #f0f2f5;
        border-top-left-radius: 1.5rem;
        overflow: hidden;
        flex: 1;
        width: 0;
        padding: 1.5rem 0.75rem 0;
      }
    }
  }
}
</style>
