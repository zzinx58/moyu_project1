import prisma from "../../../database/client";
export type TResultType = {
  id: string;
  t_id: number;
  p_id: number;
  p_name: string;
  user_id: number;
  name: string;
  phase: number;
  r1_duration: number;
  r1_scramble: string;
  r2_duration: number;
  r2_scramble: string;
  r3_duration: number;
  r3_scramble: string;
  r4_duration: number;
  r4_scramble: string;
  r5_duration: number;
  r5_scramble: string;
  best_duration: number;
  avg: number;
  is_rise: number;
  record_id: number;
  cube_id: string;
  create_time: string;
  del_time: string;
  result: number;
  is_del: number;
  t_number: string;
  round_format: number;
};
export default defineEventHandler(async (e) => {
  const t_id = e.context.params?.t_id
    ? parseInt(e.context.params?.t_id)
    : undefined;
  // console.log(t_id);
  if (!t_id) {
    throw sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: "缺少查询 id",
        // message: 'asd',
      })
    );
  }

  const targetData = await prisma.tournament_result_t.findMany({
    where: {
      t_id: t_id,
    },
  });

  //   console.log(targetData);
  const result_temp = JSON.stringify(targetData, (key, value) => {
    if (typeof value === "bigint") return value.toString();
    return value;
  });
  const result = JSON.parse(result_temp);

  // return `request get: ${t_id}`;
  return result;
});
