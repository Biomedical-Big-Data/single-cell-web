<template>
  <a-modal
    v-model:open="open"
    title="Search Cell Name"
    @ok="confirm"
    :width="700"
  >
    <div class="p-4">
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
      <div class="mt-4" v-if="current">
        {{ current.name }} {{ current.cl_id }}
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref } from "vue";
import { getCellTaxonomy } from "@/api/cell.js";
import arrayToTree from "array-to-tree";
import _ from "lodash";

const emits = defineEmits(["confirm"]);

const open = ref(false);
const selectedKeys = ref([]);
const treeData = ref([]);

const cache = ref([]);

const showModal = () => {
  open.value = true;
};

const confirm = () => {
  open.value = false;

  if (selectedKeys.value.length) {
    emits("confirm", current.value);
  }
};

const current = computed(() => {
  console.log(current);
  return _.find(cache.value, { cl_id: selectedKeys.value[0] });
});

const handleSearch = async (keyword) => {
  const data = await getCellTaxonomy(keyword);
  cache.value = data;
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
  );
};

const handleNodeSelected = (event) => {
  console.log(event);
};

defineExpose({
  showModal,
});
</script>

<style scoped lang="scss"></style>
