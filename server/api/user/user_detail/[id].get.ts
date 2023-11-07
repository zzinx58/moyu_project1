import { api_map } from "../../../api-map";
const currentEnv = process.env.VITE_PROJECT_ENV;

// const apiForEnv =
//   currentEnv === "LOCAL"
//     ? api_map.dev.users.user_detail
//     : currentEnv === "FORMAL"
//     ? api_map.formal.users.user_detail
//     : "";
const apiForEnv =
  currentEnv === "HK_DEV"
    ? api_map.dev.baseurl + api_map.dev.users.user_detail
    : api_map.formal.baseurl + api_map.formal.users.user_detail;

export default defineEventHandler(async (event) => {
  const user_id = event.context.params?.id;
  const token = event.node.req.headers.authorization ?? "";

  const result = await $fetch(
    // `https://api.yicloud.vip/api/dashboard/users/${user_id}`,
    `${apiForEnv}${user_id}`,
    {
      method: "GET",
      headers: Object.fromEntries([["Authorization", token]]),
    }
  );
  return result;
});
