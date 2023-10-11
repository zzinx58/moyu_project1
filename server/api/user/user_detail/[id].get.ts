export default defineEventHandler(async (event) => {
  const user_id = event.context.params?.id;
  const token = event.node.req.headers.authorization ?? "";

  const result = await $fetch(
    `https://api.yicloud.vip/api/dashboard/users/${user_id}`,
    {
      method: "GET",
      headers: Object.fromEntries([["Authorization", token]]),
    }
  );
  return result;
});
