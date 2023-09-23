import { useMessage } from "naive-ui";

const naiveMessage = useMessage();
export default defineNuxtRouteMiddleware((to, from) => {
  if (!to.matched.length) {
    alert("目标页面不存在，正在跳转至主页...");
    // naiveMessage.info("不存在");
    setTimeout(() => {
      return navigateTo("/t_list");
    }, 300);
  }
});
