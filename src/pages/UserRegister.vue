<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

import AppInput from "../components/AppInput.vue";
import AppButton from "../components/AppButton.vue";

import { useUserStore } from "../stores/useUserStore";

const $q = useQuasar();

const router = useRouter();

const user = useUserStore();

const btn_loading = ref(false);

const inputs = ref([
  {
    label: "Full Name",
    name: "full_name",
    type: "text",
    autocomplete: "off",
    value: "",
    col: 12,
    rules: [
      (val) => (val && val.length > 0) || "Please enter full name",
      (val) => /^[a-zA-Z_ ]*$/.test(val) || "Please enter valid full name",
    ],
    loading: false,
    ref: null,
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
    label: "Email",
    name: "email",
    type: "email",
    autocomplete: "off",
    value: "",
    col: 6,
    rules: [
      (val) => (val && val.length > 0) || "Please enter email",
      (val) =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          val
        ) || "Please enter valid email",
      (val) => validateEmail(val),
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
  {
    label: "Password",
    name: "password",
    type: "password",
    autocomplete: "on",
    value: "",
    col: 6,
    rules: [
      (val) => (val && val.length > 0) || "Please enter password",
      (val) =>
        (val && val.length >= 6) || "Password should be at least 6 characters",
    ],
    loading: false,
    autofocus: false,
    lazyRules: false,
    reactiveRules: false,
    error: false,
    errorMessage: null,
    clearable: false,
    icon: true,
    iconSlot: "append",
    iconType: "event",
    iconName: "visibility",
    iconColor: null,
  },
  {
    label: "Confirm Password",
    name: "con_password",
    type: "password",
    autocomplete: "on",
    value: "",
    col: 6,
    rules: [
      (val) => (val && val.length > 0) || "Please enter confirm password",
      (val) => val === inputs.value[2].value || "Password are not match",
    ],
    loading: false,
    autofocus: false,
    lazyRules: false,
    reactiveRules: false,
    error: false,
    errorMessage: null,
    clearable: false,
    icon: true,
    iconSlot: "append",
    iconType: "event",
    iconName: "visibility",
    iconColor: "dark-1",
  },
]);

const validateEmail = (val) => {
  inputs.value[1].loading = true;

  return new Promise((resolve) => {
    setTimeout(() => {
      user.emailCheck(val).then((e) => {
        resolve(e ? "Email already exists" : undefined);
      });

      inputs.value[1].loading = false;
    }, 500);
  });
};

const iconClick = (i, name, type) => {
  if ((name == "password" || name == "con_password") && type == "password") {
    inputs.value[i].type = "text";
    inputs.value[i].iconName = "visibility_off";
  }

  if ((name == "password" || name == "con_password") && type == "text") {
    inputs.value[i].type = "password";
    inputs.value[i].iconName = "visibility";
  }
};

const submitForm = async () => {
  var full_name = inputs.value[0].value.trim();
  var email = inputs.value[1].value.trim();
  var password = inputs.value[2].value.trim();
  var con_password = inputs.value[3].value.trim();

  if (full_name.length < 1) {
    inputs.value[0].error = true;
    inputs.value[0].errorMessage = "Please enter full name";

    return;
  }

  if (email.length < 1) {
    inputs.value[1].error = true;
    inputs.value[1].errorMessage = "Please enter email";

    return;
  }

  if (password.length < 1) {
    inputs.value[2].error = true;
    inputs.value[2].errorMessage = "Please enter password";

    return;
  }

  if (con_password.length < 1) {
    inputs.value[3].error = true;
    inputs.value[3].errorMessage = "Please enter confirm password";

    return;
  }

  btn_loading.value = true;
  $q.loadingBar.start();

  var data = {
    full_name: full_name,
    email: email,
    password: password,
  };

  await user
    .register(data)
    .then((res) => {
      btn_loading.value = false;
      $q.loadingBar.stop();

      $q.dialog({
        title: "Alert",
        color: "positive",
        message: "Registration success.use email and password to login",
      }).onDismiss(() => {
        router.push({ name: "login" });
      });
    })
    .catch((error) => {
      btn_loading.value = false;
      $q.loadingBar.stop();

      $q.notify({
        message: error.message,
        color: "negative",
        position: "top-right",
      });
    });
};
</script>

<template>
  <q-page class="register-page q-pa-md">
    <q-card class="login-card q-pa-sm shadow-24">
      <q-card-section class="card-logo">
        <q-img src="~assets/logo.png" width="150px"></q-img>
      </q-card-section>
      <q-card-section>
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
              label="Register"
              color="dark"
              size="20px"
              :loading="btn_loading"
              @handleClick="submitForm"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="card-links q-pb-lg">
        Already have account?
        <router-link class="text-light-blue-10" to="/login">Login</router-link>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss" scoped>
.register-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-card {
    max-width: 500px;
    width: 100%;

    .card-logo {
      text-align: center;
    }

    .card-links {
      text-align: center;
    }
  }
}
</style>
