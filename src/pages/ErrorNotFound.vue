<template>
  <q-page class="flex flex-center">
    <div style="font-size: 20vh">404</div>

    <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

    <q-btn
      class="q-mt-xl"
      color="white"
      text-color="blue"
      unelevated
      to="/"
      label="Go Home"
      no-caps
    />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
