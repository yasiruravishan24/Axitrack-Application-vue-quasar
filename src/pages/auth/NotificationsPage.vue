<script setup>
import { useQuasar } from "quasar";

import { useUserStore } from "../../stores/useUserStore";

const $q = useQuasar();

const user = useUserStore();


const getVehicleNo = (address) => {
  return user.$state.user["vehicles"].filter(
    (element, index) => element.device_mac == address
  );
};

const getMapLink = (location) => {
  return (
    "https://www.google.com/maps/?q=" + location._lat + "," + location._long
  );
};

const getMapCoord = (location) => {
  return "lat : " + location._lat + " long : " + location._long;
};

const updateSeen = async (row) => {
  console.log(row);
  $q.loadingBar.start();

  await user
    .updateSeen(row)
    .then((res) => {
      $q.loadingBar.stop();
      $q.notify({
        message: "Notification update successfully",
        color: "positive",
        position: "top",
      });
    })
    .catch((error) => {
      $q.loadingBar.stop();
      $q.notify({
        message: error.message,
        color: "negative",
        position: "top",
      });
    });
};
</script>
<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col-12 col-md-12">
        <q-card class="bg-dark text-white">
          <q-card-section>
            <div class="col text-h4">Notifications</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-lg">
      <div
        v-if="
          user.$state.user['notifications'] == undefined ||
          user.$state.user['notifications'].length == 0
        "
        class="col-12 col-md-12"
      >
        <q-banner dense rounded class="bg-info text-white text-center">
          No notifications yet
        </q-banner>
      </div>

      <div
        v-for="(notification, i) in user.$state.user.notifications"
        :key="i"
        :class="notification.seen == 0 ? 'cursor-pointer' : ''"
        :clickable="notification.seen == 0"
        @dblclick="updateSeen(i)"
      >

        <q-card class="my-card bg-dark text-white">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label
                    >Vehicle No
                    <q-badge v-if="notification.seen == 0" rounded floating color="red"
                  /></q-item-label>
                  <q-item-label caption class="text-grey-6">{{
                    getVehicleNo(notification.mac_address)[0].vehicle_no
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Device MAC</q-item-label>
                  <q-item-label caption class="text-grey-6">{{
                    notification.mac_address
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Location</q-item-label>
                  <q-item-label caption class="text-grey-6"
                    ><a
                      class="text-info"
                      :href="getMapLink(notification.location)"
                      target="_blank"
                      >{{ getMapCoord(notification.location) }}</a
                    ></q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Date Time</q-item-label>
                  <q-item-label caption class="text-grey-6">{{
                    notification.date + " " + notification.time
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.notification-card:hover {
  cursor: pointer;
}
</style>
