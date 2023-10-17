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
import { VuePlotly } from "vue3-plotly"
import _ from "lodash"
import { computed } from "vue"

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  valueKey: {
    type: String,
    required: true,
  },
})

const chartData = computed(() => {
  return _.chain(props.data)
    .filter((item) => !!item[props.valueKey])
    .groupBy("cell_type_name")
    .toPairs()
    .map(([name, values], index) => {
      return {
        x: values.map((item) => item[props.valueKey]),
        // y: new Array(values.length).fill(name),
        y: values.map(() => index + Math.random()),
        mode: "markers",
        type: "scatter",
        name,
        labels: values.map((item) => item[props.valueKey]),
        marker: { size: 12 },
      }
    })
    .value()
})

const layout = computed(() => ({
  title: props.title,
  autosize: true,
  height: 700,
  showlegend: true,
}))

const config = { responsive: true, scrollZoom: true }
</script>

<style scoped lang="scss">
.chart {
  height: 50vh;
}
</style>
