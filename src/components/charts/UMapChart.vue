<template>
  <div class="h-full flex flex-col">
    <a-spin :spinning="loading">
      <div class="flex items-center px-4 p-2">
        <span class="mr-4 font text-sm">Static UMAP group by</span>
        <a-select
          v-model:value="umapType"
          class="w-28"
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
import { getUmap } from "@/api/file.js"

const props = defineProps({
  fileId: {
    type: String,
    required: true,
  },
})

const loading = ref(false)
const umapType = ref("CellType")
const umapUrl = ref("")
const options = reactive({
  umapType: [
    { label: "Cell Type", value: "CellType" },
    { label: "Sample", value: "Sample" },
    { label: "Sex", value: "Sex" },
    { label: "Treatment", value: "Treatment" },
  ],
})

onMounted(() => {
  handleFileFetch()
})

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
