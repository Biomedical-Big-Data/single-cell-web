<template>
  <div class="h-screen list-container">
    <div class="nav">
      <div class="back-container" @click="handleGoHome()">
        <img src="@/assets/icons/icon-back.svg" alt="">
        <span>Home</span>
      </div>
      <div class="user-container">
        <a-button class="create-action">
          Create Project
        </a-button>
        <a-avatar>
          ABC
        </a-avatar>
      </div>
    </div>
    <div class="content-container">
      <div class="top">
        <div class="type">
          <a-dropdown size="large" placement="bottom" class="selector" arrow trigger="click">
            <div class="selector-name">
              Search by <span class="capitalize">{{ filter }}</span>
              <CaretDownOutlined/>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a class="selector-item" @click="filter = 'sample'">sample</a>
                </a-menu-item>
                <a-menu-item>
                  <a class="selector-item" @click="filter = 'cell'">cell</a>
                </a-menu-item>
                <a-menu-item>
                  <a class="selector-item" @click="filter = 'gene'">gene</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <a-popover placement="bottom" class="columns" trigger="click">
          <img src="@/assets/icons/icon-setting.svg" alt="">
          Customised columns
          <template #content>
            <div>
              <a-collapse
                  v-model:activeKey="activeKey"
                  :bordered="false"
                  style="background: rgb(255, 255, 255)"
              >
                <template #expandIcon="{ isActive }">
                  <caret-right-outlined :rotate="isActive ? 90 : 0"/>
                </template>
                <a-collapse-panel key="1" header="This is panel header 1" :style="customStyle">
                  <p>{{ text }}</p>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="This is panel header 2" :style="customStyle">
                  <p>{{ text }}</p>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </template>
        </a-popover>
        <div class="download">
          Download CSV
        </div>
        <div class="fill">

        </div>
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
                    <a-spin/>
                  </template>
                </a-select>
              </a-form-item>

              <a-form-item label="Species" name="species" class="condition-item">
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
                  name="external_sample_accession"
                  class="condition-item"
              >
                <a-input
                    v-model:value="sample.external_sample_accession"
                    placeholder="External Accession"
                    size="large"
                ></a-input>
              </a-form-item>
              <a-form-item label="Disease" name="disease" class="condition-item">
                <a-input
                    v-model:value="sample.disease"
                    placeholder="Disease"
                    size="large"
                ></a-input>
              </a-form-item>
              <a-form-item label="Development Stage" name="development_stage" class="condition-item">
                <a-input
                    v-model:value="sample.development_stage"
                    placeholder="Development Stage"
                    size="large"
                ></a-input>
              </a-form-item>
            </a-form>
          </div>
          <div v-if="filter === 'cell'">
            <a-form ref="cellFormRef" layout="vertical" :model="cell">
              <a-form-item label="Species" name="species">
                <a-select
                    v-model:value="cell.species"
                    :options="options.species"
                    :field-names="{ label: 'species', value: 'id' }"
                    placeholder="Species"
                    allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item label="CI ID" name="ci_id">
                <a-input
                    v-model:value="cell.ci_id"
                    placeholder="CI ID"
                    allow-clear
                ></a-input>
              </a-form-item>
              <div v-if="cell.species">
                <a-form-item label="Search By" name="searchBy">
                  <a-radio-group v-model:value="cell.searchBy">
                    <a-radio value="name">Name</a-radio>
                    <a-radio value="gene">Gene</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="cell.searchBy === 'name'">
                  <a-form-item label="Name" name="name">
                    <a-input
                        ref="cellNameInput"
                        v-model:value="cell.name"
                        placeholder="Click to search"
                        @focus="handleCellNameSearch"
                    />
                  </a-form-item>
                </div>
                <div v-else>
                  <a-form-item label="Positive" name="positive">
                    <a-select
                        v-model:value="cell.positive"
                        mode="tags"
                        :token-separators="[',']"
                        placeholder="Positive"
                        allow-clear
                    ></a-select>
                  </a-form-item>
                  <a-form-item label="Negative" name="negative">
                    <a-select
                        v-model:value="cell.negative"
                        mode="tags"
                        :token-separators="[',']"
                        placeholder="Negative"
                        allow-clear
                    ></a-select>
                  </a-form-item>
                </div>
              </div>
            </a-form>
          </div>
          <div v-if="filter === 'gene'">
            <a-form ref="geneFormRef" layout="vertical" :model="gene">
              <a-form-item label="Species" name="species">
                <a-select
                    v-model:value="gene.species"
                    :options="options.species"
                    :field-names="{ label: 'species', value: 'id' }"
                    placeholder="Species"
                    allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item label="Search by gene symbol" name="symbol">
                <a-select
                    v-model:value="gene.symbol"
                    show-search
                    placeholder="Gene Symbol"
                    :options="options.geneSymbol"
                    allow-clear
                    @search="handleGeneSymbolSearch"
                >
                  <template v-if="state.geneSymbolFetching" #notFoundContent>
                    <a-spin/>
                  </template>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
          <div class="action">

            <a-button
                type="primary"
                class="search"
                @click="handleSearch"
            >
              Search all
            </a-button>
            <a-button class="reset" @click="resetForm">
              <span>Reset</span>
            </a-button>
          </div>
        </div>
        <div class="right">
          <SampleTable
              v-if="filter === 'sample'"
              ref="sampleTableRef"
          ></SampleTable>
          <CellTable v-if="filter === 'cell'" ref="cellTableRef"></CellTable>
          <GeneTable v-if="filter === 'gene'" ref="geneTableRef"></GeneTable>
        </div>
      </div>

    </div>

  </div>


  <div v-if="false" class="p-4 flex">
    <div class="conditions flex-none mr-4">
      <a-card :body-style="{ padding: '16px' }">
        <div>Filters</div>
        <div class="mt-2">
          <a-radio-group v-model:value="filter" class="flex w-full">
            <a-radio-button value="sample" class="flex-1 text-center">
              Sample
            </a-radio-button>
            <a-radio-button value="cell" class="flex-1 text-center">
              Cell
            </a-radio-button>
            <a-radio-button value="gene" class="flex-1 text-center">
              Gene
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="mt-4">
          <div v-if="filter === 'sample'">
            <a-form ref="sampleFormRef" layout="vertical" :model="sample">
              <a-form-item label="Organ" name="organ">
                <a-select
                    v-model:value="sample.organ"
                    show-search
                    placeholder="Organ"
                    :options="options.organ"
                    allow-clear
                    @search="handleOrganSearch"
                >
                  <template v-if="state.organFetching" #notFoundContent>
                    <a-spin/>
                  </template>
                </a-select>
              </a-form-item>

              <a-form-item label="Species" name="species">
                <a-select
                    v-model:value="sample.species"
                    :options="options.species"
                    placeholder="Species"
                    :field-names="{ label: 'species', value: 'id' }"
                    allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item
                  label="External Accession"
                  name="external_sample_accession"
              >
                <a-input
                    v-model:value="sample.external_sample_accession"
                    placeholder="External Accession"
                ></a-input>
              </a-form-item>
              <a-form-item label="Disease" name="disease">
                <a-input
                    v-model:value="sample.disease"
                    placeholder="Disease"
                ></a-input>
              </a-form-item>
              <a-form-item label="Development Stage" name="development_stage">
                <a-input
                    v-model:value="sample.development_stage"
                    placeholder="Development Stage"
                ></a-input>
              </a-form-item>
            </a-form>
          </div>
          <div v-if="filter === 'cell'">
            <a-form ref="cellFormRef" layout="vertical" :model="cell">
              <a-form-item label="Species" name="species">
                <a-select
                    v-model:value="cell.species"
                    :options="options.species"
                    :field-names="{ label: 'species', value: 'id' }"
                    placeholder="Species"
                    allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item label="CI ID" name="ci_id">
                <a-input
                    v-model:value="cell.ci_id"
                    placeholder="CI ID"
                    allow-clear
                ></a-input>
              </a-form-item>
              <div v-if="cell.species">
                <a-form-item label="Search By" name="searchBy">
                  <a-radio-group v-model:value="cell.searchBy">
                    <a-radio value="name">Name</a-radio>
                    <a-radio value="gene">Gene</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="cell.searchBy === 'name'">
                  <a-form-item label="Name" name="name">
                    <a-input
                        ref="cellNameInput"
                        v-model:value="cell.name"
                        placeholder="Click to search"
                        @focus="handleCellNameSearch"
                    />
                  </a-form-item>
                </div>
                <div v-else>
                  <a-form-item label="Positive" name="positive">
                    <a-select
                        v-model:value="cell.positive"
                        mode="tags"
                        :token-separators="[',']"
                        placeholder="Positive"
                        allow-clear
                    ></a-select>
                  </a-form-item>
                  <a-form-item label="Negative" name="negative">
                    <a-select
                        v-model:value="cell.negative"
                        mode="tags"
                        :token-separators="[',']"
                        placeholder="Negative"
                        allow-clear
                    ></a-select>
                  </a-form-item>
                </div>
              </div>
            </a-form>
          </div>
          <div v-if="filter === 'gene'">
            <a-form ref="geneFormRef" layout="vertical" :model="gene">
              <a-form-item label="Species" name="species">
                <a-select
                    v-model:value="gene.species"
                    :options="options.species"
                    :field-names="{ label: 'species', value: 'id' }"
                    placeholder="Species"
                    allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item label="Search by gene symbol" name="symbol">
                <a-select
                    v-model:value="gene.symbol"
                    show-search
                    placeholder="Gene Symbol"
                    :options="options.geneSymbol"
                    allow-clear
                    @search="handleGeneSymbolSearch"
                >
                  <template v-if="state.geneSymbolFetching" #notFoundContent>
                    <a-spin/>
                  </template>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <div class="mt-4 flex justify-between align-center">
          <a-button class="flex items-center" @click="resetForm">
            <template #icon>
              <undo-outlined/>
            </template>
            <span>Reset</span>
          </a-button>
          <a-button
              type="primary"
              class="ml-2 flex items-center"
              @click="handleSearch"
          >
            <template #icon>
              <search-outlined/>
            </template>
            Search All
          </a-button>
        </div>
      </a-card>
    </div>
    <div class="flex-1 w-0">
      <div class="bg-white rounded-lg">
        <SampleTable
            v-if="filter === 'sample'"
            ref="sampleTableRef"
        ></SampleTable>
        <CellTable v-if="filter === 'cell'" ref="cellTableRef"></CellTable>
        <GeneTable v-if="filter === 'gene'" ref="geneTableRef"></GeneTable>
      </div>
    </div>
  </div>

  <GeneNameModal
      ref="geneNameRef"
      @confirm="handleGeneNameChange"
  ></GeneNameModal>
  <CellNameModal
      ref="cellNameRef"
      @confirm="handleCellNameChange"
  ></CellNameModal>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { UndoOutlined, SearchOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import { getOrganList } from '@/api/project'
import SampleTable from '@/components/projects/SampleTable.vue'
import CellTable from '@/components/projects/CellTable.vue'
import GeneTable from '@/components/projects/GeneTable.vue'
import { getGeneSymbolList, getSpecieList } from '@/api/options.js'
import CellNameModal from '@/components/projects/CellNameModal.vue'
import GeneNameModal from '@/components/projects/GeneNameModal.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const options = ref({
  species: [],
  organ: [],
  cell: [],
  geneSymbol: [],
})

const state = ref({
  organFetching: false,
  geneSymbolFetching: false,
})

const filter = ref('sample')
// const filter = ref("cell");

const sample = ref({
  species: undefined,
  organ: undefined,
  external_sample_accession: '',
  disease: '',
  development_stage: '',
})

const sampleFormRef = ref()
const sampleTableRef = ref()
const cellNameRef = ref()
const cellNameInput = ref()

const cell = ref({
  species: undefined,
  ci_id: '',
  cl_id: '',
  searchBy: 'name',
  name: '',
  positive: [],
  negative: [],
})

const cellFormRef = ref()
const cellTableRef = ref()

const gene = ref({
  species: undefined,
  symbol: undefined,
})

const geneFormRef = ref()
const geneTableRef = ref()

const resetForm = () => {
  switch (filter.value) {
    case 'sample':
      sampleFormRef.value.resetFields()
      break
    case 'cell':
      cellFormRef.value.resetFields()
      break
    case 'gene':
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

const getConditions = () => {
  switch (filter.value) {
    case 'sample':
      return sample.value
    case 'cell':
      return cell.value
    case 'gene':
      return gene.value
    default:
      return {}
  }
}

const handleSearch = () => {
  switch (filter.value) {
    case 'sample':
      sampleTableRef.value.handleSearch(getConditions())
      break
    case 'cell':
      cellTableRef.value.handleSearch(getConditions())
      break
    case 'gene':
      geneTableRef.value.handleSearch(getConditions())
      break
    default:
      break
  }
}

const handleCellNameSearch = () => {
  cellNameInput.value.blur()
  cellNameRef.value.showModal()
}

const handleCellNameChange = (result) => {
  cell.value.name = result.name
  cell.value.cl_id = result.cl_id
}

const handleGeneNameChange = (result) => {
  console.log(result)
}

onMounted(() => {
  getOptions().then(() => {
    const { organ, species } = route.query
    Object.assign(sample.value, {
      organ,
      species: species ? Number(species) : undefined,
    })
    if (organ || species) {
      handleSearch()
    }
  })
})

const handleGoHome = () => {
  router.push({ name: 'home' })
}

const getOptions = () => {
  return Promise.all([getSpecieOptions()])
}

const getSpecieOptions = async () => {
  const data = await getSpecieList()
  options.value.species = data
}
</script>

<style scoped lang="scss">
//.conditions {
//  width: 300px;
//}
.list-container {
  background-color: #F0F2F5;
  display: flex;
  flex-direction: column;

  .nav {
    background: #ffffff;
    display: flex;
    padding: 0.625rem 1.25rem;
    justify-content: space-between;
    align-items: center;

    .back-container {
      display: flex;
      height: 2.25rem;
      padding: 0 0.75rem;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;

      &:hover {
        filter: brightness(0) saturate(100%) invert(41%) sepia(100%) saturate(4465%) hue-rotate(186deg) brightness(96%) contrast(102%);
      }


      img {
        width: 1.125rem;
        height: 1.125rem;
      }

      span {
        color: #5F5F5F;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.375rem; /* 137.5% */
      }
    }

    .user-container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.75rem;

      .create-action {
        display: flex;
        height: 2.25rem;
        padding: 0 1.75rem 0.125rem 1.75rem;
        justify-content: center;
        align-items: center;
        gap: 0.625rem;
        border-radius: 2.9375rem;
        background: #0062FF;
        color: #FFF;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.375rem;
      }
    }
  }


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
        background: #0081D8;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.20);

        .selector {
          cursor: pointer;
          width: 14rem;

          &-name {
            color: #FFF;
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
        background: #0081D8;
        display: flex;
        align-items: center;
        padding: 0 1.25rem;
        color: #FFF;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.375rem;
        cursor: pointer;

        img {
          margin-right: 0.62rem;
        }
      }

      .download {
        background: #00A9DD;
        display: flex;
        align-items: center;
        margin: 0 0.38rem;
        padding: 0 1.25rem;
        cursor: pointer;
        color: #FFF;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.375rem;
      }

      .fill {
        background: #0081D8;
        width: 2.5rem;
      }
    }

    .bottom {
      display: flex;
      flex: 1;
      align-items: stretch;
      background: #0081D8;

      .left {
        background: #0081D8;
        width: 12.5rem;

        .condition-item {
          padding: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.20);
          margin-bottom: 0;

          :deep(.ant-form-item-label) {
            label {
              color: #FFF;
              font-size: 1rem;
              font-weight: 600;
              text-transform: capitalize;
            }
          }

          :deep(.ant-form-item-control-input) {
            .ant-select-selector, .ant-input {
              border-radius: 1.25rem;
              padding-left: 0.75rem;
              padding-right: 0.75rem;
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
            background: #FF7555;
            border: 1px solid transparent;
            display: flex;
            height: 2rem;
            padding: 0 1.75rem;
            justify-content: center;
            align-items: center;
            gap: 0.625rem;
            align-self: stretch;
            color: #FFF;
            font-size: 1rem;
            font-weight: 400;
          }

          .reset {
            border-radius: 2.9375rem;
            background: transparent;
            border: 1px solid #FFF;
            display: flex;
            height: 2rem;
            padding: 0 1.75rem;
            justify-content: center;
            align-items: center;
            gap: 0.625rem;
            align-self: stretch;
            color: #FFF;
            font-size: 1rem;
            font-weight: 400;
          }
        }

      }

      .right {
        background-color: #F0F2F5;
        border-top-left-radius: 1.5rem;
        overflow: hidden;
        flex: 1;
        width: 0;
        padding: 1.5rem 0.75rem 0;

      }
    }
  }
}

.selector-item {
  color: #5F5F5F;
  font-size: 1rem;
  font-weight: 400;
  text-transform: capitalize;
  padding: 7px 0.75rem;
  display: inline-block;
}

</style>
