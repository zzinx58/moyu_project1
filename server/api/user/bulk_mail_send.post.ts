import { api_map } from "../../api-map";
const currentEnv = process.env.VITE_PROJECT_ENV;
const apiForEnv =
  (currentEnv === "HK_DEV" ? api_map.dev.baseurl : api_map.formal.baseurl) +
  api_map.dev.users.bulk_mail_send;

export default defineEventHandler(async (event) => {
  const { data } = await readBody(event);
  const token = event.node.req.headers.authorization ?? "";
  const result = (await $fetch(apiForEnv, {
    method: "POST",
    body: data,
    headers: {
      Authorization: token,
    },
  })) as any;
  switch (result.code) {
    case 200:
      return "邮件发送成功";
    default:
      return "邮件发送失败";
  }
  return "get";
});
