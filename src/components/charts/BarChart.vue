<template>
  <div class="h-full flex flex-col">
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
import { VuePlotly } from "vue3-plotly"
import { onMounted, ref } from "vue"
import { getCellNumber } from "@/api/project.js"
import _ from "lodash"

const props = defineProps({
  analysisId: {
    type: [String, Number],
    required: true,
  },
})
const chartData = ref([])

const layout = {
  title: "Bar plot of cell number in each type",
  autosize: true,
  height: 700,
  showlegend: true,
}

onMounted(() => {
  handleCellNumberFetch()
})

const config = { responsive: true, scrollZoom: true }

const handleCellNumberFetch = async () => {
  const data = await getCellNumber(props.analysisId)
  // eslint-disable-next-line no-unused-vars
  const temp = _.chain(data)
    .groupBy("cell_type_id")
    .toPairs()
    .map(([_, values]) => ({
      name: values[0].proportion_cell_type_meta.cell_type_name,
      total: _.sumBy(values, "cell_number"),
    }))
    .value()
  chartData.value = [
    {
      y: _.map(temp, "name"),
      x: _.map(temp, "total"),
      type: "bar",
      orientation: "h",
    },
  ]
}
</script>
<style scoped lang="scss"></style>
