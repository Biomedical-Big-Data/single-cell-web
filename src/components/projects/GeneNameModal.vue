<template>
  <a-modal
    v-model:open="open"
    title="Search Cell Name By Gene"
    :width="1200"
    :mask-closable="false"
    @ok="confirm"
  >
    <div class="py-6">
      <a-form layout="inline">
        <a-form-item
          label="Positive"
          name="positive"
          class="search-condition-item"
        >
          <a-select
            v-model:value="condition.positive"
            mode="tags"
            :token-separators="[',']"
            placeholder="Positive"
            allow-clear
          ></a-select>
        </a-form-item>
        <a-form-item
          label="Negative"
          name="negative"
          class="search-condition-item"
        >
          <a-select
            v-model:value="condition.negative"
            mode="tags"
            :token-separators="[',']"
            placeholder="Negative"
            allow-clear
          ></a-select>
        </a-form-item>
        <a-form-item>
          <a-button :loading="loading" type="primary" @click="handleSearch">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="mt-6">
      <div v-if="selectedCells.length">
        <a-tag
          v-for="item in selectedCells"
          :key="item.cell_type_id"
          closable
          @close="handleRemoveSelectCell(item)"
        >
          {{ item.cell_type_name }}
        </a-tag>
      </div>
      <div v-else class="text-center">暂无选择</div>
    </div>
    <div class="mt-6">
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
                :class="{
                  highlighted: record['intersection_list'].includes(item),
                }"
              >
                {{ item }},
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
import { computed, ref } from "vue"
import { usePagination } from "vue-request"
import { getGeneCellTaxonomy } from "@/api/cell.js"
import _ from "lodash"

const emits = defineEmits(["confirm"])
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
    width: 100,
  },
  {
    title: "Name",
    dataIndex: "cell_type_name",
  },
  {
    title: "Marker Gene Symbol",
    dataIndex: "marker_gene_symbol",
    width: 600,
  },
  {
    title: "Score",
    dataIndex: "score",
    width: 50,
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
    sortField: sorter.field?.join("."),
    sortOrder: sorter.order,
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
  emits("confirm", selectedCells.value)
}

defineExpose({
  showModal,
})
</script>

<style lang="scss" scoped>
.search-condition-item {
  flex: 1;
}

.highlighted {
  background: #efb041;
}
</style>
