export default defineEventHandler(async (e) => {
  const result = $fetch('https://www.baidu.com');
  console.log(result); //Promise<pending>

  return result;
});
