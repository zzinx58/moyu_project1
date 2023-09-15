export default defineNuxtRouteMiddleware((to, from) => {
  console.log("affected by global mid");
});
