<template>
  <a-modal
    v-model:open="open"
    class="simple-modal"
    title="Search Cell Name By Gene"
    :width="1200"
    :mask-closable="false"
    :ok-button-props="{
      class: 'ok-button',
    }"
    :cancel-button-props="{
      class: 'cancel-button',
    }"
    @ok="confirm"
  >
    <div class="py-6">
      <a-form layout="inline" class="items-center px-4">
        <a-form-item
          label="Positive"
          name="positive"
          class="search-condition-item condition-item"
        >
          <a-select
            v-model:value="condition.positive"
            mode="tags"
            :token-separators="[',']"
            placeholder="Positive"
            allow-clear
            size="large"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="Negative"
          name="negative"
          class="search-condition-item condition-item"
        >
          <a-select
            v-model:value="condition.negative"
            mode="tags"
            :token-separators="[',']"
            placeholder="Negative"
            allow-clear
            size="large"
          ></a-select>
        </a-form-item>
        <a-button
          :loading="loading"
          class="search-button"
          type="primary"
          @click="handleSearch"
        >
          Search
        </a-button>
      </a-form>
    </div>
    <div class="py-6 bg-white selection">
      <div v-if="selectedCells.length">
        <a-tag
          v-for="item in selectedCells"
          :key="item.cell_type_id"
          class="large-tag"
          closable
          @close="handleRemoveSelectCell(item)"
        >
          {{ item.cell_type_name }}
        </a-tag>
      </div>
      <div v-else class="text-center">
        <a-empty
          :image="Empty.PRESENTED_IMAGE_SIMPLE"
          description="No selection"
        />
      </div>
    </div>
    <div class="bg-white">
      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="list"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ y: '50vh' }"
        :show-sorter-tooltip="false"
        @change="handleTableChange"
      >
        <template #headerCell="{ title, column }">
          <template v-if="column.dataIndex === 'cell_type_id'">
            {{ title }}
            <a-tooltip placement="bottom">
              <template #title>
                <span>高亮表示该ID存在公开数据</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </template>
          <template v-if="column.dataIndex === 'score'">
            {{ title }}
            <a-tooltip placement="bottom">
              <template #title>
                <span>
                  The similarity score, ranging from 0 to 1, is computed for two
                  cell types based on the common markers normalized by the union
                  of marker set sizes. A score of 1 indicates identical marker
                  sets, while 0 signifies the absence of shared markers between
                  the two cell types.
                </span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </template>
        </template>
        <template #bodyCell="{ text, column, record }">
          <template v-if="column.dataIndex === 'cell_type_id'">
            <span :class="{ 'id-highlighted': record.is_exist }">
              {{ text }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'cell_type_name'">
            <a class="underline" @click="handleOpenInCellTree(record)">
              {{ text }}
            </a>
          </template>
          <template v-if="column.dataIndex === 'marker_gene_symbol'">
            <div class="gene_symbol">
              <span v-for="item in text.split(',')" :key="item" class="symbol">
                <span
                  :class="{
                    highlighted: record['intersection_list'].includes(item),
                  }"
                >
                  {{ item }}
                </span>
                <span>,</span>
              </span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button
              class="button-select"
              @click="handleRecordSelected(record)"
            >
              Select
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref } from "vue"
import { usePagination } from "vue-request"
import { getGeneCellTaxonomy } from "@/api/cell.js"
import _ from "lodash"
import { Empty } from "ant-design-vue"
import { QuestionCircleOutlined } from "@ant-design/icons-vue"

const emits = defineEmits(["confirm", "treeOpen"])
const selectedCells = ref([])
const open = ref(false)
const condition = ref({
  positive: [],
  negative: [],
  specie_id: null,
})

const columns = [
  {
    title: "ID",
    dataIndex: "cell_type_id",
    width: 120,
  },
  {
    title: "Name",
    dataIndex: "cell_type_name",
    width: 200,
  },
  {
    title: "Cell Number",
    dataIndex: "cell_number",
    width: 120,
  },
  {
    title: "Marker Gene Symbol",
    dataIndex: "marker_gene_symbol",
  },
  {
    title: "Score",
    dataIndex: "score",
    width: 110,
    sorter: true,
    customRender: ({ text }) => {
      return text.toFixed(4)
    },
  },
  {
    title: "",
    dataIndex: "action",
    width: 100,
  },
]

const {
  data: dataSource,
  run,
  total,
  loading,
  current,
  pageSize,
} = usePagination(getGeneCellTaxonomy, {
  manual: true,
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
    totalKey: "total",
  },
})

const list = computed(() => {
  return dataSource?.value?.list || []
})

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  showSizeChanger: false,
  position: ["bottomCenter"],
}))

const getConditions = () => {
  const { positive, negative, specie_id } = condition.value
  return {
    species_id: specie_id,
    genes_positive: positive.join(","),
    genes_negative: negative.join(","),
  }
}

const handleTableChange = (pag, filters, sorter) => {
  run({
    page_size: pag.pageSize,
    page: pag?.current,
    asc: sorter.order === "ascend",
    ...getConditions(),
    ...filters,
  })
}

const handleSearch = () => {
  run({
    page_size: pagination.value.pageSize,
    page: 1,
    ...getConditions(),
  })
}

const handleRecordSelected = (record) => {
  if (!_.find(selectedCells.value, { cell_type_id: record.cell_type_id })) {
    selectedCells.value.push(record)
  }
}

const handleRemoveSelectCell = (record) => {
  _.remove(selectedCells.value, { cell_type_id: record.cell_type_id })
}

const showModal = (specie_id) => {
  condition.value.specie_id = specie_id
  open.value = true
}

const confirm = () => {
  open.value = false
  emits("confirm", selectedCells.value)
}

const handleOpenInCellTree = (record) => {
  open.value = false
  emits("treeOpen", record)
}

defineExpose({
  showModal,
})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/modal-form";

.symbol {
  &:last-child {
    span:nth-child(2) {
      display: none;
    }
  }
}

.highlighted {
  background: #efb041;
}

.id-highlighted {
  background: rgba(95, 255, 70, 0.5);
}

.selection {
  border-radius: 1.375rem 1.375rem 0 0;
  padding: 1.375rem;
  overflow: hidden;
}

.large-tag {
  font-size: 1rem;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  :deep(.ant-tag-close-icon) {
    margin-left: 4px;
  }
}

.gene_symbol {
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
