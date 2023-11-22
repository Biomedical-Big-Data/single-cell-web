<template>
  <div class="top">
    <div class="fill" />
    <a
      v-for="item in analysis"
      :key="item.id"
      class="interactive"
      @click="handleOpenCellxgene(item)"
    >
      Interactive Viewer
    </a>
    <div v-if="umapType.length" class="group-desc">
      Static UMAP group by
      <a-dropdown :trigger="['click']">
        <a class="type" @click.prevent>
          {{ getTypeName(umapType) }}
          <CaretDownOutlined />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="item in options.umapType" :key="item">
              <a class="type selector-item" @click="handleUMapTypeChange(item)">
                {{ getTypeName(item) }}
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div v-else class="group-desc"></div>
  </div>
  <div class="bottom">
    <div class="umap">
      <a-spin :spinning="loading">
        <a-empty v-if="!umapUrl" />
        <photo-provider v-else :download-method="handleDownloadUmap">
          <photo-consumer :src="umapUrl">
            <img :src="umapUrl" class="w-full umap" alt="" />
          </photo-consumer>
        </photo-provider>
      </a-spin>
    </div>
    <div class="umap-types"></div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { getUmap, getUmapColumn } from "@/api/file.js"
import { CaretDownOutlined } from "@ant-design/icons-vue"
import { titleCase, snakeCase } from "text-case"
import { saveAs } from "file-saver"

const props = defineProps({
  fileId: {
    type: String,
    required: true,
  },
  analysis: {
    type: Array,
    default: () => [],
  },
})

const loading = ref(false)
const umapType = ref("")
const umapUrl = ref("")
const options = reactive({
  umapType: [],
})

const getTypeName = (type) => {
  return titleCase((type || "").replace(/_+/, " "))
}

onMounted(() => {
  handleFetchColumn().then(handleFileFetch)
})

const handleFetchColumn = async () => {
  const data = await getUmapColumn(props.fileId)
  options.umapType = data.filter((item) => {
    return !["UMAP_1", "UMAP_2"].includes(item)
  })
  if (options.umapType.length) {
    umapType.value = options.umapType[0]
  }
}

const handleUMapTypeChange = (type) => {
  if (type !== umapType.value) {
    umapType.value = type
    handleFileFetch()
  }
}

const handleFileFetch = async () => {
  try {
    loading.value = true
    if (umapType.value) {
      const response = await getUmap(props.fileId, umapType.value)
      const arrayBufferView = new Uint8Array(response)
      const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
      const urlCreator = window.URL || window.webkitURL
      umapUrl.value = urlCreator.createObjectURL(blob)
    }
  } finally {
    loading.value = false
  }
}

const handleOpenCellxgene = (record) => {
  window.open(
    `${import.meta.env.VITE_BASE_API_URL}/project/view/${record.id}`,
    "_blank",
  )
}

const handleDownloadUmap = (item) => {
  saveAs(item.src, `umap_by_${snakeCase(umapType.value)}.jpg`)
}
</script>

<style scoped lang="scss">
img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  padding: 0 !important;
}

.top {
  display: flex;
  height: 4rem;
  align-items: stretch;
  flex-shrink: 0;
  gap: 0.38rem;
  border-radius: 0 0.625rem 0 0;
  overflow: hidden;

  .fill {
    background: #0081d8;
    width: 1.625rem;
  }

  .interactive {
    display: flex;
    padding: 0 1.25rem;
    align-items: center;
    background: #00a9dd;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }

  .group-desc {
    flex: 1;
    background: #0081d8;
    display: flex;
    padding: 1rem 1.25rem;
    justify-content: flex-end;
    align-items: center;
    gap: 0.625rem;
    align-self: stretch;
    color: #fff;
    font-size: 1.25rem;
    font-weight: 500;

    .type {
      color: white;
    }
  }
}

.bottom {
  background: #0081d8;
  display: flex;
  align-items: stretch;

  .umap {
    width: 45rem;
    height: 36.75rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
  }

  .umap-types {
    display: flex;
    width: 0.75rem;
  }
}
</style>
