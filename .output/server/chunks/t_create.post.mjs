import { defineEventHandler, readBody, sendError, createError } from 'h3';
import { p as prisma } from './client.mjs';
import '@prisma/client';

const t_create_post = defineEventHandler(async (e) => {
  const { id: updateTargetId, t_create_form } = await readBody(e);
  if (!t_create_form)
    return sendError(e, createError("\u8D5B\u4E8B\u521B\u5EFA\u8868\u5355\u4E0D\u53EF\u4E3A\u7A7A"));
  const { time_range } = t_create_form;
  let type_id_temp = t_create_form.type.id;
  let type_label_temp = t_create_form.type.label;
  let close_time_temp = BigInt(time_range[1]);
  let sub_name_temp = t_create_form.name;
  let name_temp = t_create_form.mode.label;
  let on_off_line_temp = t_create_form.mode.id;
  delete t_create_form.mode;
  t_create_form.apply_quota = +t_create_form.apply_quota;
  t_create_form.projects_detail = t_create_form.projects_detail.map(
    (itemA, index) => {
      if (itemA.project_id) {
        itemA.id = itemA.project_id;
        itemA.label = itemA.project_label;
        delete itemA.project_id;
        delete itemA.project_label;
      }
      itemA.reduction_limit = +itemA.reduction_limit;
      itemA.passline = +itemA.passline;
      itemA.rounds.detail.forEach((itemB) => {
        itemB.promotion_quota = +itemB.promotion_quota;
      });
      return itemA;
    }
  );
  const test5 = await prisma.tournament_t.upsert({
    where: {
      id: updateTargetId ? updateTargetId : 0
      // id: undefined,
    },
    create: {
      ...t_create_form,
      close_time: close_time_temp,
      sub_name: sub_name_temp,
      name: name_temp,
      on_off_line: on_off_line_temp,
      type: type_label_temp,
      type_id: type_id_temp
    },
    update: {
      ...t_create_form,
      close_time: close_time_temp,
      sub_name: sub_name_temp,
      name: name_temp,
      on_off_line: on_off_line_temp,
      type: type_label_temp,
      type_id: type_id_temp
    }
  });
  let stringItem = JSON.stringify(test5, (key, value) => {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  });
  let result_temp = JSON.parse(stringItem);
  console.log("test5:", result_temp);
  return "Operation Success!";
});

export { t_create_post as default };
//# sourceMappingURL=t_create.post.mjs.map
