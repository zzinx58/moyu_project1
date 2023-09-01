import tournamentRepository from '../../database/repositories/tournamentRepository';
import prisma from '../../database/client';
export default defineEventHandler(async (e) => {
  const { id: targetId } = await readBody(e);
  if (!targetId) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: '缺少查询 id',
      })
    );
  }
  // const specific_T = await prisma.tournament_t.delete({
  //   where: {
  //     id: targetId,
  //   },
  // });
  // console.log(targetId);
  // const specific_T = await prisma.tournament_t.findUnique({
  //   where: {
  //     id: targetId,
  //   },
  // });

  const specific_T = await tournamentRepository.deleteTournament({
    id: targetId,
  });
  let stringItem = JSON.stringify(specific_T, (key, value) => {
    if (typeof value === 'bigint') return value.toString();
    return value;
  });
  let result = JSON.parse(stringItem);
  return result;
});
