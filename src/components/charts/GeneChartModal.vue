<template>
  <a-modal
    v-model:open="open"
    width="60%"
    title="Statistics Chart"
    class="simple-modal"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <div class="bg-white p-6">
      <a-tabs v-model:activeKey="geneChartType" type="card">
        <a-tab-pane key="percent" tab="Cell Number Percentage">
          <a-spin :spinning="loading">
            <GeneExpressionLevelChart
              :data="geneChartData"
              title="Cell Number Percentage"
              value-key="cell_proportion_expression_the_gene"
            ></GeneExpressionLevelChart>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="expression" tab="Gene Expression Level">
          <a-spin :spinning="loading">
            <GeneExpressionLevelChart
              :data="geneChartData"
              title="Gene Expression Level"
              value-key="average_gene_expression"
            ></GeneExpressionLevelChart>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>
<script setup>
import GeneExpressionLevelChart from "@/components/charts/GeneExpressionChart.vue"
import { ref } from "vue"
import { getProjectGeneChartData } from "@/api/project.js"

const open = ref(false)
const geneChartType = ref("percent")
const geneChartData = ref([])
const loading = ref(false)
const chartCondition = ref({})

const openModal = (condition) => {
  chartCondition.value = condition
  open.value = true
  handleGeneChartDataFetch()
}

const handleGeneChartDataFetch = async () => {
  try {
    loading.value = true
    geneChartData.value = await getProjectGeneChartData(chartCondition.value)
  } finally {
    loading.value = false
  }
}

defineExpose({
  openModal,
})
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;

  .ant-tabs-nav-wrap {
    .ant-tabs-tab {
      height: 2.5rem;
      width: 11.625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7e7e7e;
      background: #dfe2e8;
      border-radius: 0.625rem 0.625rem 0 0;
      border: none;

      &.ant-tabs-tab-active {
        background: #0081d8;

        .ant-tabs-tab-btn {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
