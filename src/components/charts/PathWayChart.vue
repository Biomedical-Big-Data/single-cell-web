<template>
  <a-spin :spinning="loading">
    <div class="h-full flex flex-col">
      <div class="flex items-center px-4 p-2">
        <a-select
          v-model:value="pathType"
          class="w-50"
          :options="pathTypeList"
          placeholder="Select pathway type"
          @change="handlePathTypeChange"
        ></a-select>
        <a-select
          v-model:value="pathWay"
          class="w-40 ml-4"
          :options="pathWayList"
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
  </a-spin>
</template>

<script setup>
import { VuePlotly } from "vue3-plotly"
import { computed, onMounted, ref } from "vue"
import _ from "lodash"
import { getCellPathwayFile } from "@/api/file"
import csvtojson from "csvtojson"
import { getPathwayData } from "@/api/project"

const pathType = ref(undefined)
const pathWay = ref(undefined)
const pathways = ref([])
const loading = ref(true)
const props = defineProps({
  project: {
    required: true,
    type: Object,
    default: () => {},
  },
})

const pathTypeList = computed(() => {
  return [...new Set(pathways.value.map((item) => item.pathway_name))].map(
    (item) => ({
      label: item,
      value: item,
    }),
  )
})

const pathWayList = computed(() => {
  return [
    ...new Set(
      pathways.value
        .filter((item) => item.pathway_name === pathType.value)
        .map((item) => item.pathway_source),
    ),
  ].map((item) => ({
    label: item,
    value: item,
  }))
})

const chartData = computed(() => {
  return _.chain(pathways.value)
    .filter({ pathway_name: pathType.value, pathway_source: pathWay.value })
    .groupBy("cell_type_name")
    .toPairs()
    .map(([name, values], index) => {
      return {
        y: values.map((item) => item.score),
        x: values.map(() => index + Math.random()),
        mode: "markers",
        type: "scatter",
        name,
        labels: values.map((item) => item.score),
        marker: { size: 12 },
      }
    })
    .value()
})

const layout = {
  title: "Score of Pathway",
  autosize: true,
  height: 700,
  showlegend: true,
}

const config = { responsive: true, scrollZoom: true }

const handlePathTypeChange = () => {
  pathWay.value = undefined
}

onMounted(async () => {
  const { project } = props
  try {
    loading.value = true
    if (project.is_private && project.project_analysis_meta?.[0]?.pathway_id) {
      const pathway = await getCellPathwayFile(
        project.project_analysis_meta?.[0]?.pathway_id,
      )
      pathways.value = await csvtojson({ output: "json" }).fromString(pathway)
    } else {
      const data = await getPathwayData(project.project_analysis_meta?.[0]?.id)
      pathways.value = data
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss"></style>
