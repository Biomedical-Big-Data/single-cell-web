<template>
  <div>
    <div>
      <span>Static UMAP group by</span>
      <div>
        <a-select ref="select" v-model:value="type">
          <a-select-option value="cell_type">Cell Type</a-select-option>
        </a-select>
      </div>
    </div>
    <div>
      <v-chart autosize :option="option" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const type = ref('cell_type')

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

<style scoped lang="scss"></style>
