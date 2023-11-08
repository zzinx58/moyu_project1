// export default defineEventHandler(
//   async (
//     event
//   ): Promise<{
//     ok: boolean;
//     data: {
//       userInfo: Object;
//     };
//   } | null> => {
//     // const { data } = await readBody(e);
//     // console.log(data);
//     // const result = await $fetch('https://www.baidu.com');

//     //   return result;
//     return null;
//   }
// );
import { api_map } from "../../api-map";
const currentEnv = process.env.VITE_PROJECT_ENV;

// const apiForEnv =
//   currentEnv === "LOCAL"
//     ? api_map.dev.users.user_detail
//     : currentEnv === "FORMAL"
//     ? api_map.formal.users.user_detail
//     : "";
const apiForEnv =
  currentEnv === "HK_DEV"
    ? api_map.dev.baseurl + api_map.dev.admin.signin
    : api_map.formal.baseurl + api_map.formal.admin.signin;
console.log(apiForEnv);
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);
  // const result = await $fetch("https://api.yicloud.vip/api/admins/login", {
  const result = await $fetch(apiForEnv, {
    method: "post",
    body: {
      username,
      password,
    },
  });
  // console.log(result);
  return result;
});
