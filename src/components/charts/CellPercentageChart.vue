<template>
  <div class="h-full">
    <v-chart class="chart" autosize :option="option" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { use } from 'echarts/core'
import { ScatterChart } from 'echarts/charts'
import { DatasetComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([DatasetComponent, LegendComponent, GridComponent, ScatterChart, CanvasRenderer])

function createCluster(center, radiusX, radiusY, nrPoints) {
  const cluster = []
  for (let i = 0; i < nrPoints; i++) {
    const x = center.x + rnd(-radiusX, radiusX)
    const y = center.y + rnd(-radiusY, radiusY)
    cluster.push({ x: x, y: y, center: center })
  }
  return cluster
}

function rnd(min, max) {
  return Math.random() * (max - min) + min
}

const datasetList = [
  {
    id: '1',
    source: createCluster({ x: 87, y: 13 }, 13, 12, 81)
  },
  {
    id: '2',
    source: createCluster({ x: 34, y: 71 }, 18, 8, 79)
  },
  {
    id: '3',
    source: createCluster({ x: 17, y: 23 }, 5, 7, 27)
  },
  {
    id: '4',
    source: createCluster({ x: 79, y: 50 }, 35, 20, 150)
  }
]

// echart configuration
let seriesList = []
for (let data of datasetList) {
  seriesList.push({
    type: 'scatter',
    datasetId: data.id,
    name: 'dataset ' + data.id,
    label: {
      show: true,
      position: [data.source[0]['center']['x'], data.source[0]['center']['y']],
      formatter: function (params) {
        if (params.dataIndex === 0) {
          // show labels only at points with data index 0
          return params.data[0]
        } else {
          return ''
        }
      }
    }
  })
}

const option = ref({
  dataset: datasetList,
  legend: {},
  animation: false,
  xAxis: {},
  yAxis: {},
  series: seriesList
})
</script>

<style scoped lang="scss">
.chart {
  height: 50vh;
}
</style>
