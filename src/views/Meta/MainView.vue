<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">
        <a-dropdown>
          <a class="ant-dropdown-link cursor-pointer">
            {{ route.meta.title }}
            <CaretDownOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="item in options" :key="item">
                <a class="selector-item" @click="handleToRouter(item)">
                  {{ item.name }}
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <RouterView />
    </div>
  </div>
</template>
<script setup>
import NavBar from "@/components/NavBar.vue"
import { CaretDownOutlined } from "@ant-design/icons-vue"
import { useRoute, useRouter } from "vue-router"
import { ref } from "vue"

const route = useRoute()
const router = useRouter()

const options = ref([
  { router_name: "species", name: "Species Meta" },
  { router_name: "cell_type", name: "CellType Meta" },
  { router_name: "gene", name: "Gene Meta" },
])

const handleToRouter = ({ router_name, name }) => {
  console.log(route.meta.title, router_name, name)
  if (name !== route.meta.title) {
    router.replace({ path: "/meta/" + router_name })
  }
}
</script>
<style>
@import "@/assets/styles/stable.scss";
</style>

<!--<a-menu mode="horizontal">-->
<!--<a-menu-item key="species">-->
<!--  <RouterLink to="/meta/species">Species</RouterLink>-->
<!--</a-menu-item>-->
<!--<a-menu-item key="cell_type">-->
<!--  <RouterLink to="/meta/cell_type">Cell Type</RouterLink>-->
<!--</a-menu-item>-->
<!--<a-menu-item key="gene">-->
<!--  <RouterLink to="/meta/gene">Gene</RouterLink>-->
<!--</a-menu-item>-->
<!--</a-menu>-->
<!--<RouterView />-->
