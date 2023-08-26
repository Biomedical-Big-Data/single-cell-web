<template>
  <div>
    <div>
      <span>Static UMAP group by</span>
      <div>
        <a-select
            ref="select"
            v-model:value="type"
        >
          <a-select-option value="cell_type">Cell Type</a-select-option>
        </a-select>
      </div>
    </div>
    <div>

    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const type = ref('cell_type')
</script>


<style scoped lang="scss">

</style>
