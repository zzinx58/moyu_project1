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
    ? api_map.dev.baseurl + api_map.dev.users.list
    : api_map.formal.baseurl + api_map.formal.users.list;

export default defineEventHandler(async (event) => {
  // Item of headers will be much easier to get from the below function.
  const token = event.node.req.headers.authorization ?? "";
  // const eventRawHeaders = event.node.req.rawHeaders as Array<string>;
  // console.log(eventRawHeaders);
  // const headersAuthorizationIndex = eventRawHeaders.findIndex(
  //   (item) => item === "authorization"
  // );
  // const token =
  // "SFMyNTY.g2gDdAAAAANkAAhhZG1pbl9pZGEDZAAFcm9sZXNqZAAEdHlwZWQACGV4dGVybmFsbgYA5PSCHosBYgABUYA.a82hOdHnKu15J_Sdwm_IdsVy3VX5hgCHgQP6Arf97Qg";
  // const token = eventRawHeaders[headersAuthorizationIndex + 1] ?? "";
  const queryParams = getQuery(event);
  // console.log(getQuery(event));

  const result = (await $fetch(
    // "https://api.yicloud.vip/api/dashboard/users/list",
    apiForEnv,
    {
      method: "get",
      headers: Object.fromEntries([["Authorization", token]]),
      query: queryParams,
    }
  )) as any;

  return result;
  return [];
});
