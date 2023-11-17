<template>
  <div class="nav">
    <div class="back-container" @click="handleGoBack()">
      <img src="@/assets/icons/icon-back.svg" alt="" />
      <span>Cancel</span>
    </div>
    <div class="flex items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const handleGoBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.nav {
  background: #ffffff;
  display: flex;
  padding: 0.625rem 1.25rem;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  width: 100vw;
  z-index: 99;

  .back-container {
    display: flex;
    height: 2.25rem;
    padding: 0 0.75rem;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &:hover {
      filter: brightness(0) saturate(100%) invert(41%) sepia(100%)
        saturate(4465%) hue-rotate(186deg) brightness(96%) contrast(102%);
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
}
</style>
