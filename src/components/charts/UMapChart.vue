<template>
  <div class="h-full flex flex-col">
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
  options.umapType = data
    .filter((item) => {
      return !["UMAP_1", "UMAP_2"].includes(item)
    })
    .map((item) => {
      return {
        label: item,
        value: item,
      }
    })
  if (data.length) {
    umapType.value = data[0]
  }
}

const handleFileFetch = async () => {
  const response = await getUmap(props.fileId, umapType.value)
  const arrayBufferView = new Uint8Array(response)
  const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
  const urlCreator = window.URL || window.webkitURL
  umapUrl.value = urlCreator.createObjectURL(blob)
}
</script>

<style scoped lang="scss">
.umap {
  max-width: 900px;
}
</style>
