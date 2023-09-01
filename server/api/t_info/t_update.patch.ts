import prisma from '../../database/client';
import tournamentRepository from '../../database/repositories/tournamentRepository';

export default defineEventHandler(async (e) => {
  const { id, data } = await readBody(e);
  const targetId = id;
  const updateData = data;
  if (!targetId) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        message: '缺少查询 id',
      })
    );
  }

  if (!updateData) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        message: '缺少更新数据主体',
      })
    );
  }

  let result_specific_T = await tournamentRepository.updateTournament(
    {
      id: targetId,
    },
    updateData
  );
  let stringItem = JSON.stringify(result_specific_T, (key, value) => {
    if (typeof value === 'bigint') return value.toString();
    return value;
  });
  let result = JSON.parse(stringItem);

  return { data: result };
});
