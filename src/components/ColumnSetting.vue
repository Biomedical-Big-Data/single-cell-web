<template>
  <a-popover trigger="click" placement="bottom">
    <template #content>
      <div
          class="overflow-y-auto table-column-setting"
          style="width: 400px"
      >
        <a-collapse expand-icon-position="end" class="w-full">
          <a-collapse-panel
              v-for="(v, k) in columnGroup"
              :key="k"
              :header="getTitleName(k)"
          >
            <div>
              <div v-for="item in v" :key="item.title" class="p-2">
                <a-checkbox :checked="getChecked(item)" :name="item.title" @change="handleColumnToggle">
                  {{ item.title }}
                </a-checkbox>
              </div>
            </div>
            <template #extra>
              <a-badge
                  :count="getSelectedCount(k)"
                  :number-style="{ backgroundColor: '#0081D8' }"
              />
            </template>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </template>
    <div class="column-setting">
      <img class="icon" src="@/assets/icons/icon-setting.svg" alt="">
      Customised columns
    </div>
  </a-popover>
</template>

<script setup>
import { computed, nextTick } from 'vue'
import _ from 'lodash'
import { titleCase } from 'text-case'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  totalColumns: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emits = defineEmits(['update:columns'])

const columnGroup = computed(() => {
  return _.chain(props.totalColumns)
      .filter((item) => !!item.group)
      .groupBy('group')
      .value()
})

const handleColumnToggle = ({ target }) => {
  const { name, checked } = target
  nextTick(() => {
    emits('update:columns', props.totalColumns.map((item) => item.title).filter(item => {
      return item === name ? checked : props.columns.includes(item)
    }))
  })
}

const getChecked = (item) => {
  return props.columns.includes(item.title)
}
const getSelectedCount = (group) => {
  return props.totalColumns.filter((item) => {
    return item.group === group && getChecked(item)
  }).length
}

const getTitleName = (k) => {
  return titleCase((k || '').replace(/_/g, ' '))
}

</script>


<style lang="scss" scoped>
.column-setting {
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  color: #FFF;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.375rem;
  cursor: pointer;

  .icon {
    margin-right: 0.62rem;
  }
}

.table-column-setting {
  max-height: 75vh;
}
</style>
