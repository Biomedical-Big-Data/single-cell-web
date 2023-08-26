<template>
  <div class="py-4 px-6 bg-white">
    <div class="summary">
      Welcome to project XXX
      <a-button type="primary">interactive viewer</a-button>
    </div>
    <div class="mt-1.5">
      <a-tag>Tag 1</a-tag>
      <a-tag>Tag 1</a-tag>
      <a-tag>Tag 1</a-tag>
    </div>
  </div>

  <div class="mt-4 px-4">
    <a-tabs v-model:activeKey="activeKey" tab-position="left" class="py-4 bg-white">
      <a-tab-pane key="similarity" tab="Cell cell similarity">
        <div>
          <SimilarityChart></SimilarityChart>
        </div>
      </a-tab-pane>
      <a-tab-pane key="barplot" tab="Barplot of cell umber in each type">
        <BarChart></BarChart>
      </a-tab-pane>
      <a-tab-pane key="celltype" tab="Celltype Markers">
        <CellTypeMarkers></CellTypeMarkers>
      </a-tab-pane>
      <a-tab-pane key="score" tab="Score of pathway">
        <PathWayChart></PathWayChart>
      </a-tab-pane>
      <a-tab-pane key="interactive" tab="interactive view">interactive view</a-tab-pane>
    </a-tabs>
  </div>
  <div class="information mt-4 px-4">
    <div class="bg-white p-5">
      <div>Publication : xxx aacbecekdede gogogesdepnfejde</div>
      <div class="mt-4">Email : xyz@shanghaiitech.edu.cn</div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import BarChart from '@/components/charts/BarChart.vue'
import SimilarityChart from '@/components/charts/SimilarityChart.vue'
import PathWayChart from '@/components/charts/PathWayChart.vue'
import CellTypeMarkers from '@/components/CellTypeMarkers.vue'
import { getProjectDetail } from '@/api/project'

const activeKey = ref('similarity')

const props = defineProps({
  id: {
    required: true
  }
})

onMounted(() => {
  handleProjectDetailFetch()
})

const handleProjectDetailFetch = async () => {
  const data = await getProjectDetail(props.id)
  console.log(data)
}
</script>
<style scoped lang="scss">
.summary {
  color: var(--character-title-85, rgba(0, 0, 0, 0.85));
  font-size: 1.25rem;
  line-height: 1.75rem;
}
</style>
