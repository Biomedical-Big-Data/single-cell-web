<template>
  <a-modal v-model:open="open" title="Search Cell Name" @ok="confirm">
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
      <div class="mt-4">
        {{ selectedKeys }}
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from "vue";
import { getCellTaxonomy } from "@/api/cell.js";

const emits = defineEmits(["confirm"]);

const open = ref(true);
const selectedKeys = ref([]);
const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          { title: "leaf", key: "0-0-0-0" },
          {
            key: "0-0-0-1",
          },
          { title: "leaf", key: "0-0-0-2" },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [{ title: "leaf", key: "0-0-1-0" }],
      },
      {
        title: "parent 1-2",
        key: "0-0-2",
        children: [
          { title: "leaf 1", key: "0-0-2-0" },
          {
            title: "leaf 2",
            key: "0-0-2-1",
          },
        ],
      },
    ],
  },
  {
    title: "parent 2",
    key: "0-1",
    children: [
      {
        title: "parent 2-0",
        key: "0-1-0",
        children: [
          { title: "leaf", key: "0-1-0-0" },
          { title: "leaf", key: "0-1-0-1" },
        ],
      },
    ],
  },
];

const showModal = () => {
  open.value = true;
};

const confirm = () => {
  open.value = false;
  emits("confirm");
};

const handleSearch = async (keyword) => {
  console.log(keyword);
  const data = await getCellTaxonomy(keyword);
  console.log(data);
};

const handleNodeSelected = (event) => {
  console.log(event);
};

defineExpose({
  showModal,
});
</script>

<style scoped lang="scss"></style>
