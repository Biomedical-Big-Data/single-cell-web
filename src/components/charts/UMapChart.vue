<template>
  <div class="h-full flex flex-col">
    <a-spin :spinning="loading">
      <div class="flex items-center px-4 p-2">
        <span class="mr-4 font text-sm">Static UMAP group by</span>
        <a-select
          class="w-28"
          v-model:value="umapType"
          :options="options.umapType"
          size="small"
        ></a-select>
      </div>
      <div class="flex-1">
        <VuePlotly
          :data="data"
          :layout="layout"
          :display-mode-bar="false"
          :config="config"
        ></VuePlotly>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import _ from 'lodash'
import { VuePlotly } from 'vue3-plotly'
import { getFile } from '@/api/file.js'
import * as csv from 'csvtojson'

const props = defineProps({
  fileId: {
    type: String,
    default: 'ef75abf11365465f9b4ad1ca3ea5c63a.csv'
  }
})

const loading = ref(false)
const umapData = ref([])
const umapType = ref('CellType')

const layout = {
  title: 'UMAP',
  xaxis: { title: 'UMAP_1' },
  yaxis: { title: 'UMAP_2' },
  autosize: true,
  height: 700,
  hovermode: 'closest',
  showlegend: true
}

const config = { responsive: true, scrollZoom: true }

const data = computed(() => {
  return _.chain(umapData.value)
    .groupBy(umapType.value)
    .toPairs()
    .map(([name, values]) => {
      return {
        uid: '9ed6f6c9-57ad-4869-8985-699676597242',
        mode: 'markers',
        name,
        type: 'scatter',
        x: _.map(values, 'UMAP_1'),
        y: _.map(values, 'UMAP_2'),
        marker: {
          line: { width: 0.5 },
          size: 8,
          opacity: 0.8
        }
      }
    })
    .value()
})

const options = reactive({
  umapType: [
    { label: 'Cell Type', value: 'CellType' },
    { label: 'Sample', value: 'Sample' },
    { label: 'Sex', value: 'Sex' },
    { label: 'Treatment', value: 'Treatment' }
  ]
})

onMounted(() => {
  handleFileFetch()
})

const handleFileFetch = async () => {
  try {
    loading.value = true
    const data = await getFile(props.fileId)
    umapData.value = await csv({ output: 'json' }).fromString(data)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
