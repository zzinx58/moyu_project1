import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as xlsx from 'xlsx';

export default prisma;

async function main() {
  // const test2 = await prisma.tournament_apply_t.groupBy({
  //   by: ['user_id'],
  // });
  // console.log(test2);
  const test3 = await prisma.tournament_apply_t.findMany({
    select: {
      p_name: true,
      user_id: true,
      name: true,
    },
    // distinct: ['name', ],
  });
  console.log(test3);
  // const test4 = await prisma.tournament_result_t.findMany({
  //   select: {
  //     name: true,
  //     p_name: true,
  //   },
  // });
  // console.log(test4);
  // const test5  = await prisma.tournament_result_t.groupBy()
  // const test6 = await prisma.tournament_apply_t.createMany({
  //   data: [
  //     {
  //       t_id: 2,
  //       t_number: 58,
  //       p_id: 1,
  //       p_name: '三阶',
  //       user_id: 585858,
  //       name: 'zzx58',
  //     },
  //   ],
  //   skipDuplicates: true,
  // });
  // console.log(test6);
  // const testData = [
  //   {
  //     t_id: 2,
  //     t_number: 58,
  //     p_id: 1,
  //     p_name: '三阶',
  //     user_id: 585858,
  //     name: 'zzx58',
  //   },
  // ];
  // function exportExcelFile(array: any[], sheetName: string, fileName: string) {
  //   const jsonWorkSheet = xlsx.utils.json_to_sheet(array);
  //   const workBook: xlsx.WorkBook = {
  //     SheetNames: [sheetName],
  //     Sheets: {
  //       [sheetName]: jsonWorkSheet,
  //     },
  //   };
  //   return xlsx.writeFile(workBook, fileName);
  // }
  // exportExcelFile(testData, 'zzx58', 'test1.xlsx');
  // xlsx.utils.json_to_sheet
}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
