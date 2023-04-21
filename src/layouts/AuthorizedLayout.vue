<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

$q.loadingBar.setDefaults({
  color: "dark",
  size: "5px",
  position: "top",
});

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const links = ref([
  { icon: "home", text: "Home" },
  { icon: "whatshot", text: "Trending" },
  { icon: "subscriptions", text: "Subscriptions" },
  { icon: "settings", text: "Settings" },
  { icon: "help", text: "Help" },
  { icon: "feedback", text: "Send feedback" },
]);

const AccountLinks = ref([{ icon: "logout", text: "Logout" }]);
</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          class="row items-center no-wrap"
        >
          <q-img src="~assets/logo.png" width="150px" />
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  v-for="(link, i) in AccountLinks"
                  :key="i"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-icon color="grey" :name="link.icon" />
                  </q-item-section>
                  <q-item-section>{{ link.text }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="toolbar" v-if="$q.screen.lt.md">
          <q-toolbar-title class="row items-center">
            <q-img src="~assets/logo.png" width="150px" />
          </q-toolbar-title>
        </q-toolbar>
        <q-list>
          <q-item v-for="(link, i) in links" :key="i" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped></style>
