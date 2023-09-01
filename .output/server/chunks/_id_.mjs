import { defineEventHandler, sendError, createError } from 'h3';
import { p as prisma } from './client.mjs';
import '@prisma/client';

const _id_ = defineEventHandler(async (e) => {
  var _a;
  const targetId = ((_a = e.context.params) == null ? void 0 : _a.id) ? parseInt(e.context.params.id) : void 0;
  if (!targetId) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: "\u7F3A\u5C11\u67E5\u8BE2 id"
      })
    );
  }
  const specific_T = await prisma.tournament_t.findUnique({
    where: {
      id: targetId
    }
  });
  let stringItem = JSON.stringify(specific_T, (key, value) => {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  });
  let result_temp = JSON.parse(stringItem);
  let type_temp = {
    id: result_temp.type_id,
    label: result_temp.type
  };
  let mode_temp;
  if (result_temp.on_off_line === 1) {
    mode_temp = {
      id: 1,
      label: "\u7EBF\u4E0B\u8D5B"
    };
  }
  if (result_temp.on_off_line === 2) {
    mode_temp = {
      id: 2,
      label: "\u7EBF\u4E0A\u8D5B"
    };
  }
  result_temp["mode"] = mode_temp;
  result_temp["type"] = type_temp;
  result_temp["name"] = result_temp.sub_name;
  const result = result_temp;
  return result;
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
