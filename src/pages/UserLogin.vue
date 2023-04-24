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
    rules: [
      (val) => (val && val.length > 0) || "Please enter password",
      (val) =>
        (val && val.length >= 6) || "Password should be at least 6 characters",
    ],
    loading: false,
    autofocus: false,
    lazyRules: false,
    reactiveRules: true,
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
  inputs.value[0].loading = true;

  return new Promise((resolve) => {
    setTimeout(() => {
      user.emailCheck(val).then((e) => {
        resolve(e ? undefined : "No account found with this email");
      });

      inputs.value[0].loading = false;
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
  var username = inputs.value[0].value;
  var password = inputs.value[1].value;

  if (username.length < 1) {
    inputs.value[0].error = true;
    inputs.value[0].errorMessage = "Please enter username";

    return;
  }

  if (password.length < 1) {
    inputs.value[1].error = true;
    inputs.value[1].errorMessage = "Please enter password";

    return;
  }

  btn_loading.value = true;
  $q.loadingBar.start();

  await user
    .login(username, password)
    .then((res) => {
      btn_loading.value = false;
      $q.loadingBar.stop();
      router.push({ name: "home" });
    })
    .catch((error) => {
      btn_loading.value = false;
      $q.loadingBar.stop();

      if (error.code == "auth/wrong-password") {
        $q.notify({
          message: "Password invalid.Please try again",
          color: "warning",
          position: "top",
        });

        return;
      }

      $q.notify({
        message: error.message,
        color: "negative",
        position: "top",
      });
    });
};
</script>

<template>
  <q-page class="login-page q-pa-md">
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
              label="Login"
              color="dark"
              size="20px"
              :loading="btn_loading"
              @handleClick="submitForm"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="card-links q-pb-lg">
        Haven't account?
        <router-link class="text-light-blue-10" to="/register"
          >Register</router-link
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-card {
    max-width: 400px;
    width: 100%;
    background: white;

    .card-logo {
      text-align: center;
    }

    .card-links {
      text-align: center;
    }
  }
}
</style>
