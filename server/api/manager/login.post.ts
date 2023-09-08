export default defineEventHandler(
  async (
    event
  ): Promise<{
    ok: boolean;
    data: {
      userInfo: Object;
    };
  } | null> => {
    // const { data } = await readBody(e);
    // console.log(data);
    // const result = await $fetch('https://www.baidu.com');

    //   return result;
    return null;
  }
);
