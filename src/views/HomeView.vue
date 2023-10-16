<template>
  <div class="home-container bg-white">
    <div class="banner">welcome to my amazing scRNA-seq database</div>

    <div class="section">
      <div class="title">Species</div>
      <div class="items">
        <a-row justify="center">
          <a-col :span="4" v-for="item in species" class="item" :key="item.id">
            <div class="icon flex justify-center">
              <img src="../assets/icons/body.svg" alt="" />
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
          <a-col :span="4" v-for="item in organs" class="item" :key="item.id">
            <div class="icon flex justify-center">
              <img src="../assets/icons/body.svg" alt="" />
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
              <img src="../assets/icons/body.svg" alt="" />
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
      <div class="title">合作伙伴</div>
      <div class="items">
        <div v-for="item in partners" :key="item.id">
          <div>
            <img src="" alt="" />
          </div>
          <div>
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const species = ref([
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
]);

const organs = ref([
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
]);

const samples = ref([
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
  {
    icon: "body",
    name: "Human",
    count: 100,
  },
]);

const partners = ref([]);
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
