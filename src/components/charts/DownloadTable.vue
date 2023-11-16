<template>
  <div v-if="projectDetail" class="files h-full">
    <div v-for="item in files" :key="item.id" class="file">
      <div class="info">
        <img class="icon" src="@/assets/icons/icon-file.svg" alt="" />
        <div>
          <div class="title">
            {{ item.id }}
          </div>
          <div class="type">{{ item.type }}</div>
        </div>
      </div>
      <a-button class="download" @click="handleDownloadFile(item.id)">
        Download
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { saveAs } from "file-saver"
import { getDownloadFileToken } from "@/api/file.js"
import { computed } from "vue"

const props = defineProps({
  projectDetail: {
    type: Object,
    required: true,
    default: () => null,
  },
})

const files = computed(() => {
  return [
    ...[
      {
        id: props.projectDetail?.project_analysis_meta?.[0]?.h5ad_id,
        type: "H5AD",
      },
      {
        id: props.projectDetail?.project_analysis_meta?.[0]?.umap_id,
        type: "UMap",
      },
      {
        id: props.projectDetail?.project_analysis_meta?.[0]?.cell_marker_id,
        type: "Cell Marker",
      },
      {
        id: props.projectDetail?.project_analysis_meta?.[0]?.pathway_id,
        type: "Pathway",
      },
    ].filter((item) => item.id),
    ...otherFiles.value.map((item) => ({
      id: item,
      name: "Other File",
    })),
  ]
})

const otherFiles = computed(() => {
  return props.projectDetail?.is_private
    ? props.projectDetail?.project_analysis_meta[0].other_file_ids
        .split(",")
        .filter((item) => item)
    : []
})

const handleDownloadFile = async (file_id) => {
  const data = await getDownloadFileToken(file_id)
  saveAs(
    `${
      import.meta.env.VITE_BASE_API_URL
    }/project/download/file/${file_id}?download_file_token=${
      data.download_file_token
    }`,
    file_id,
  )
}
</script>

<style scoped lang="scss">
.files {
  padding: 1.25rem;
  background: #fff;

  .file {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;

    .info {
      display: flex;
      align-items: center;

      .icon {
        width: 2.375rem;
        height: 2.375rem;
        padding: 0.2rem 0.3rem;
        margin-right: 1rem;
      }

      .title {
        color: #5f5f5f;
        text-align: center;
        font-size: 1.125rem;
        font-weight: 400;
        line-height: 1.375rem;
      }

      .type {
        margin-top: 0.35rem;
        color: #5f5f5f;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.375rem;
      }
    }

    .download {
      border: none;
      width: 7.5rem;
      padding: 0.625rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2.4375rem;
      background: rgba(0, 98, 255, 0.1);
      color: #0062ff;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.375rem; /* 137.5% */
    }
  }
}
</style>
