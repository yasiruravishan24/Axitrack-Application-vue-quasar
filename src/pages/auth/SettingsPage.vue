<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

import { useUserStore } from "../../stores/useUserStore";

import AppButton from "../../components/AppButton.vue";
import AppInput from "../../components/AppInput.vue";

const $q = useQuasar();

const user = useUserStore();

const prompt = ref(false);

const btn_loading = ref(false);

const emergency_contacts = ref([
  {
    key: "police",
    icon: "local_police",
    label: "Police",
  },
  {
    key: "hospital",
    icon: "local_hospital",
    label: "Hospital",
  },
  {
    key: "ambulance",
    icon: "ambulance",
    label: "Ambulance",
  },
]);

const inputs = ref([
  {
    label: "Police",
    name: "police",
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
    label: "Hospital",
    name: "hospital",
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
    label: "Ambulance",
    name: "ambulance",
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
  var police = inputs.value[0].value;
  var hospital = inputs.value[1].value;
  var ambulance = inputs.value[2].value;

  btn_loading.value = true;
  $q.loadingBar.start();

  const data = {
    police: police,
    hospital: hospital,
    ambulance: ambulance,
  };

  await user
    .updateEmergencyContact(data)
    .then((res) => {
      btn_loading.value = false;
      $q.loadingBar.stop();

      togglePrompt();

      inputs.value[0].value = "";
      inputs.value[1].value = "";
      inputs.value[2].value = "";

      $q.notify({
        message: "Emergency Contact update successfully",
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
        <q-card class="bg-dark text-white">
          <q-card-section>
            <div class="col text-h4">Settings</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Emergency Contacts</div>
          </q-card-section>
          <q-card-section>
            <div class="text-caption">
              <q-list dense>
                <q-item
                  v-for="(emergency_contact, i) in emergency_contacts"
                  :key="i"
                  class="q-pa-none"
                >
                  <q-item-section side
                    >{{ emergency_contact.label }} :
                  </q-item-section>
                  <q-item-section>{{
                      user.$state.user[emergency_contact.key]
                  }}</q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat @click="togglePrompt">Edit</q-btn>
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

<style lang="scss">
.notification-card:hover {
  cursor: pointer;
}
</style>
