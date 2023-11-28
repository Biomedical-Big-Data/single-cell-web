<template>
  <div class="nav">
    <slot name="back">
      <div
        class="back-container"
        @click="handleGoBack()"
      >
        <img
          src="@/assets/icons/icon-back.svg"
          alt=""
        />
        <span>Cancel</span>
      </div>
    </slot>
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
}
</style>
