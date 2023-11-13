<template>
  <a-modal
      v-model:open="open"
      title="Search Cell Name By Gene"
      :width="900"
      :mask-closable="false"
      @ok="confirm"
  >
    <div class="py-6">
      <a-form layout="inline">
        <a-form-item label="Positive">
          <a-input v-model:value="condition.positive" placeholder="Positive">
          </a-input>
        </a-form-item>
        <a-form-item label="Negative">
          <a-input v-model:value="condition.negative" placeholder="Negative">
          </a-input>
        </a-form-item>
        <a-form-item label="Rate then">
          <a-input v-model:value="condition.rate" placeholder="Rate">
          </a-input>
        </a-form-item>
      </a-form>
    </div>
    <div class="mt-6">
      <div v-if="selectedCells.length">
        <a-tag v-for="item in selectedCells" :key="item.id" closable>{{ item.name}}</a-tag>
      </div>
      <div class="text-center">
        暂无选择
      </div>
    </div>
    <div class="mt-6">
      <a-table
          :columns="columns"
          :row-key="record => record.id"
          :data-source="list"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange">
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>

import { computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import { getCellProjectList } from '@/api/project.js'

const emits = defineEmits(['confirm'])
const selectedCells = ref([])
const open = ref(false)
const condition = ref({
  positive: [],
  negative: [],
  rate: ''
})

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    slots: { customRender: 'name' },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    slots: { customRender: 'action' },
  },
]

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
    currentKey: 'page',
    pageSizeKey: 'page_size',
    totalKey: 'total',
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

const getConditions = () => {
  return {}
}

const handleTableChange = (pag, filters, sorter) => {
  run({
    page_size: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field?.join('.'),
    sortOrder: sorter.order,
    ...getConditions(),
    ...filters,
  })
}

const showModal = () => {
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

</style>
