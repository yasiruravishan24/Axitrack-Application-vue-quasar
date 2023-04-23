<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import AppButton from "../../components/AppButton.vue";
import AppInput from "../../components/AppInput.vue";

import { useUserStore } from "../../stores/useUserStore";

const $q = useQuasar();

const user = useUserStore();

const prompt = ref(false);

const btn_loading = ref(false);

const inputs = ref([
  {
    label: "Vehicle No",
    name: "vehicle_no",
    type: "text",
    autocomplete: "off",
    value: "",
    rules: [(val) => (val && val.length > 0) || "Please enter vehicle no"],
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
    label: "Device MAC",
    name: "device_mac",
    type: "text",
    autocomplete: "off",
    value: "",
    rules: [
      (val) => (val && val.length > 0) || "Please enter device MAC address",
    ],
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

const device_model = ref(null);
const device_model_error = ref(false);
const device_model_error_msg = ref(null);

const togglePrompt = () => {
  prompt.value = !prompt.value;
};

const submitForm = async () => {
  var vehicle_no = inputs.value[0].value;
  var device_mac = inputs.value[1].value;

  if (vehicle_no.length < 1) {
    inputs.value[0].error = true;
    inputs.value[0].errorMessage = "Please enter vehicle no";

    return;
  } else {
    inputs.value[0].error = false;
    inputs.value[0].errorMessage = null;
  }

  if (device_mac.length < 1) {
    inputs.value[1].error = true;
    inputs.value[1].errorMessage = "Please enter device MAC address";

    return;
  } else {
    inputs.value[1].error = false;
    inputs.value[1].errorMessage = null;
  }

  if (device_model.value == null) {
    device_model_error.value = true;
    device_model_error_msg.value = "Please select device model";

    return;
  } else {
    device_model_error.value = false;
    device_model_error_msg.value = null;
  }

  btn_loading.value = true;
  $q.loadingBar.start();

  const data = {
    vehicle_no: vehicle_no,
    device_mac: device_mac,
    device_model: device_model.value,
  };

  await user
    .addNewVehicle(data)
    .then((res) => {
      btn_loading.value = false;
      $q.loadingBar.stop();

      togglePrompt();

      inputs.value[0].value = "";
      inputs.value[1].value = "";
      device_model.value = null;

      $q.notify({
        message: "New Vehicle added successfully",
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

const removeVehicle = (id, vehicle) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want remove " + vehicle + " vehicle",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    $q.loadingBar.start();
    await user
      .removeVehicle(id)
      .then((res) => {
        $q.loadingBar.stop();

        $q.notify({
          message: "Vehicle remove successfully",
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
  });
};
</script>
<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col-12 col-md-12">
        <q-card class="bg-dark text-white">
          <q-card-section>
            <div class="col text-h4">Vehicles</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="left">
            <q-btn flat @click="togglePrompt">Add New</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-lg">
      <div
        v-if="
          user.$state.user['vehicles'] == undefined ||
          user.$state.user['vehicles'].length == 0
        "
        class="col-12 col-md-12"
      >
        <q-banner dense rounded class="bg-info text-white text-center">
          No vehicles found
        </q-banner>
      </div>
      <div
        v-for="(vehicle, i) in user.$state.user.vehicles"
        :key="i"
        class="col-12 col-md-3 vehicle-card"
        @dblclick="removeVehicle(i, vehicle.vehicle_no)"
      >
        <q-card class="my-card bg-dark text-white">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Vehicle No</q-item-label>
                  <q-item-label caption class="text-grey-6">{{
                    vehicle.vehicle_no
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Device MAC</q-item-label>
                  <q-item-label caption class="text-grey-6">{{
                    vehicle.device_mac
                  }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Device Model</q-item-label>
                  <q-item-label caption class="text-grey-6">{{
                    vehicle.device_model
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
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
          <q-select
            outlined
            rounded
            hide-bottom-space
            color="blue-grey-6"
            label-color="dark"
            v-model="device_model"
            :options="['esp32', 'esp8266']"
            :error="device_model_error"
            :error-message="device_model_error_msg"
            label="Select device model"
          />
          <div class="column q-pt-sm">
            <AppButton
              type="button"
              label="Add Vehicle"
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

<style lang="scss">
.vehicle-card:hover {
  cursor: pointer;
}
</style>
