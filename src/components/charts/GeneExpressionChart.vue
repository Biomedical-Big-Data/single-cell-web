<template>
  <div class="h-full">
    <VuePlotly
      :data="chartData"
      :layout="layout"
      :display-mode-bar="false"
      :config="config"
    ></VuePlotly>
  </div>
</template>

<script setup>
import { VuePlotly } from 'vue3-plotly'
import _ from 'lodash'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  valueKey: {
    type: String,
    required: true
  }
})

const chartData = computed(() => {
  console.log(props.valueKey)
  return _.chain(props.data)
    .filter((item) => !!item[props.valueKey])
    .groupBy('cell_type_name')
    .toPairs()
    .map(([name, values]) => {
      return {
        x: values.map((item) => item[props.valueKey]),
        y: new Array(values.length).fill(name),
        mode: 'markers',
        type: 'scatter',
        name,
        marker: { size: 12 }
      }
    })
    .value()
})

const layout = {
  title: 'Gene Expression Level',
  autosize: true,
  height: 700,
  showlegend: true
}

const config = { responsive: true, scrollZoom: true }
</script>

<style scoped lang="scss">
.chart {
  height: 50vh;
}
</style>
