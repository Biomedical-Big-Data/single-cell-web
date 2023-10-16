<template>
  <div class="h-full flex flex-col">
    <a-spin :spinning="loading">
      <div class="flex items-center px-4 p-2">
        <span class="mr-4 font text-sm">Static UMAP group by</span>
        <a-select
            class="w-28"
            v-model:value="umapType"
            @change="handleFileFetch"
            :options="options.umapType"
            size="small"
        ></a-select>
      </div>
      <div class="flex-1 ">
        <img :src="umapUrl" v-show="!!umapUrl" class="w-full" alt="">
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getUmap } from '@/api/file.js'

const props = defineProps({
  fileId: {
    type: String,
    required: true,
  },
})

const loading = ref(false)
const umapType = ref('CellType')
const umapUrl = ref('')
const options = reactive({
  umapType: [
    { label: 'Cell Type', value: 'CellType' },
    { label: 'Sample', value: 'Sample' },
    { label: 'Sex', value: 'Sex' },
    { label: 'Treatment', value: 'Treatment' },
  ],
})

onMounted(() => {
  handleFileFetch()
})

const handleFileFetch = async () => {
  const response = await getUmap(props.fileId, umapType.value)
  const arrayBufferView = new Uint8Array(response)
  const blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
  const urlCreator = window.URL || window.webkitURL
  umapUrl.value = urlCreator.createObjectURL(blob)

}

</script>

<style scoped lang="scss"></style>
