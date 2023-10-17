<template>
  <div class="home-container bg-white">
    <div class="banner">welcome to my amazing scRNA-seq database</div>

    <div class="section">
      <div class="title">Species</div>
      <div class="items">
        <a-row justify="center">
          <a-col :span="4" v-for="item in species" class="item" :key="item.id">
            <div class="icon flex justify-center">
              <img :src="item.icon" alt="" />
            </div>
            <div class="name text-center">
              {{ item.name }}
            </div>
            <div class="count text-center">
              {{ item.count }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="section">
      <div class="title">Organ</div>
      <div class="items">
        <a-row justify="center">
          <a-col :span="6" v-for="item in organs" class="item" :key="item.id">
            <div class="icon flex justify-center">
              <img :src="item.icon" alt="" />
            </div>
            <div class="name text-center">
              {{ item.name }}
            </div>
            <div class="count text-center">
              {{ item.count }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="section">
      <div class="title">Samples</div>
      <div class="items">
        <a-row justify="center">
          <a-col :span="4" v-for="item in samples" class="item" :key="item.id">
            <div class="icon flex justify-center">
              <img :src="item.icon" alt="" />
            </div>
            <div class="name text-center">
              {{ item.name }}
            </div>
            <div class="count text-center">
              {{ item.count }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!--    <div class="section">-->
    <!--      <div class="title">合作伙伴</div>-->
    <!--      <div class="items">-->
    <!--        <div v-for="item in partners" :key="item.id">-->
    <!--          <div>-->
    <!--            <img src="" alt="" />-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            {{ item.name }}-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getHomeData } from "@/api/home.js"
import icons from "@/icons/index.js"

const species = ref([])

const organs = ref([])

const samples = ref([])

// const partners = ref([]);

onMounted(() => {
  handleFetchHomeData()
})

const handleFetchHomeData = async () => {
  const data = await getHomeData()

  species.value = data.species_list.map((item) => {
    return {
      icon: icons[getStandardName(item.species)] || icons.global,
      name: item.species,
      count: item.count,
    }
  })

  samples.value = data.sample_list.map((item) => {
    return {
      icon: icons[getStandardName(item.biosample_type)] || icons.global,
      name: item.biosample_type || "Unknown",
      count: item.count,
    }
  })

  organs.value = data.organ_list.map((item) => {
    return {
      icon: icons[getStandardName(item.organ)] || icons.global,
      name: item.organ,
      count: item.count,
    }
  })
}

const getStandardName = (name) => {
  return (name || "").replace(/[\s|-]/g, "_").toLowerCase()
}
</script>

<style lang="scss" scoped>
.home-container {
  .banner {
    background-image: url("../assets/images/home/banner.png");
    font-size: 2.25rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2rem;
    text-transform: capitalize;
    height: 18.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
  }

  .section {
    margin-top: 2.24rem;

    .title {
      font-size: 1.125rem;
      line-height: 2rem; /* 177.778% */
      text-align: center;
    }

    .items {
      margin-top: 1.5rem;

      .item {
        margin-bottom: 1.5rem;

        .icon {
          img {
            width: 3rem;
            height: 3rem;
          }
        }

        .name {
          font-size: 1rem;
          line-height: 2rem;
          margin-top: 0.5rem;
          text-transform: capitalize;
        }

        .count {
          font-size: 1rem;
          line-height: 2rem;
          text-transform: capitalize;
        }
      }
    }
  }
}
</style>
