<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center px-4 p-2">
      <a-select
        class="w-50"
        v-model:value="pathType"
        :options="options.pathType"
        placeholder="Select pathway type"
        size="small"
      ></a-select>
      <a-select
        class="w-40 ml-4"
        v-model:value="pathWay"
        :options="options.pathWay"
        size="small"
        placeholder="Select pathway"
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
import { VuePlotly } from 'vue3-plotly'
import { reactive, ref } from 'vue'

const pathType = ref(undefined)
const pathWay = ref(undefined)

const options = reactive({
  pathType: [],
  pathWay: []
})

const trace1 = {
  y: [1, 2, 3, 4, 5],
  x: ['A', 'A', 'A', 'A', 'A'],
  mode: 'markers',
  type: 'scatter',
  name: 'Team A',
  text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
  marker: { size: 12 }
}

const trace2 = {
  y: [1.5, 2.5, 3.5, 4.5, 5.5],
  x: ['B', 'B', 'B', 'B', 'B'],
  mode: 'markers',
  type: 'scatter',
  name: 'Team B',
  text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
  marker: { size: 12 }
}

const data = [trace1, trace2]

const layout = {
  title: 'Always Display the Modebar',
  autosize: true,
  height: 700,
  showlegend: true
}

const config = { responsive: true, scrollZoom: true }
</script>

<style scoped lang="scss"></style>
