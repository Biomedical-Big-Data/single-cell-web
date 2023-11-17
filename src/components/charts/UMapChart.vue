<template>
  <div class="bottom">
    <div class="umap">
      <a-spin :spinning="loading">
        <img v-show="!!umapUrl" :src="umapUrl" class="w-full umap" alt="" />
      </a-spin>
    </div>
    <div class="umap-types">
      <div
        v-for="item in options.umapType"
        :key="item"
        class="type"
        :class="{
          active: item === umapType,
        }"
        @click="handleUMapTypeChange(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
  <div v-if="false" class="h-full flex flex-col">
    <a-spin :spinning="loading">
      <div class="flex items-center px-4 p-2">
        <span class="mr-4 font text-sm">Static UMAP group by</span>
        <a-select
          v-model:value="umapType"
          class="w-40"
          :options="options.umapType"
          @change="handleFileFetch"
        ></a-select>
      </div>
      <div class="flex-1">
        <img v-show="!!umapUrl" :src="umapUrl" class="w-full umap" alt="" />
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { getUmap, getUmapColumn } from "@/api/file.js"

const props = defineProps({
  fileId: {
    type: String,
    required: true,
  },
})

const loading = ref(false)
const umapType = ref("")
const umapUrl = ref("")
const options = reactive({
  umapType: [],
})

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
    const response = await getUmap(props.fileId, umapType.value)
    const arrayBufferView = new Uint8Array(response)
    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
    const urlCreator = window.URL || window.webkitURL
    umapUrl.value = urlCreator.createObjectURL(blob)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
img {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  padding: 0 !important;
}

.bottom {
  background: #0081d8;
  display: flex;
  align-items: stretch;

  .umap {
    width: 30.75rem;
    height: 36.75rem;
    padding: 1.5rem;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
  }

  .umap-types {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .type {
      color: #fff;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 400;
      text-transform: capitalize;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
      cursor: pointer;

      &.active {
        background: #ff7555;
      }
    }
  }
}
</style>
