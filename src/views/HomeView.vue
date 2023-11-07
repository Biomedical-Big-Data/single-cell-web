<template>
  <div class="home-container bg-white overflow-x-hidden">
    <div class="banner">welcome to my amazing scRNA-seq database</div>

    <div class="content">
      <div class="section">
        <div class="title">Species</div>
        <div class="items">
          <a-row justify="center">
            <a-col
              v-for="item in species"
              :key="item.id"
              :span="3"
              class="item"
              @click="toSpecies(item)"
            >
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
            <a-col
              v-for="item in organs"
              :key="item.id"
              :span="3"
              class="item"
              @click="toOrgan(item)"
            >
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
        <div class="title">Latest Project</div>
        <div class="items">
          <a-row justify="center" :gutter="[24, 16]">
            <a-col
              v-for="item in projects"
              :key="item.id"
              :span="6"
              class="project"
              @click="toProject(item)"
            >
              <div class="text-center title line-clamp-2">
                {{ item.title }}
              </div>
              <div class="text-center desc line-clamp-3 leading-normal">
                {{ item.description }}
              </div>
              <div class="date text-center">
                {{ dayjs(item.create_at).format("YYYY-MM-DD") }}
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getHomeData } from "@/api/home.js"
import icons from "@/icons/index.js"
import { useRouter } from "vue-router"
import dayjs from "dayjs"
import { titleCase, snakeCase } from "text-case"

const router = useRouter()

const species = ref([])

const organs = ref([])

// const samples = ref([])

const projects = ref([])

// const partners = ref([]);

onMounted(() => {
  handleFetchHomeData()
})

const handleFetchHomeData = async () => {
  const data = await getHomeData()

  species.value = Object.entries(icons.species).map(([key, icon]) => {
    const result = data.species_list.find(
      (a) => snakeCase(a.species || "") === key,
    )
    return {
      icon: icon,
      name: titleCase(key.replace(/_/g, " ")),
      count: result?.count || 0,
      key: result?.species || key,
      id: result?.id,
    }
  })

  organs.value = Object.entries(icons.organ).map(([key, icon]) => {
    const result = data.organ_list.find((a) => snakeCase(a.organ || "") === key)
    return {
      icon: icon,
      name: titleCase(key.replace(/_/g, " ")),
      key: result?.organ || key,
      count: result?.count || 0,
    }
  })

  projects.value = data.project_list
}

const toOrgan = (organ) => {
  router.push({
    name: "projects",
    query: {
      organ: organ.key,
    },
  })
}

const toSpecies = (species) => {
  if (species.id) {
    router.push({
      name: "projects",
      query: {
        species: species.id,
      },
    })
  }
}

const toProject = (project) => {
  router.push({
    name: "project_detail",
    params: {
      id: project.id,
    },
  })
}
</script>

<style lang="scss" scoped>
.home-container {
  .banner {
    background-image: url("../assets/images/home/banner.png");
    background-size: cover;
    font-size: 2.25rem;
    font-style: normal;
    font-weight: 500;
    line-height: 2rem;
    text-transform: capitalize;
    height: 24rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
  }

  .section {
    margin-top: 2.24rem;

    .title {
      font-size: 1.5rem;
      line-height: 2rem; /* 177.778% */
      text-align: center;
    }

    .items {
      margin-top: 2rem;

      .project {
        border-radius: 0.5rem;
        margin: 1rem;
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.15);
        padding: 1rem;
        .title {
          font-size: 1.125rem;
          font-weight: bold;
        }

        .desc {
          margin-top: 0.5rem;
        }

        .date {
          margin-top: 0.5rem;
        }
      }

      .item {
        cursor: pointer;
        margin-bottom: 1.5rem;

        .icon {
          img {
            width: 3rem;
            height: 3rem;
          }
        }

        .name {
          font-size: 1.125rem;
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

.content {
  padding-bottom: 5rem;
}
</style>
