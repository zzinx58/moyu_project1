import prisma from '../../database/client';
export default defineEventHandler(async (e) => {
  //读取Route Param载体，判空
  //读取不到 方法限制的原因？post？
  // let updateTargetId = getRouterParams(e).id;
  // let contextTest = e.context.params?.id
  //   ? parseInt(e.context.params.id)
  //   : undefined;
  // console.log(contextTest);
  const { id: updateTargetId, t_create_form } = await readBody(e);
  if (!t_create_form) return sendError(e, createError('赛事创建表单不可为空'));
  // console.log(updateTargetId);
  // console.log('raw_tcreateForm:', t_create_form);

  // let test = prisma.tournament_t.findMany();
  // let bigint2stringTest = (await test).map((item) => {
  //   let itemString = JSON.stringify(item, (key, value) => {
  //     if (typeof value === 'bigint') return value.toString();
  //     return value;
  //   });
  //   return itemString;
  // });
  // console.log(bigint2stringTest);
  // const test2 = JSON.parse(bigint2stringTest[0]) as tournament_t;
  // console.log(test2.apply_time_1);

  // const test3 = await prisma.tournament_t.update({
  //   where: {
  //     id: 1,
  //   },
  //   //apply_time_1:1688356800
  //   data: {
  //     ...t_create_form,
  //     close_time: BigInt(t_create_form.time_range[1]),
  //   },
  // });
  // console.log(test3);

  // const test6 = await prisma.tournament_t.create({
  //   data: {
  //     ...t_create_form,
  //     close_time: close_time_temp,
  //     sub_name: sub_name_temp,
  //     name: name_temp,
  //     on_off_line: on_off_line_temp,
  //     type: type_label_temp,
  //     type_id: type_id_temp,
  //   },
  // });
  // console.log(test6);

  const { time_range } = t_create_form;
  let type_id_temp = t_create_form.type.id;
  let type_label_temp = t_create_form.type.label;
  let close_time_temp = undefined;
  //Bug 点
  if (time_range) {
    close_time_temp = BigInt(time_range[1]);
  }
  let sub_name_temp = t_create_form.name;
  let name_temp = t_create_form.mode.label;
  let on_off_line_temp = t_create_form.mode.id;
  delete t_create_form.mode;
  // delete t_create_form.name;
  // delete t_create_form.type;
  //update use

  t_create_form.apply_quota = +t_create_form.apply_quota;
  t_create_form.projects_detail = t_create_form.projects_detail.map(
    (itemA: any, index: any) => {
      if (itemA.project_id) {
        itemA.id = itemA.project_id;
        itemA.label = itemA.project_label!;
        delete itemA.project_id;
        delete itemA.project_label;
      }
      itemA.reduction_limit = +itemA.reduction_limit;
      itemA.passline = +itemA.passline;
      itemA.rounds.detail.forEach((itemB: any) => {
        itemB.promotion_quota = +itemB.promotion_quota;
      });
      return itemA;
    }
  );

  let groups_temp_temp = t_create_form.projects_detail.map((item: any) => {
    return item.groups;
  });
  let groups_temp = [...new Set(groups_temp_temp.flat())].join('、');
  // console.log(groups_temp);
  let projects_temp = t_create_form.projects_detail
    .map((item: any) => {
      return item.label;
    })
    .join('、');
  // console.log(projects_temp);

  // console.log('t_create_form', t_create_form);

  const test5 = await prisma.tournament_t.upsert({
    where: {
      id: updateTargetId ? updateTargetId : 0,
      // id: undefined,
    },
    create: {
      ...t_create_form,
      close_time: close_time_temp,
      sub_name: sub_name_temp,
      name: name_temp,
      on_off_line: on_off_line_temp,
      type: type_label_temp,
      type_id: type_id_temp,
      groups: groups_temp,
      projects: projects_temp,
    },
    update: {
      ...t_create_form,
      close_time: close_time_temp,
      sub_name: sub_name_temp,
      name: name_temp,
      on_off_line: on_off_line_temp,
      type: type_label_temp,
      type_id: type_id_temp,
      groups: groups_temp,
      projects: projects_temp,
    },
  });

  // console.log(t_create_form.project_detail);
  let stringItem = JSON.stringify(test5, (key, value) => {
    if (typeof value === 'bigint') return value.toString();
    return value;
  });
  let result_temp = JSON.parse(stringItem);
  // console.log('test5:', result_temp);

  return 'Operation Success!';
});
