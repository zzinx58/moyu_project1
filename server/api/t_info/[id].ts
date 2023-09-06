import prisma from '../../database/client';

export default defineEventHandler(async (e) => {
  const targetId = e.context.params?.id
    ? parseInt(e.context.params.id)
    : undefined;
  if (!targetId) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: '缺少查询 id',
      })
    );
  }

  const specific_T = await prisma.tournament_t.findUnique({
    where: {
      id: targetId,
    },
  });
  let stringItem = JSON.stringify(specific_T, (key, value) => {
    if (typeof value === 'bigint') return value.toString();
    return value;
  });
  let result_temp = JSON.parse(stringItem);
  // console.log('id-result-temp:', result_temp);

  let type_temp = {
    id: result_temp.type_id,
    label: result_temp.type,
  };

  let mode_temp;
  if (result_temp.on_off_line === 1) {
    mode_temp = {
      id: 1,
      label: '线下赛',
    };
  }
  if (result_temp.on_off_line === 2) {
    mode_temp = {
      id: 2,
      label: '线上赛',
    };
  }

  result_temp['mode'] = mode_temp;
  result_temp['type'] = type_temp;
  result_temp['name'] = result_temp.sub_name;

  if (!result_temp['banner']) {
    result_temp['banner'] = {
      name: 'zzx58',
      url: 'https://p9-passport.byteacctimg.com/img/user-avatar/59296777f828ae4101819744e0ef154c~64x64.awebp',
      uploadApiUrl: '',
    };
  }

  const result = result_temp;

  return result;
});
