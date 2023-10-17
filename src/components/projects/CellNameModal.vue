<template>
  <a-modal
    v-model:open="open"
    title="Search Cell Name"
    @ok="confirm"
    :width="900"
    :mask-closable="false"
  >
    <div class="p-4 flex">
      <div class="flex-1">
        <div>
          <a-input-search placeholder="Search" @search="handleSearch" />
        </div>
        <div class="mt-4">
          <a-tree
            v-model:selectedKeys="selectedKeys"
            :tree-data="treeData"
            :show-line="true"
            @select="handleNodeSelected"
          ></a-tree>
        </div>
      </div>
      <div class="flex-1 ml-3">
        <div v-if="current" class="flex relative">
          <a
            class="p-1"
            target="_blank"
            :href="getLink(item.cell_marker)"
            v-for="item in relations"
            :key="item.id"
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
import { getCellTaxonomy, getTaxonomyDetail } from "@/api/cell.js"
import arrayToTree from "array-to-tree"
import _ from "lodash"

const emits = defineEmits(["confirm"])

const open = ref(false)
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
  const data = await getCellTaxonomy(keyword)
  cache.value = data
  treeData.value = arrayToTree(
    data.map(({ cl_id, cl_pid, name }) => ({
      title: name,
      key: cl_id,
      pid: cl_pid,
    })),
    {
      parentProperty: "pid",
      customID: "key",
    },
  )
}

const handleNodeSelected = async (event) => {
  relations.value = await getTaxonomyDetail(event[0])
}

const getLink = (cell_marker) => {
  return `https://www.immunesinglecell.org/genepage/${cell_marker}`
}

defineExpose({
  showModal,
})
</script>

<style scoped lang="scss">
.relative {
  flex-wrap: wrap;
}
</style>
