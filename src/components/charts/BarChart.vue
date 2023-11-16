<template>
  <div class="h-full flex flex-col">
    <a-spin :spinning="loading">
      <div>
        <VuePlotly
          :data="chartData"
          :layout="layout"
          :display-mode-bar="false"
          :config="config"
        ></VuePlotly>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { VuePlotly } from "vue3-plotly"
import { computed, onMounted, ref } from "vue"
import { getCellNumber } from "@/api/project.js"
import _ from "lodash"

const props = defineProps({
  analysisId: {
    type: [String, Number],
    required: true,
  },
})
const chartData = ref([])
const loading = ref(false)
const layout = computed(() => {
  return {
    resposnive: true,
    autosize: true,
    height: 612,
    margin: {
      b: 50,
      t: 50,
    },
    yaxis: {
      automargin: true,
    },
  }
})

onMounted(() => {
  handleCellNumberFetch()
})

const config = { responsive: true, scrollZoom: true }

const handleCellNumberFetch = async () => {
  try {
    loading.value = true
    const data = await getCellNumber(props.analysisId)
    // eslint-disable-next-line no-unused-vars
    const temp = _.chain(data)
      .groupBy("cell_type_id")
      .toPairs()
      // eslint-disable-next-line no-unused-vars
      .map(([a, values]) => {
        return {
          name: values[0].proportion_cell_type_meta.cell_type_name,
          total: _.sumBy(values, "cell_number"),
        }
      })
      .sortBy("total")
      .value()
    chartData.value = [
      {
        y: _.map(temp, "name"),
        x: _.map(temp, "total"),
        type: "bar",
        orientation: "h",
      },
    ]
  } finally {
    loading.value = false
  }
}
</script>
<style scoped lang="scss"></style>
