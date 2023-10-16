<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center px-4 p-2">
      <a-select
        class="w-50"
        v-model:value="pathType"
        :options="pathTypeList"
        placeholder="Select pathway type"
        size="small"
        @change="handlePathTypeChange"
      ></a-select>
      <a-select
        class="w-40 ml-4"
        v-model:value="pathWay"
        :options="pathWayList"
        size="small"
        placeholder="Select pathway"
      ></a-select>
    </div>
    <div class="flex-1">
      <VuePlotly
        :data="chartData"
        :layout="layout"
        :display-mode-bar="false"
        :config="config"
      ></VuePlotly>
    </div>
  </div>
</template>

<script setup>
import { VuePlotly } from 'vue3-plotly'
import { computed, ref } from 'vue'
import _ from 'lodash'

const pathType = ref(undefined)
const pathWay = ref(undefined)

const props = defineProps({
  pathways: {
    required: true
  }
})

const pathTypeList = computed(() => {
  const { pathways } = props
  return [...new Set(pathways.map((item) => item.pathway_name))].map((item) => ({
    label: item,
    value: item
  }))
})

const pathWayList = computed(() => {
  const { pathways } = props
  return [
    ...new Set(
      pathways
        .filter((item) => item.pathway_name === pathType.value)
        .map((item) => item.pathway_source)
    )
  ].map((item) => ({
    label: item,
    value: item
  }))
})

const chartData = computed(() => {
  const { pathways } = props
  return _.chain(pathways)
    .filter({ pathway_name: pathType.value, pathway_source: pathWay.value })
    .groupBy('cell_type_name')
    .toPairs()
    .map(([name, values], index) => {
      return {
        y: values.map((item) => item.score),
        // y: new Array(values.length).fill(name),
        x: values.map(() => index + Math.random()),
        mode: 'markers',
        type: 'scatter',
        name,
        labels: values.map((item) => item.score),
        marker: { size: 12 }
      }
    })
    .value()
})

const layout = {
  title: 'Score of Pathway',
  autosize: true,
  height: 700,
  showlegend: true
}

const config = { responsive: true, scrollZoom: true }

const handlePathTypeChange = () => {
  pathWay.value = undefined
}
</script>

<style scoped lang="scss"></style>
