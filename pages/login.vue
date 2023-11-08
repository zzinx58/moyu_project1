<script setup lang="ts">
import { FormInst, messageDark, useMessage } from "naive-ui";
import { useUserStore } from "@/stores/user";

definePageMeta({
  layout: "blank",
});
useHead({
  title: "Login - 登录",
});

const loginFormRef = ref<FormInst | null>(null);
const loginFormValue = ref({
  username: "",
  password: "",
});

const naiveMessage = useMessage();

const loginFormRules = {
  username: {
    required: true,
    message: "请输入用户名",
    trigger: "blur",
  },
  password: {
    required: true,
    message: "请输入密码",
    trigger: "blur",
  },
};

const userStore = useUserStore();

const route = useRoute();

const handleValidateClick = (e: MouseEvent) => {
  //Why?
  e.preventDefault();
  loginFormRef.value?.validate(async (errors) => {
    // if (!errors) {
    //   naiveMessage.success("表单验证通过");

    //   const { data, error, refresh, pending, status } = await useFetch(
    //     "/api_cors/admins/login",
    //     {
    //       method: "post",
    //       body: loginFormValue.value,
    //     }
    //   );
    //   console.log(
    //     `output->data.value`,
    //     data.value,
    //     "error.value:",
    //     error.value,
    //     "pending.value:",
    //     pending.value,
    //     "status.value",
    //     status.value,
    //     "error.value?.statusMessage:",
    //     error.value?.statusMessage,
    //     "error.value?.statusText:",
    //     error.value?.statusText,
    //     "error.value?.data:",
    //     error.value?.data
    //   );

    if (!errors) {
      naiveMessage.success("表单验证通过");
      const { ok, data, message } = await userStore.login(loginFormValue.value);
      if (ok) {
        naiveMessage.success(`${message},正在跳转...`);
        // 不需要 data.value
        // console.log(`output->data.value`, data);
        // console.log(`output->userStore.userInfo`, userStore.$state);
        setTimeout(() => {
          // navigateTo("/t_list");
          navigateTo(`${(route.query.callback ??= "/")}`);
        }, 1000);
      } else {
        naiveMessage.error(`登录失败, ${message}.`);
      }
    } else {
      naiveMessage.error("表单验证不通过");
    }
  });
};
// const projectEnv =
//   import.meta.env.VITE_PROJECT_ENV ??
//   //  "ENV_UNSET";
//   "FORMAL";

const projectInfo = await $fetch("/api/project-info");
// console.log(projectInfo);
const projectENV = projectInfo;
</script>

<template>
  <div class="bg-white w-400px rounded-lg shadow-lg p-8">
    <div class="absolute right-2 top-1 text-#6F6F8B">{{ projectENV }}</div>
    <div class="i-custom-svg:nav-logo w-98px h-57px bg-black" />
    <div id="login" class="mt-16 text-24px mb-32">
      <div class="text-center mb-10 grid gap-6">
        <div>魔域赛事后台管理平台</div>
        <div class="text-18px">欢迎登陆!</div>
      </div>
      <div class="mt-6">
        <n-form
          class="items-center"
          ref="loginFormRef"
          :model="loginFormValue"
          :rules="loginFormRules"
        >
          <n-form-item label="用户名:" path="username">
            <n-input
              v-model:value="loginFormValue.username"
              placeholder="请输入用户名"
              clearable
            ></n-input>
          </n-form-item>
          <n-form-item label="密码:" path="password">
            <n-input
              v-model:value="loginFormValue.password"
              type="password"
              clearable
              placeholder="请输入密码"
            ></n-input>
          </n-form-item>
          <n-button
            type="primary"
            block
            attr-type="button"
            @click="handleValidateClick"
            >登陆</n-button
          >
        </n-form>
      </div>
    </div>
  </div>
  <!-- <pre>Callback Token:{{ userStore.token }}</pre> -->
  <div @click="userStore.logout()">logout</div>
</template>

<style lang="scss" scoped>
// .zzx-text-warp {
//   text-wrap: balance;
// }
</style>
