export default defineEventHandler(async (e) => {
  // const result = $fetch('https://www.baidu.com');
  // console.log(result); //Promise<pending>
  const currentEnv = process.env.VITE_PROJECT_ENV;
  // console.log(currentEnv ?? 'FORMAL')
  console.log(currentEnv);
  return currentEnv ?? "FORMAL";
});
