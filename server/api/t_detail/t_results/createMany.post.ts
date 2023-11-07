import prisma from "../../../database/client";
import * as xlsx from "xlsx";

export default defineEventHandler(async (e) => {
  // const bodyPayload = await readBody(e);
  const { data: uploadExcelDataArr } = await readBody(e);
  if (!uploadExcelDataArr) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        // Please prefer using message for longer error messages instead of statusMessage. In the future, statusMessage will be sanitized by default.
        // message: '赛事id 或 表单数据不可为空',
        // statusMessage: '赛事id 或 表单数据不可为空',
        // statusText: '赛事id 或 表单数据不可为空',
        statusText: "id and data could not be null",
        statusMessage: "id and data could not be null - statusMessage",
        message: "id and data could not be null - message",
      })
    );
  }
  // console.log(uploadExcelDataArr);

  let result = await prisma.tournament_result_t.createMany({
    data: uploadExcelDataArr,
    skipDuplicates: true,
  });
  // console.log("enter applicant's result:", result);

  // console.log(t_id, excelJson);
  //   if (!t_create_form) return sendError(e, createError('赛事创建表单不可为空'));
  if (result.count > 0) {
    // return "操作完成";
    return 1;
  } else {
    // return "操作失败";
    return 0;
  }
});
