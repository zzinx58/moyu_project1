import { defineEventHandler, readBody, sendError, createError } from 'h3';
import { t as tournamentRepository } from './tournamentRepository.mjs';
import './client.mjs';
import '@prisma/client';

const t_update_patch = defineEventHandler(async (e) => {
  const { id, data } = await readBody(e);
  const targetId = id;
  const updateData = data;
  if (!targetId) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u67E5\u8BE2 id"
      })
    );
  }
  if (!updateData) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u66F4\u65B0\u6570\u636E\u4E3B\u4F53"
      })
    );
  }
  let result_specific_T = await tournamentRepository.updateTournament(
    {
      id: targetId
    },
    updateData
  );
  let stringItem = JSON.stringify(result_specific_T, (key, value) => {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  });
  let result = JSON.parse(stringItem);
  return { data: result };
});

export { t_update_patch as default };
//# sourceMappingURL=t_update.patch.mjs.map
