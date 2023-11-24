<template>
  <div class="top">
    <div
        v-for="item in analysis"
        :key="item.id"
        class="interactive"
        @click="handleOpenCellxgene(item)"
    >
      <a-button class="action">Interactive Viewer</a-button>
    </div>
    <div v-if="umapType.length" class="group-desc">
      <div class="desc">Static UMAP</div>
      <div>
        <a-dropdown :trigger="['click']">
          <a class="type" @click.prevent>
            group by: {{ getTypeName(umapType) }}
            <CaretDownOutlined/>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="item in options.umapType" :key="item">
                <a
                    class="type selector-item"
                    @click="handleUMapTypeChange(item)"
                >
                  {{ getTypeName(item) }}
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div v-else class="group-desc"></div>
  </div>
  <div class="bottom">
    <div class="umap">
      <a-spin :spinning="loading">
        <a-empty v-if="!umapUrl"/>
        <photo-provider v-else :download-method="handleDownloadUmap">
          <photo-consumer :src="umapUrl">
            <img :src="umapUrl" class="w-full umap" alt=""/>
          </photo-consumer>
        </photo-provider>
      </a-spin>
    </div>
    <div class="umap-types"></div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getUmap, getUmapColumn } from '@/api/file.js'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import { titleCase, snakeCase } from 'text-case'
import { saveAs } from 'file-saver'

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
const umapType = ref('')
const umapUrl = ref('')
const options = reactive({
  umapType: [],
})

const getTypeName = (type) => {
  return titleCase((type || '').replace(/_+/, ' '))
}

onMounted(() => {
  handleFetchColumn().then(handleFileFetch)
})

const handleFetchColumn = async () => {
  const data = await getUmapColumn(props.fileId)
  options.umapType = data.filter((item) => {
    return !['UMAP_1', 'UMAP_2'].includes(item)
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
      const blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
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
      '_blank',
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
  background: #0081d8;
  flex-shrink: 0;
  padding-left: 0.75rem;
  gap: 1.25rem;
  border-radius: 0 0.625rem 0 0;
  overflow: hidden;

  .interactive {
    display: flex;
    align-items: center;

    .action {
      display: flex;
      align-items: center;
      height: 2.25rem;
      padding: 1rem 1.25rem;
      border-radius: 3.125rem;
      background: #00a9dd;
      border: none;
      color: #fff;
      font-size: 1rem;
      flex: none;
      font-weight: 600;
      cursor: pointer;
    }
  }

  .group-desc {
    flex: 1;

    flex-direction: column;
    display: flex;
    padding: 1rem 1.25rem;
    align-items: center;
    gap: 0.625rem;
    align-self: stretch;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    align-content: center;
    justify-content: center;

    .type {
      color: white;
      font-size: 0.875rem;
    }
  }
}

.bottom {
  background: #0081d8;
  display: flex;
  align-items: stretch;
  flex: 1;
  height: 0;
  overflow: hidden;

  .umap {
    width: 45rem;
    height: 100%;
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
