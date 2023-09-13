<template>
  <div class="h-full flex flex-col">
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
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { trace1, trace2, trace3 } from '@/data/umap.js'
import { VuePlotly } from 'vue3-plotly'

const umapType = ref('cell_type')

const layout = {
  title: 'UMAP',
  xaxis: { title: 'umap' },
  yaxis: { title: 'umap' },
  autosize: true,
  height: 700,
  hovermode: 'closest',
  showlegend: true
}

const config = { responsive: true, scrollZoom: true }

const data = ref([trace1, trace2, trace3])

const options = reactive({
  umapType: [
    { label: 'Cell Type', value: 'cell_type' },
    { label: 'Sample', value: 'sample' },
    { label: 'Sex', value: 'sex' },
    { label: 'Treatment', value: 'treatment' }
  ]
})
</script>

<style scoped lang="scss"></style>
