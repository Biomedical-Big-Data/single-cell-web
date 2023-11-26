<template>
  <video autoplay loop muted class="background">
    <source src="/background.mp4" type="video/mp4" />
  </video>
  <NavBar></NavBar>
  <div class="h-screen relative">
    <div class="slogan">
      <div>
        Welcome to the
        <br />
        Single cell !
      </div>
      <div class="flex items-center justify-center">
        <div class="more animate-bounce" @click="handleScroll">
          <img src="@/assets/images/home/icon_more.svg" alt="" />
        </div>
      </div>
    </div>
  </div>

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
            <div class="count text-center">
              <span v-if="item.count">{{ item.count }}</span>
              <span v-else class="coming">coming</span>
            </div>
            <div class="name text-center">
              {{ item.name }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="section">
      <div class="title">Organ</div>
      <div class="items">
        <a-row justify="center" :gutter="[0, 48]">
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
            <div class="count text-center">
              <span v-if="item.count">{{ item.count }}</span>
              <span v-else class="coming">coming</span>
            </div>
            <div class="name text-center">
              {{ item.name }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="section">
      <div class="title">Statistics</div>
      <div class="items">
        <a-row justify="center" :gutter="[0, 48]">
          <a-col
            v-for="item in statical"
            :key="item.id"
            :span="4"
            class="item none"
          >
            <div class="icon flex justify-center">
              <img :src="item.icon" alt="" />
            </div>
            <div class="count text-center">
              <span v-if="item.count">{{ item.count }}</span>
              <span v-else class="coming">coming</span>
            </div>
            <div class="name text-center">
              {{ item.name }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="section">
      <div class="title">New projects</div>
      <div class="items">
        <a-row justify="center" class="flex-nowrap">
          <a-col
            v-for="item in projects"
            :key="item.id"
            :span="8"
            class="project"
            @click="toProject(item)"
          >
            <div class="title line-clamp-2">
              {{ item.title }}
            </div>
            <div class="desc line-clamp-3">
              {{ item.description }}
            </div>
            <div class="date">
              {{ dayjs(item.create_at).format("YYYY-MM-DD") }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
  <div class="footer">©2023 Single cell. All rights reserved.</div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getHomeData } from "@/api/home.js"
import icons from "@/icons/index.js"
import { useRouter } from "vue-router"
import dayjs from "dayjs"
import { titleCase, snakeCase } from "text-case"
import NavBar from "@/components/NavBar.vue"

const router = useRouter()

const species = ref([])

const organs = ref([])

const statical = ref([])

// const samples = ref([])

const projects = ref([])

onMounted(() => {
  handleFetchHomeData()
})

const handleFetchHomeData = async () => {
  const data = await getHomeData()

  species.value = Object.entries(icons.species).map(([key, icon]) => {
    const result = data.species_list.find(
      (a) =>
        snakeCase(a.species || "") === key ||
        snakeCase(a.species_label || "") === key,
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

  statical.value = Object.entries(icons.statical).map(([key, icon]) => {
    const result = (data.statical_list || []).find(
      (a) => snakeCase(a.statical || "") === key,
    )
    return {
      icon: icon,
      name: titleCase(key.replace(/_/g, " ")),
      key: result?.statical || key,
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

const handleScroll = () => {
  window.scrollTo({
    top: window.innerHeight - 120,
    behavior: "smooth",
  })
}
</script>

<style lang="scss" scoped>
@keyframes shake {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10%);
  }
  100% {
    transform: translateY(0);
  }
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}

.slogan {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-family:
    Source Serif Pro,
    serif;
  font-size: 4rem;
  font-weight: bold;
  backdrop-filter: blur(1.5px);

  .more {
    cursor: pointer;
    margin-top: 2.5rem;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 100%;
    backdrop-filter: blur(17px);
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;

  .section {
    width: 100%;
    max-width: 62.5rem;
    padding: 2.5rem 3.125rem 3.75rem 3.125rem;
    gap: 2.5rem;
    border-radius: 0.625rem;
    background: #fff;
    backdrop-filter: blur(42px);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;

    .title {
      color: rgba(0, 0, 0, 0.88);
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.5rem;
      text-transform: uppercase;
    }

    .items {
      width: 100%;

      .item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        &.none {
          cursor: unset;
        }

        .icon {
          img {
            width: 3.5rem;
            height: 3.5rem;
          }
        }

        .count {
          color: rgba(0, 0, 0, 0.88);
          font-size: 1.25rem;
          font-weight: 500;
          line-height: 1.5rem; /* 160% */

          .coming {
            color: rgba(0, 0, 0, 0.17);
            font-size: 1.125rem;
            font-weight: 400;
          }
        }

        .name {
          color: rgba(0, 0, 0, 0.65);
          font-size: 1rem;
          margin-top: -0.46rem;
        }
      }

      .project {
        cursor: pointer;
        display: flex;
        padding: 1.25rem;
        box-sizing: border-box;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 0.75rem;
        align-self: stretch;
        border-radius: 0.5rem;
        background: #f4f4f4;
        margin: 0 8px;

        .title {
          color: rgba(0, 0, 0, 0.88);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .desc {
          color: #7e7e7e;
          font-size: 1rem;
          font-weight: 400;
        }

        .date {
          color: #7e7e7e;
          font-size: 1rem;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
