<template>
  <div class="h-full flex flex-col">
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

const data = [
  {
    y: ['Marc', 'Henrietta', 'Jean', 'Claude', 'Jeffrey', 'Jonathan', 'Jennifer', 'Zacharias'],
    x: [90, 40, 60, 80, 75, 92, 87, 73],
    type: 'bar',
    orientation: 'h'
  }
]

const layout = {
  title: 'Always Display the Modebar',
  autosize: true,
  height: 700,
  showlegend: true
}

const config = { responsive: true, scrollZoom: true }
</script>
<style scoped lang="scss"></style>
