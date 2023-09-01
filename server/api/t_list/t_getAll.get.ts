import prisma from '../../database/client';

export default defineEventHandler(async (e) => {
  const t_list = await prisma.tournament_t.findMany();
  let result = t_list.map((item) => {
    let itemString = JSON.stringify(item, (key, value) => {
      if (typeof value === 'bigint') return value.toString();
      return value;
    });
    return JSON.parse(itemString);
  });
  return result;
});
