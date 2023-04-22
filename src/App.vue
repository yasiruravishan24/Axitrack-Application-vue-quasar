<script setup>
import { onMounted } from "vue";

import { useUserStore } from "app/src/stores/useUserStore";

const user = useUserStore();

onMounted(() => {
  user.setUser();
});
</script>
<template>
  <router-view />
</template>

<style></style>
