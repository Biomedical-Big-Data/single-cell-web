<template>
  <a-modal
    v-model:open="open"
    class="simple-modal"
    title="Search Cell Name"
    :width="900"
    :mask-closable="false"
    :ok-button-props="{
      class: 'ok-button',
      disabled: !selectedKeys.length,
    }"
    :cancel-button-props="{
      class: 'cancel-button',
    }"
    @ok="confirm"
  >
    <div class="searchbar-container">
      <a-input-search
        v-model:value="cell_name"
        class="searchbar"
        placeholder="Search"
        :loading="loading"
        size="large"
        @search="handleSearch({ keyword: $event })"
      />
    </div>
    <div v-if="!treeData.length" class="content py-4">
      <a-empty />
    </div>
    <div v-else class="flex content">
      <div class="flex-2 flex flex-col">
        <div class="p-4 overflow-y-auto">
          <a-tree
            v-if="treeData.length"
            ref="treeRef"
            v-model:selectedKeys="selectedKeys"
            :tree-data="treeData"
            :show-line="true"
            :default-expand-all="true"
            @select="handleNodeSelected"
          >
            <template
              #title="{
                title,
                data: {
                  data: { cell_number, is_exist },
                },
              }"
            >
              <div :class="{ highlighted: is_exist }">
                <Highlighter
                  highlight-class-name="highlight"
                  :search-words="keywords"
                  :text-to-highlight="title"
                  :auto-escape="false"
                />
                <span v-if="cell_number">({{ cell_number }})</span>
              </div>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="flex-1 content overflow-y-auto">
        <a-spin :spinning="markLoading">
          <div v-if="current" class="flex relative p-4">
            <div v-if="relations.length">
              <a-tag v-for="item in relations" :key="item.id" class="mr-2 mb-2">
                <a
                  target="_blank"
                  :href="getLink(item.cell_marker)"
                  class="cell-marker"
                >
                  {{ item.cell_marker }}
                </a>
              </a-tag>
            </div>
            <div v-else class="flex justify-center w-full pt-8">
              <a-empty />
            </div>
          </div>
        </a-spin>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, nextTick, ref } from "vue"
import Highlighter from "vue-highlight-words"

import { getCellTaxonomy, getTaxonomyDetail } from "@/api/cell.js"
import arrayToTree from "array-to-tree"
import _ from "lodash"

const emits = defineEmits(["confirm"])
const markLoading = ref(false)
const keywords = ref([])
const cell_name = ref("")
const open = ref(false)
const loading = ref(false)
const selectedKeys = ref([])
const treeData = ref([])
const relations = ref([])
const treeRef = ref()

const cache = ref([])

const showModal = async (cell) => {
  open.value = true
  if (cell) {
    await handleSearch({ cell_type_id: cell.cell_type_id })
    await nextTick(() => {
      const current = _.find(cache.value, { cell_type_id: cell.cell_type_id })
      if (current) {
        treeRef.value.scrollTo({ key: current.cl_id })
        selectedKeys.value = [current.cl_id]
        handleNodeSelected(selectedKeys.value)
      }
    })
  }
}

const confirm = () => {
  open.value = false

  if (selectedKeys.value.length) {
    emits("confirm", current.value)
  }
}

const current = computed(() => {
  return _.find(cache.value, { cl_id: selectedKeys.value[0] })
})

const handleSearch = async ({ keyword, cell_type_id }) => {
  try {
    loading.value = true
    treeData.value = []
    const data = await getCellTaxonomy({
      cell_standard: keyword,
      cell_type_id,
    })
    cache.value = data
    treeData.value = arrayToTree(
      data.map(({ cl_id, cl_pid, name, cell_number, is_exist }) => ({
        title: name,
        data: { is_exist, cell_number },
        key: cl_id,
        pid: cl_pid,
      })),
      {
        parentProperty: "pid",
        customID: "key",
      },
    )
    keywords.value = [keyword]
  } finally {
    loading.value = false
  }
}

const handleNodeSelected = async (event) => {
  if (event[0]) {
    try {
      markLoading.value = true
      const data = await getTaxonomyDetail(event[0])
      relations.value = _.uniqBy(data, "cell_marker")
    } finally {
      markLoading.value = false
    }
  }
}

const getLink = (cell_marker) => {
  return `https://www.ncbi.nlm.nih.gov/nuccore/${cell_marker}`
}

defineExpose({
  showModal,
})
</script>

<style scoped lang="scss">
.relative {
  flex-wrap: wrap;
}

.content {
  max-height: 50vh;
  background: #ffffff;
  border-radius: 1.375rem 1.375rem 0 0;
  overflow: hidden;
}

.cell-marker {
  color: rgba(0, 0, 0, 0.85);
  font-size: 0.875rem;
  font-weight: 400;
  padding: 0.25rem 0.5rem;
}

.searchbar-container {
  padding: 0 1.5rem 1.5rem 1.5rem;

  .searchbar {
    border-radius: 1.375rem;
    overflow: hidden;
  }
}

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
}
</style>
<style>
.highlight {
  background: #ffc046;
  padding: 0;
}

.highlighted {
  background: rgba(95, 255, 70, 0.2);
  padding: 0;
}
</style>
