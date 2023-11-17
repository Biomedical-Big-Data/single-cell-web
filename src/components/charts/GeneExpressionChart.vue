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

const dataGroup = computed(() => {
  return _.chain(props.data)
    .filter((item) => !!item[props.valueKey])
    .groupBy("cell_type_name")
    .value()
})

const chartData = computed(() => {
  return _.chain(dataGroup.value)
    .toPairs()
    .map(([name, values], index) => {
      return {
        x: values.map((item) => item[props.valueKey]),
        // y: new Array(values.length).fill(name),
        y: values.map(() => -index - Math.random() * 0.2),
        mode: "markers",
        type: "scatter",
        hovertemplate: "%{x}",
        text: name,
        name,
        label: values.map((item) => item[props.valueKey]),
        marker: { size: 12 },
      }
    })
    .value()
})

const layout = computed(() => {
  const temp = [..._.chain(dataGroup.value).keys().value(), ""]
  console.log(temp)
  return {
    title: props.title,
    autosize: true,
    height: 700,
    showlegend: false,
    xaxis: {
      side: "top",
      ticklabelposition: "outside top",
      tickformat: ".00%",
    },
    yaxis: {
      automargin: true,
      tickvals: Object.keys(temp).map((item) => -item),
      ticktext: temp,
    },
  }
})

const config = { responsive: true, scrollZoom: true }
</script>

<style scoped lang="scss">
.chart {
  height: 50vh;
}
</style>
