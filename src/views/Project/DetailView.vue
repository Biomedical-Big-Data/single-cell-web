<template>
  <div class="detail-page">
    <NavBar></NavBar>
    <a-spin :spinning="loading" class="min-w-full">
      <div v-if="projectDetail" class="content-container">
        <div class="project-header">
          <div class="title">
            {{ projectDetail.title }}
          </div>
          <a-typography-paragraph
            class="desc"
            :ellipsis="{ rows: 2, expandable: true, symbol: 'more' }"
            :content="projectDetail.description"
          ></a-typography-paragraph>
          <div class="tags">
            <a-tag
              v-for="item in (projectDetail.tags || '')
                .split(',')
                .filter((item) => !!item)"
              :key="item"
            >
              {{ item }}
            </a-tag>
          </div>
        </div>
        <div class="project-body">
          <div class="left">
            <UMapChart
              :analysis="analysis"
              :file-id="projectDetail.project_analysis_meta[0].umap_id"
            />
          </div>
          <div class="right">
            <a-tabs
              v-model:activeKey="activeKey"
              type="card"
              size="large"
              :tab-bar-gutter="8"
              class="h-full"
            >
              <template #leftExtra>
                <div class="fix-fill"></div>
              </template>
              <a-tab-pane
                v-if="projectDetail.project_analysis_meta[0].cell_marker_id"
                key="celltype"
                tab="Celltype Markers"
              >
                <CellTypeMarkers
                  :file-id="
                    projectDetail.project_analysis_meta[0].cell_marker_id
                  "
                />
              </a-tab-pane>
              <a-tab-pane
                v-if="!projectDetail.is_private"
                key="barplot"
                tab="Cell type distribution"
              >
                <BarChart
                  :analysis-id="projectDetail.project_analysis_meta[0].id"
                ></BarChart>
              </a-tab-pane>
              <a-tab-pane
                v-if="pathWayVisiable"
                key="score"
                tab="Score of pathway"
              >
                <PathWayChart :project="projectDetail"></PathWayChart>
              </a-tab-pane>
              <a-tab-pane key="download" tab="Download">
                <DownloadTable :project-detail="projectDetail"></DownloadTable>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
        <div class="project-footer">
          <div>
            Publication:
            {{ dayjs(projectDetail.update_at).format("YYYY-MM-DD HH:mm") }}
          </div>
          <div>
            Email:
            <span v-if="projectDetail.is_private">
              {{ projectDetail.project_user_meta.email_address }}
            </span>
            <a v-else href="mailto:CasSF_aDM.siais@shanghaitech.edu.cn">
              CasSF_aDM.siais@shanghaitech.edu.cn
            </a>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue"
import BarChart from "@/components/charts/BarChart.vue"
import PathWayChart from "@/components/charts/PathWayChart.vue"
import UMapChart from "@/components/charts/UMapChart.vue"
import CellTypeMarkers from "@/components/CellTypeMarkers.vue"
import { getProjectDetail } from "@/api/project"
import dayjs from "dayjs"
import { useRoute } from "vue-router"
import NavBar from "@/components/NavBar.vue"
import DownloadTable from "@/components/charts/DownloadTable.vue"

const route = useRoute()
// const activeKey = ref('score')
const loading = ref(true)
const activeKey = ref("celltype")
const projectDetail = ref(null)
const props = defineProps({
  id: {
    required: true,
    type: [Number, String],
  },
})

onMounted(() => {
  handleProjectDetailFetch()
})

const pathWayVisiable = computed(() => {
  const { is_private, project_analysis_meta } = projectDetail.value
  if (!is_private) {
    return true
  } else {
    return !!project_analysis_meta?.[0]?.pathway_id
  }
})

// const pathwayData = computed(() => {
//   if (projectDetail.value?.is_private) {
//     return pathWayFileData.value
//   } else {
//     return projectDetail.value?.project_analysis_meta[0]
//       ?.analysis_pathway_score_meta
//   }
// })

const analysis = computed(() => {
  const { analysis_id } = route.query
  if (analysis_id) {
    return projectDetail.value.project_analysis_meta.filter(
      (item) => +item.id === +analysis_id,
    )
  } else {
    return projectDetail.value.project_analysis_meta
  }
})

const handleProjectDetailFetch = async () => {
  try {
    loading.value = true
    const data = await getProjectDetail(props.id)
    projectDetail.value = data
    if (data.project_analysis_meta[0].cell_marker_id) {
      activeKey.value = "celltype"
    } else if (!data.is_private) {
      activeKey.value = "barplot"
    } else if (pathWayVisiable.value) {
      activeKey.value = "score"
    } else {
      activeKey.value = "download"
    }
  } finally {
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
.detail-page {
  background: #f0f2f5;
  min-height: 100vh;
}

.content-container {
  display: flex;
  padding-top: 12px;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;

  .project-header {
    display: flex;
    padding: 0.625rem 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
    align-self: stretch;

    .title {
      color: #5f5f5f;
      font-size: 1.5rem;
      font-weight: 400;
      line-height: 1.375rem; /* 91.667% */
    }

    .desc {
      color: #7e7e7e;
      font-size: 1rem;
      font-weight: 400;
    }
  }

  .project-body {
    display: flex;
    align-items: stretch;
    gap: 0.625rem;
    padding-right: 0.75rem;

    .left {
      display: flex;
      height: 40rem;
      flex-direction: column;
      align-items: stretch;
    }

    .right {
      width: 0;
      flex: 1;

      .fix-fill {
        height: 2.5rem;
        width: 0.75rem;
        border-radius: 0.625rem 0 0 0;
        background: #0081d8;
      }

      :deep(.ant-tabs-nav) {
        margin-bottom: 0 !important;

        .ant-tabs-nav-wrap {
          .ant-tabs-tab {
            height: 2.5rem;
            width: 11.625rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7e7e7e;
            background: #dfe2e8;
            border-radius: 0.625rem 0.625rem 0 0;
            border: none;

            &:first-child {
              border-radius: 0 0.625rem 0 0;
            }

            &.ant-tabs-tab-active {
              background: #0081d8;

              .ant-tabs-tab-btn {
                color: #ffffff;
              }
            }
          }
        }
      }

      :deep(.ant-tabs-content-holder) {
        padding-left: 0.75rem;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          background: #0081d8;
          width: 0.75rem;
          height: 100%;
        }
      }

      :deep(.ant-tabs-tabpane) {
        border-radius: 0 0.625rem 0 0;
        overflow: hidden;
      }
    }
  }

  .project-footer {
    display: flex;
    padding: 0.75rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;

    div {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5rem; /* 150% */
      color: #5f5f5f;
      padding: 0.5rem;
    }
  }
}
</style>
