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
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);
  const result = await $fetch("https://api.yicloud.vip/api/admins/login", {
    method: "post",
    body: {
      username,
      password,
    },
  });
  // console.log(result);
  return result;
});
