<template>
  <div class="nav">
    <div class="back-container" @click="handleGoHome()">
      <img src="@/assets/icons/icon-back.svg" alt=""/>
      <span>Home</span>
    </div>
    <div class="user-container">
      <a-button class="create-action" @click="handleGoProjectCreate()">
        Create Project
      </a-button>
      <a-avatar>ABC</a-avatar>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const handleGoHome = () => {
  router.push({ name: 'home' })
}
const handleGoProjectCreate = () => {
  router.push({ name: 'project_create' })
}

</script>


<style scoped lang="scss">

.nav {
  background: #ffffff;
  display: flex;
  padding: 0.625rem 1.25rem;
  justify-content: space-between;
  align-items: center;

  .back-container {
    display: flex;
    height: 2.25rem;
    padding: 0 0.75rem;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &:hover {
      filter: brightness(0) saturate(100%) invert(41%) sepia(100%) saturate(4465%) hue-rotate(186deg) brightness(96%) contrast(102%);
    }

    img {
      width: 1.125rem;
      height: 1.125rem;
    }

    span {
      color: #5f5f5f;
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.375rem; /* 137.5% */
    }
  }

  .user-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;

    .create-action {
      display: flex;
      height: 2.25rem;
      padding: 0 1.75rem 0.125rem 1.75rem;
      justify-content: center;
      align-items: center;
      gap: 0.625rem;
      border-radius: 2.9375rem;
      background: #0062ff;
      color: #fff;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.375rem;
    }
  }
}
</style>
