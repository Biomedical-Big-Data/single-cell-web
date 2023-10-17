<template>
  <div class="p-4 flex">
    <div class="conditions flex-none mr-4">
      <a-card :bodyStyle="{ padding: '16px' }">
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
            <a-form layout="vertical" :model="sample" ref="sampleFormRef">
              <a-form-item label="Organ" name="organ">
                <a-select
                  v-model:value="sample.organ"
                  show-search
                  placeholder="Organ"
                  :options="options.organ"
                  @search="handleOrganSearch"
                  allow-clear
                >
                  <template v-if="state.organFetching" #notFoundContent>
                    <a-spin size="small" />
                  </template>
                </a-select>
              </a-form-item>

              <a-form-item label="Species" name="species">
                <a-select
                  v-model:value="sample.species"
                  :options="SPECIES"
                  placeholder="Species"
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
            <a-form layout="vertical" :model="cell" ref="cellFormRef">
              <a-form-item label="Species" name="species">
                <a-select
                  v-model:value="cell.species"
                  :options="SPECIES"
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
                      v-model:value="cell.name"
                      placeholder="Click to search"
                      @focus="handleCellNameSearch"
                      ref="cellNameInput"
                    />
                  </a-form-item>
                </div>
                <div v-else>
                  <a-form-item label="Positive" name="positive">
                    <a-select
                      v-model:value="cell.positive"
                      mode="tags"
                      placeholder="Positive"
                      allow-clear
                    ></a-select>
                  </a-form-item>
                  <a-form-item label="Negative" name="negative">
                    <a-select
                      v-model:value="cell.negative"
                      mode="tags"
                      placeholder="Negative"
                      allow-clear
                    ></a-select>
                  </a-form-item>
                </div>
              </div>
            </a-form>
          </div>
          <div v-if="filter === 'gene'">
            <a-form layout="vertical" :model="gene" ref="geneFormRef">
              <a-form-item label="Species" name="species">
                <a-select
                  v-model:value="gene.species"
                  :options="SPECIES"
                  placeholder="Species"
                  allow-clear
                ></a-select>
              </a-form-item>
              <a-form-item label="Search by gene symbol" name="symbol">
                <a-select
                  show-search
                  v-model:value="gene.symbol"
                  placeholder="Gene Symbol"
                  :options="options.geneSymbol"
                  @search="handleGeneSymbolSearch"
                  allow-clear
                >
                  <template v-if="state.geneSymbolFetching" #notFoundContent>
                    <a-spin size="small" />
                  </template>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </div>
        <div class="mt-4 flex justify-between align-center">
          <a-button class="flex items-center" @click="resetForm">
            <template #icon>
              <undo-outlined />
            </template>
            <span>Reset</span>
          </a-button>
          <a-button
            type="primary"
            class="ml-2 flex items-center"
            @click="handleSearch"
          >
            <template #icon>
              <search-outlined />
            </template>
            Search All
          </a-button>
        </div>
      </a-card>
    </div>
    <div class="flex-1">
      <div class="bg-white rounded-lg">
        <SampleTable
          ref="sampleTableRef"
          v-if="filter === 'sample'"
        ></SampleTable>
        <CellTable ref="cellTableRef" v-if="filter === 'cell'"></CellTable>
        <GeneTable ref="geneTableRef" v-if="filter === 'gene'"></GeneTable>
      </div>
    </div>
  </div>

  <CellNameModal
    ref="cellNameRef"
    @confirm="handleCellNameChange"
  ></CellNameModal>
</template>
<script setup>
import { ref } from "vue";
import { UndoOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { SPECIES } from "@/constants/common";
import { getOrganList } from "@/api/project";
import SampleTable from "@/components/projects/SampleTable.vue";
import CellTable from "@/components/projects/CellTable.vue";
import GeneTable from "@/components/projects/GeneTable.vue";
import { getGeneSymbolList } from "@/api/options.js";
import CellNameModal from "@/components/projects/CellNameModal.vue";

const options = ref({
  organ: [],
  cell: [],
  geneSymbol: [],
});

const state = ref({
  organFetching: false,
  geneSymbolFetching: false,
});

// const filter = ref('sample')
const filter = ref("cell");

const sample = ref({
  species: undefined,
  organ: undefined,
  external_sample_accession: "",
  disease: "",
  development_stage: "",
});

const sampleFormRef = ref();
const sampleTableRef = ref();
const cellNameRef = ref();
const cellNameInput = ref();

const cell = ref({
  species: undefined,
  ci_id: "",
  cl_id: "",
  searchBy: "name",
  name: "",
  positive: [],
  negative: [],
});

const cellFormRef = ref();
const cellTableRef = ref();

const gene = ref({
  species: undefined,
  symbol: undefined,
});

const geneFormRef = ref();
const geneTableRef = ref();

const resetForm = () => {
  switch (filter.value) {
    case "sample":
      sampleFormRef.value.resetFields();
      break;
    case "cell":
      cellFormRef.value.resetFields();
      break;
    case "gene":
      geneFormRef.value.resetFields();
      break;
    default:
      break;
  }
};

const handleOrganSearch = async (keywords) => {
  try {
    state.value.organFetching = true;
    const data = await getOrganList(keywords);
    options.value.organ = data.map((item) => ({ label: item, value: item }));
  } finally {
    state.value.organFetching = false;
  }
};

const handleGeneSymbolSearch = async (keywords) => {
  try {
    state.value.geneSymbolFetching = true;
    const data = await getGeneSymbolList({ gene_symbol: keywords });
    options.value.geneSymbol = data.map((item) => ({
      label: item,
      value: item,
    }));
  } finally {
    state.value.geneSymbolFetching = false;
  }
};

const getConditions = () => {
  switch (filter.value) {
    case "sample":
      return sample.value;
    case "cell":
      return cell.value;
    case "gene":
      return gene.value;
    default:
      return {};
  }
};

const handleSearch = () => {
  switch (filter.value) {
    case "sample":
      sampleTableRef.value.handleSearch(getConditions());
      break;
    case "cell":
      cellTableRef.value.handleSearch(getConditions());
      break;
    case "gene":
      geneTableRef.value.handleSearch(getConditions());
      break;
    default:
      break;
  }
};

const handleCellNameSearch = () => {
  cellNameInput.value.blur();
  cellNameRef.value.showModal();
};

const handleCellNameChange = (result) => {
  cell.value.name = result.name;
  cell.value.cl_id = result.cl_id;
};
</script>

<style scoped lang="scss">
.conditions {
  width: 300px;
}
</style>
