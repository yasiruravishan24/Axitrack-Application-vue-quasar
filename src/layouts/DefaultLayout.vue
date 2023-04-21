<script setup>
import { useQuasar } from "quasar";
const $q = useQuasar();

$q.loadingBar.setDefaults({
  color: "dark",
  size: "5px",
  position: "top",
});
</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
