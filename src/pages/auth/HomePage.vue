<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

import AppButton from "../../components/AppButton.vue";
import AppInput from "../../components/AppInput.vue";

import { useUserStore } from "../../stores/useUserStore";

const $q = useQuasar();

const user = useUserStore();

const prompt = ref(false);

const btn_loading = ref(false);

const profile_image = ref(null);

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
]);

const counters = ref([
  {
    key: "vehicles",
    icon: "directions_car",
    label: "Vehicles",
    link: "/vehicles",
    btn_lable: "Add",
  },
  {
    key: "contacts",
    icon: "contacts",
    label: "Contacts",
    link: "/contacts",
    btn_lable: "Add",
  },
  {
    key: "notifications",
    icon: "timeline",
    label: "Detection",
    link: "/notifications",
    btn_lable: "See Details",
  },
]);

const inputs = ref([
  {
    label: "Full Name",
    name: "full_name",
    type: "text",
    autocomplete: "off",
    value: "",
    rules: [(val) => (val && val.length > 0) || "Please enter full name"],
    loading: false,
    autofocus: false,
    lazyRules: false,
    reactiveRules: false,
    error: false,
    errorMessage: null,
    clearable: true,
    icon: false,
    iconSlot: "prepend",
    iconType: null,
    iconName: null,
    iconColor: null,
  },
  {
    label: "Address",
    name: "address",
    type: "text",
    autocomplete: "off",
    value: "",
    rules: [],
    loading: false,
    autofocus: false,
    lazyRules: false,
    reactiveRules: false,
    error: false,
    errorMessage: null,
    clearable: true,
    icon: false,
    iconSlot: "prepend",
    iconType: null,
    iconName: null,
    iconColor: null,
  },
  {
    label: "Contact No",
    name: "contact_no",
    type: "text",
    autocomplete: "off",
    value: "",
    rules: [],
    loading: false,
    autofocus: false,
    lazyRules: false,
    reactiveRules: false,
    error: false,
    errorMessage: null,
    clearable: true,
    icon: false,
    iconSlot: "prepend",
    iconType: null,
    iconName: null,
    iconColor: null,
  },
  {
    label: "NIC",
    name: "nic",
    type: "text",
    autocomplete: "off",
    value: "",
    rules: [],
    loading: false,
    autofocus: false,
    lazyRules: false,
    reactiveRules: false,
    error: false,
    errorMessage: null,
    clearable: true,
    icon: false,
    iconSlot: "prepend",
    iconType: null,
    iconName: null,
    iconColor: null,
  },
]);

const togglePrompt = () => {
  prompt.value = !prompt.value;

  inputs.value = inputs.value.map((element, i) => {
    if (user.$state.user[element.name] != undefined) {
      element.value = user.$state.user[element.name];
    }

    return element;
  });
};

const submitForm = async () => {
  var full_name = inputs.value[0].value;
  var address = inputs.value[1].value;
  var contact_no = inputs.value[2].value;
  var nic = inputs.value[3].value;

  if (full_name.length < 1) {
    inputs.value[0].error = true;
    inputs.value[0].errorMessage = "Please enter full name";

    return;
  } else {
    inputs.value[0].error = false;
    inputs.value[0].errorMessage = null;
  }

  btn_loading.value = true;
  $q.loadingBar.start();

  const data = {
    full_name: full_name,
    address: address,
    contact_no: contact_no,
    nic: nic,
    profile_image:profile_image.value
  };

  await user
    .updateProfile(data)
    .then((res) => {
      btn_loading.value = false;
      $q.loadingBar.stop();

      togglePrompt();

      inputs.value[0].value = "";
      inputs.value[1].value = "";
      inputs.value[2].value = "";
      inputs.value[3].value = "";

      $q.notify({
        message: "Profile update successfully",
        color: "positive",
        position: "top",
      });
    })
    .catch((error) => {
      btn_loading.value = false;
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
            <q-btn flat color="primary" @click="togglePrompt">Edit</q-btn>
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

    <q-dialog v-model="prompt">
      <q-card style="width: 700px; max-width: 80vw" class="q-pa-md">
        <q-form class="q-gutter-md">
          <AppInput
            v-for="(input, i) in inputs"
            :key="i"
            :label="input.label"
            :name="input.name"
            :lazyRules="input.lazyRules"
            :reactiveRules="input.reactiveRules"
            :rules="input.rules"
            :type="input.type"
            :autocomplete="input.autocomplete"
            :loading="input.loading"
            :autofocus="input.autofocus"
            :error="input.error"
            :errorMessage="input.errorMessage"
            :clearable="input.clearable"
            :icon="input.icon"
            :iconSlot="input.iconSlot"
            :iconType="input.iconType"
            :iconName="input.iconName"
            :iconColor="input.iconColor"
            v-model:modelValue="input.value"
            @handleIcon="iconClick(i, input.name, input.type)"
          ></AppInput>
          <q-file
            rounded
            outlined
            color="blue-grey-2"
            label-color="dark"
            clearable
            v-model="profile_image"
            accept=".jpg, .png"
            label="Select profile image"
          />
          <div class="column q-pt-sm">
            <AppButton
              type="button"
              label="Update Profile"
              color="dark"
              size="20px"
              :loading="btn_loading"
              @handleClick="submitForm"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style lang="scss"></style>
