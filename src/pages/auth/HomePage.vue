<script setup>
import { ref } from "vue";
import AppButton from "../../components/AppButton.vue";

import { useUserStore } from "../../stores/useUserStore";

const user = useUserStore();

const profileDetails = ref([
  {
    key: "address",
    label: "Address",
  },
  {
    key: "contact_no",
    label: "Contact No",
  },
  {
    key: "nic",
    label: "NIC",
  },
  {
    key: "job",
    label: "Job",
  },
]);

const counters = ref([
  {
    key: "vehicles",
    icon: "directions_car",
    label: "Vehicles",
    link: "/",
    btn_lable: "Add",
  },
  {
    key: "contacts",
    icon: "contacts",
    label: "Contacts",
    link: "/",
    btn_lable: "Add",
  },
  {
    key: "history",
    icon: "timeline",
    label: "Detection",
    link: "/",
    btn_lable: "Go to History",
  },
]);
</script>
<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col-12 col-md-12">
        <q-card class="profile-card" bordered>
          <q-card-section horizontal>
            <q-card-section class="col-7">
              <div class="text-overline">Profile Details</div>
              <div class="text-h3 q-mt-sm q-mb-xs">
                {{ user.$state.user["full_name"] }}
              </div>
              <div class="text-caption">
                <q-list dense>
                  <q-item
                    v-for="(detail, i) in profileDetails"
                    :key="i"
                    class="q-pa-none"
                  >
                    <q-item-section side>{{ detail.label }} : </q-item-section>
                    <q-item-section>{{
                      user.$state.user[detail.key]
                    }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-card-section>

            <q-card-section class="col-5 flex justify-end">
              <q-img
                class="rounded-borders"
                width="200px"
                placeholder.jpg
                :src="
                  user.$state.user['profile_image'] != undefined
                    ? user.$state.user['profile_image']
                    : '/src/assets/placeholder.jpg'
                "
              />
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat color="primary">Edit</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-lg">
      <div v-for="(counter, i) in counters" :key="i" class="col-12 col-md-4">
        <q-card class="my-card bg-dark text-white">
          <q-card-section>
            <div class="text-h5">
              <q-icon :name="counter.icon" size="30px" class="q-mr-sm" />{{
                counter.label
              }}
            </div>
          </q-card-section>

          <q-card-section class="flex flex-center">
            <div class="text-h2 text-bold">
              {{
                user.$state.user[counter.key]
                  ? user.$state.user[counter.key].length
                  : "0"
              }}
              +
            </div>
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn flat :to="counter.link">{{ counter.btn_lable }}</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss"></style>
