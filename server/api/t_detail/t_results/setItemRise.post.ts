import prisma from "../../../database/client";
export default defineEventHandler(async (event) => {
  const { item_user_id, p_id, t_id, phase_id, is_rise } = await readBody(event);
  if (item_user_id && p_id && t_id && phase_id) {
    const targetItem = await prisma.tournament_result_t.findFirst({
      where: {
        t_id: t_id,
        p_id: p_id,
        phase: phase_id,
        user_id: item_user_id,
      },
    });
    const result = await prisma.tournament_result_t.update({
      where: {
        // id: 0,
        id: targetItem?.id ?? 0,
      },
      data: {
        is_rise: is_rise === true ? 0 : 1,
      },
    });
    // console.log(result);

    // return result;
    return "更新成功";
  } else {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "| Lack of update target info",
      })
    );
  }
});
