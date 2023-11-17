<template>
  <a-modal
      v-model:open="open"
      class="simple-modal"
      title="Search Cell Name By Gene"
      :width="1200"
      :mask-closable="false"
      :ok-button-props="{
        class:'ok-button'
      }"
      :cancel-button-props="{
        class:'cancel-button'
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
        <a-button :loading="loading" class="search-button" type="primary" @click="handleSearch">
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
        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" description="No selection"/>
      </div>
    </div>
    <div class="bg-white">
      <a-table
          :columns="columns"
          :row-key="(record) => record.id"
          :data-source="list"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
      >
        <template #bodyCell="{ text, column, record }">
          <template v-if="column.dataIndex === 'marker_gene_symbol'">
            <div>
              <span
                  v-for="item in text.split(',')"
                  :key="item"
                  class="symbol"
              >
              <span
                  :class="{
                  highlighted: record['intersection_list'].includes(item),
                }">
                {{ item }}
              </span>
              <span>,</span>
              </span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button @click="handleRecordSelected(record)">选择</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import { getGeneCellTaxonomy } from '@/api/cell.js'
import _ from 'lodash'
import { Empty } from 'ant-design-vue'

const emits = defineEmits(['confirm'])
const selectedCells = ref([])
const open = ref(false)
const condition = ref({
  positive: [],
  negative: [],
  specie_id: null,
})

const columns = [
  {
    title: 'ID',
    dataIndex: 'cell_type_id',
    width: 100,
  },
  {
    title: 'Name',
    dataIndex: 'cell_type_name',
  },
  {
    title: 'Marker Gene Symbol',
    dataIndex: 'marker_gene_symbol',
    width: 600,
  },
  {
    title: 'Score',
    dataIndex: 'score',
    width: 50,
    sorter: true,
    customRender: ({ text }) => {
      return text.toFixed(4)
    },
  },
  {
    title: '',
    dataIndex: 'action',
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
    currentKey: 'page',
    pageSizeKey: 'page_size',
    totalKey: 'total',
  },
})

const list = computed(() => {
  return dataSource?.value?.list || []
})

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
}))

const getConditions = () => {
  const { positive, negative, specie_id } = condition.value
  return {
    species_id: specie_id,
    genes_positive: positive.join(','),
    genes_negative: negative.join(','),
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
    page: pagination.value.current,
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
  emits('confirm', selectedCells.value)
}

defineExpose({
  showModal,
})
</script>

<style lang="scss" scoped>

.symbol {
  &:last-child {
    span:nth-child(2) {
      display: none;
    }
  }
}

.condition-item {
  padding: 0.75rem;
  margin-bottom: 0;


  :deep(.ant-form-item-label) {
    display: flex;
    align-items: center;

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
}


.search-condition-item {
  flex: 1;
}

.highlighted {
  background: #efb041;
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
</style>
