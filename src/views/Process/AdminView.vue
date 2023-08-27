<template>
  <div class="p-5">
    <div class="p-3 bg-white">
      <a-table
        :columns="columns"
        :row-key="(record) => record.login.uuid"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePagination } from 'vue-request'
import axios from 'axios'

const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    sorter: true
  },
  {
    title: '目标IP端口',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' }
    ]
  },
  {
    title: '持续时间',
    dataIndex: 'email'
  },
  {
    title: '持续时间',
    dataIndex: 'email'
  }
]

const queryData = (params) => {
  return axios.get('https://randomuser.me/api?noinfo', { params })
}

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize
} = usePagination(queryData, {
  formatResult: (res) => res.data.results,
  pagination: {
    currentKey: 'page',
    pageSizeKey: 'results'
  }
})

const pagination = computed(() => ({
  total: 200,
  current: current.value,
  pageSize: pageSize.value,
  size: 'small'
}))

const handleTableChange = (pag, filters, sorter) => {
  run({
    results: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters
  })
}
</script>

<style scoped lang="scss">
.condition-item {
  width: 100px !important;
}

.condition-item-lg {
  width: 130px !important;
}
</style>
