<template>
  <a-table
    :columns="columns"
    :data-source="list"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #title>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="mr-4">Project: {{ count.project }}</span>
          <span class="mr-4">Samples: {{ count.sample }}</span>
          <span>Cells: {{ count.cell }}</span>
        </div>
        <div>
          <a-button>
            <template #icon>
              <SettingOutlined />
            </template>
            Column Setting
          </a-button>
          <a-button class="ml-4">
            <template #icon>
              <DownloadOutlined />
            </template>
            Download
          </a-button>
        </div>
      </div>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        {{ getTrueIndex(index) }}
      </template>
      <template v-if="column.dataIndex === 'projects'">
        <a-button
          shape="circle"
          :icon="h(OrderedListOutlined)"
          @click="handleProjectsModalOpen(record)"
        />
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:open="open"
    title="Relative Projects"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <div class="py-5">
      <a-table
        :columns="projectColumns"
        :data-source="projects"
        :pagination="false"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.title === 'Tags'">
            <a-tag
              v-for="item in (text || '').split(',').filter((item) => !!item)"
              :key="item"
            >
              {{ item }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button
              shape="circle"
              :icon="h(EyeOutlined)"
              @click="handleToProject(record)"
            />
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>
import { usePagination } from "vue-request";
import { getSampleProjectList } from "@/api/project.js";
import { computed, reactive, ref, h } from "vue";
import {
  SettingOutlined,
  DownloadOutlined,
  OrderedListOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const condition = ref({});
const open = ref(false);
const columns = [
  {
    title: "Result",
    dataIndex: "index",
    align: "center",
    width: "20px",
  },
  {
    title: "Projects",
    dataIndex: "projects",
    width: 80,
    align: "center",
  },
  {
    title: "Disease",
    dataIndex: "disease",
  },
  {
    title: "Platform",
    dataIndex: "sequencing_instrument_manufacturer_model",
  },
  {
    title: "Species",
    dataIndex: ["biosample_species_meta", "species"],
  },
  {
    title: "Organ",
    dataIndex: "organ",
  },

  {
    title: "Sex",
    dataIndex: ["biosample_donor_meta", "sex"],
  },
];
const projectColumns = [
  {
    title: "Title",
    dataIndex: ["project_biosample_project_meta", "title"],
    width: 200,
  },
  {
    title: "Description",
    dataIndex: ["project_biosample_project_meta", "description"],
  },
  {
    title: "Tags",
    dataIndex: ["project_biosample_project_meta", "tags"],
    width: 300,
  },
  {
    title: "",
    dataIndex: "action",
    align: "center",
    width: 100,
  },
];
const count = reactive({
  project: 0,
  sample: 0,
  cell: 0,
});
const projects = ref([]);
const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
} = usePagination(getSampleProjectList, {
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
  },
});

const list = computed(() => {
  return dataSource?.value?.project_list || [];
});

const pagination = computed(() => ({
  total: 0,
  current: current.value,
  pageSize: pageSize.value,
  size: "small",
}));

const getTrueIndex = (index) => {
  return (current.value - 1) * pageSize.value + index + 1;
};

const handleTableChange = (pag, filters, sorter) => {
  run({
    results: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...getConditions(),
    ...filters,
  });
};

const getConditions = () => {
  const {
    species,
    organ,
    external_sample_accession,
    disease,
    development_stage,
  } = condition.value;
  const result = {};
  if (species) {
    result.species_id = species;
  }
  if (organ) {
    result.organ = organ;
  }
  return {
    ...(species ? { species_id: species } : {}),
    ...(organ ? { organ } : {}),
    ...(external_sample_accession ? { external_sample_accession } : {}),
    ...(disease ? { disease } : {}),
    ...(development_stage ? { development_stage } : {}),
  };
};

const handleSearch = (conditions) => {
  condition.value = conditions;
  run({
    page: current,
    page_size: pageSize,
    ...getConditions(),
  });
};

const handleProjectsModalOpen = (records) => {
  projects.value = records.biosample_project_biosample_meta;
  open.value = true;
};

const handleToProject = (record) => {
  const routeData = router.resolve({
    name: "project_detail",
    params: {
      id: record.project_id,
    },
  });
  window.open(routeData.href, "_blank");
};

defineExpose({
  handleSearch,
});
</script>

<style scoped lang="scss"></style>
