import prisma from "../../../database/client";
export interface ApplicantType {
  id: number;
  t_id: number;
  p_id: number;
  p_name: string;
  user_id: number;
  name: string;
  identity_card: string;
  tel: string;
  gender: string;
  region_id: number;
  region: string;
  wca_id: string;
  apply_time: string;
  verify: number;
  verify_time: string;
  t_number: number;
}
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

  const targetData = await prisma.tournament_apply_t.findMany({
    where: {
      t_id: t_id,
    },
  });

  // console.log(targetData);
  const result_temp = JSON.stringify(targetData, (key, value) => {
    if (typeof value === "bigint") return value.toString();
    return value;
  });
  const result = JSON.parse(result_temp);
  // console.log(result);

  // return `request get: ${t_id}`;
  return result;
});
