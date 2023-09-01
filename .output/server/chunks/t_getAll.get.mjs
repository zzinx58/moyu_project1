import { defineEventHandler } from 'h3';
import { p as prisma } from './client.mjs';
import '@prisma/client';

const t_getAll_get = defineEventHandler(async (e) => {
  const t_list = await prisma.tournament_t.findMany();
  let result = t_list.map((item) => {
    let itemString = JSON.stringify(item, (key, value) => {
      if (typeof value === "bigint")
        return value.toString();
      return value;
    });
    return JSON.parse(itemString);
  });
  return result;
});

export { t_getAll_get as default };
//# sourceMappingURL=t_getAll.get.mjs.map
