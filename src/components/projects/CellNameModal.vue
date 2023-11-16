<template>
  <a-modal
    v-model:open="open"
    title="Search Cell Name"
    :width="900"
    :mask-closable="false"
    @ok="confirm"
  >
    <div class="p-4 flex">
      <div class="flex-1 content flex flex-col">
        <div>
          <a-input-search
            placeholder="Search"
            :loading="loading"
            @search="handleSearch"
          />
        </div>
        <div class="mt-4 flex-1 overflow-y-auto">
          <a-tree
            v-if="treeData.length"
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
      <div class="flex-1 ml-3 content overflow-y-auto">
        <div v-if="current" class="flex relative">
          <a
            v-for="item in relations"
            :key="item.id"
            class="p-1"
            target="_blank"
            :href="getLink(item.cell_marker)"
          >
            {{ item.cell_marker }}
          </a>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref } from "vue"
import Highlighter from "vue-highlight-words"

import { getCellTaxonomy, getTaxonomyDetail } from "@/api/cell.js"
import arrayToTree from "array-to-tree"
import _ from "lodash"

const emits = defineEmits(["confirm"])

const keywords = ref([])
const open = ref(false)
const loading = ref(false)
const selectedKeys = ref([])
const treeData = ref([])
const relations = ref([])

const cache = ref([])

const showModal = () => {
  open.value = true
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

const handleSearch = async (keyword) => {
  try {
    loading.value = true
    treeData.value = []
    const data = await getCellTaxonomy(keyword)
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
  const data = await getTaxonomyDetail(event[0])
  relations.value = _.uniqBy(data, "cell_marker")
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
  max-height: 60vh;
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
