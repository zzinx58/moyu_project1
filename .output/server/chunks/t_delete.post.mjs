import { defineEventHandler, readBody, sendError, createError } from 'h3';
import { t as tournamentRepository } from './tournamentRepository.mjs';
import './client.mjs';
import '@prisma/client';

const t_delete_post = defineEventHandler(async (e) => {
  const { id: targetId } = await readBody(e);
  if (!targetId) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: "\u7F3A\u5C11\u67E5\u8BE2 id"
      })
    );
  }
  const specific_T = await tournamentRepository.deleteTournament({
    id: targetId
  });
  let stringItem = JSON.stringify(specific_T, (key, value) => {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  });
  let result = JSON.parse(stringItem);
  return result;
});

export { t_delete_post as default };
//# sourceMappingURL=t_delete.post.mjs.map
