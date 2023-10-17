<template>
  <div v-if="projectDetail" class="project-detail-container">
    <div class="py-4 px-6 bg-white">
      <div class="summary">
        {{ projectDetail.title }}
      </div>
      <div class="mt-4">{{ projectDetail.description }}</div>
      <div class="mt-4">
        <a-tag
          v-for="item in (projectDetail.tags || '')
            .split(',')
            .filter((item) => !!item)"
          :key="item"
        >
          {{ item }}
        </a-tag>
      </div>
      <div class="mt-4">
        <a-button
          class="mr-3"
          v-for="item in analysis"
          type="primary"
          @click="handleOpenCellxgene(item)"
          :key="item.id"
        >
          {{ item.h5ad_id }} viewer
        </a-button>
      </div>
    </div>
    <div class="mt-4 px-4 flex-1">
      <div class="h-full" v-if="projectDetail">
        <a-tabs
          v-model:activeKey="activeKey"
          tab-position="left"
          class="py-4 bg-white h-full"
        >
          <a-tab-pane key="umap" tab="UMap">
            <UMapChart
              :file-id="projectDetail.project_analysis_meta[0].umap_id"
            />
          </a-tab-pane>
          <!--          <a-tab-pane key="similarity" tab="Cell cell similarity">-->
          <!--            <div>-->
          <!--              <SimilarityChart></SimilarityChart>-->
          <!--            </div>-->
          <!--          </a-tab-pane>-->
          <a-tab-pane
            key="barplot"
            tab="Barplot of cell number in each type"
            class="abc"
          >
            <BarChart
              :analysis-id="projectDetail.project_analysis_meta[0].id"
            ></BarChart>
          </a-tab-pane>
          <a-tab-pane key="celltype" tab="Celltype Markers">
            <CellTypeMarkers
              :file-id="projectDetail.project_analysis_meta[0].cell_marker_id"
            />
          </a-tab-pane>
          <a-tab-pane key="score" tab="Score of pathway">
            <PathWayChart
              :pathways="
                projectDetail.project_analysis_meta[0]
                  .analysis_pathway_score_meta
              "
            ></PathWayChart>
          </a-tab-pane>
          <a-tab-pane key="download" tab="Download">
            <a-button
              class="mr-4"
              type="primary"
              v-if="projectDetail?.project_analysis_meta?.[0]?.h5ad_id"
              @click="
                handleDownloadFile(
                  projectDetail.project_analysis_meta[0].h5ad_id,
                )
              "
            >
              <template #icon>
                <CloudDownloadOutlined />
              </template>
              H5AD File
            </a-button>
            <a-button
              class="mr-4"
              type="primary"
              v-if="projectDetail?.project_analysis_meta?.[0]?.umap_id"
              @click="
                handleDownloadFile(
                  projectDetail.project_analysis_meta[0].umap_id,
                )
              "
            >
              <template #icon>
                <CloudDownloadOutlined />
              </template>
              Umap File
            </a-button>
            <a-button
              class="mr-4"
              type="primary"
              v-if="projectDetail?.project_analysis_meta?.[0]?.cell_marker_id"
              @click="
                handleDownloadFile(
                  projectDetail.project_analysis_meta[0].cell_marker_id,
                )
              "
            >
              <template #icon>
                <CloudDownloadOutlined />
              </template>
              Cell Marker File
            </a-button>
          </a-tab-pane>
          <!--          <a-tab-pane key="interactive" tab="interactive view">interactive view</a-tab-pane>-->
        </a-tabs>
      </div>
    </div>

    <div class="information mt-4 px-4">
      <div class="bg-white p-5 text-sm">
        <div>
          Publication:
          {{ dayjs(projectDetail.update_at).format("YYYY-MM-DD HH:mm") }}
        </div>
        <div class="mt-4">
          Email: {{ projectDetail.project_user_meta.email_address }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import BarChart from "@/components/charts/BarChart.vue";
// import SimilarityChart from '@/components/charts/SimilarityChart.vue'
import PathWayChart from "@/components/charts/PathWayChart.vue";
import UMapChart from "@/components/charts/UMapChart.vue";
import CellTypeMarkers from "@/components/CellTypeMarkers.vue";
import { getProjectDetail } from "@/api/project";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { CloudDownloadOutlined } from "@ant-design/icons-vue";

const route = useRoute();
// const activeKey = ref('score')
const activeKey = ref("umap");
const projectDetail = ref(null);
const props = defineProps({
  id: {
    required: true,
  },
});

onMounted(() => {
  handleProjectDetailFetch();
});

const analysis = computed(() => {
  const { analysis_id } = route.query;
  if (analysis_id) {
    return projectDetail.value.project_analysis_meta.filter(
      (item) => +item.id === +analysis_id,
    );
  } else {
    return projectDetail.value.project_analysis_meta;
  }
});

const handleProjectDetailFetch = async () => {
  const data = await getProjectDetail(props.id);
  projectDetail.value = data;
};

const handleOpenCellxgene = (record) => {
  window.open(
    `${import.meta.env.VITE_BASE_API_URL}/project/view/${record.id}`,
    "_blank",
  );
};

const handleDownloadFile = (file_id) => {
  window.open(
    `${import.meta.env.VITE_BASE_API_URL}/project/view/file/${file_id}`,
    "_blank",
  );
};
</script>
<style scoped lang="scss">
.summary {
  color: var(--character-title-85, rgba(0, 0, 0, 0.85));
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.project-detail-container {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

:deep(.ant-tabs-content) {
  height: 100%;
}
</style>
