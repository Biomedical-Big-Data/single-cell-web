<template>
  <a-menu mode="horizontal">
    <a-menu-item key="species">
      <RouterLink to="/meta/species">Species</RouterLink>
    </a-menu-item>
    <a-menu-item key="cell_type">
      <RouterLink to="/meta/cell_type">Cell Type</RouterLink>
    </a-menu-item>
    <a-menu-item key="gene">
      <RouterLink to="/meta/gene">Gene</RouterLink>
    </a-menu-item>
  </a-menu>
  <RouterView />
</template>
<script setup>
// import { computed } from "vue"
// import { useRoute } from "vue-router"

// const route = useRoute()

// const current = computed(() => {
//   return route.path.split("/")[2]
// })
</script>
