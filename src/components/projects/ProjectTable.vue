<template>
  <a-table
      class="h-full simple-table"
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
      :loading="loading"
      :scroll="tableScroll"
      :bordered="true"
      @change="handleTableChange"
      @resize-column="handleResizeColumn"
  >
    <template #bodyCell="{ column, index, record, text }">
      <template v-if="column.dataIndex === 'index'">
        {{ getTrueIndex(index) }}
      </template>
      <template
          v-else-if="joinTableIndex(column.dataIndex) === 'analysis_meta.id'"
      >
        A{{ _.padStart(text, 6, '0') }}
        <br/>
        <span class="link" @click="handleToProject(record)">view</span>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { usePagination } from 'vue-request'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import { joinTableIndex } from '@/utils/common.js'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  conditions: {
    type: Object,
    required: true,
  },
  resultKey: {
    type: String,
    required: false,
    default: 'project_list',
  },
  search: {
    type: Function,
    required: true,
  },
})

const router = useRouter()
const tableHeight = ref(0)

let tableHeaderElem

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const cr = entry.contentRect
    tableHeight.value = cr.height
  }
})

const tableScroll = computed(() => {
  return {
    x: _.sumBy(props.columns, (item) => item.width),
    y: `calc(100vh - ${230 + tableHeight.value}px)`,
  }
})

const getSearchList = (params) => {
  return props.search(params)
}

const {
  data: dataSource,
  run,
  total,
  loading,
  current,
  pageSize,
} = usePagination(getSearchList, {
  manual: true,
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'page_size',
    totalKey: 'total',
  },
})

const list = computed(() => {
  return dataSource.value?.[props.resultKey] || []
})

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  position: ['bottomCenter'],
  showSizeChanger: false,
}))

onMounted(() => {
  tableHeaderElem = document.querySelector('.simple-table .ant-table-thead')
  resizeObserver.observe(tableHeaderElem)
})

onUnmounted(() => {
  resizeObserver.unobserve(tableHeaderElem)
})

const getTrueIndex = (index) => {
  return (current.value - 1) * pageSize.value + index + 1
}

const handleTableChange = (pag, filters, sorter) => {
  run({
    page_size: pag?.pageSize,
    page: pag?.current,
    order_by: sorter.field?.join('.'),
    asc: sorter.order ? sorter.order === 'ascend' : null,
    ...props.conditions,
    ...filters,
  })
}

const handleReset = () => {
  dataSource.value = {
    [props.resultKey]: [],
  }
}

const handleSearch = () => {
  run({
    page: 1,
    page_size: pagination.value.pageSize,
    ...props.conditions,
  })
}

const handleToProject = (record) => {
  const routeData = router.resolve({
    name: 'project_detail',
    params: {
      id: record.project_meta.id,
    },
    query: {
      analysis_id: record.analysis_meta.id,
    },
  })
  window.open(routeData.href, '_blank')
}

const handleResizeColumn = (w, col) => {
  col.width = w
}

defineExpose({
  handleSearch,
  handleReset,
})
</script>

<style scoped lang="scss">
.table-column-setting {
  max-height: 75vh;
}
</style>
