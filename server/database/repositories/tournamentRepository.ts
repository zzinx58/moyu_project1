import prisma from '../client';
import type { tournament_t, Prisma } from '@prisma/client';

type Tournament_Partial = Partial<tournament_t>;
type Tournament_WithoutID = Omit<tournament_t, 'id'>;
type Tournament_Partial_WithRequiredID = Tournament_Partial & { id: number };
type Tournament_AtLeast_OneProperty<T> = keyof T extends never ? never : T;

export default {
  createTournament,
  deleteTournament,
  updateTournament,
  getAllTournaments,
  getUniqueTournament,
};
async function createTournament(t_detail: Prisma.tournament_tCreateInput) {
  return await prisma.tournament_t.create({
    data: t_detail,
  });
}

async function deleteTournament(t_detail: Prisma.tournament_tWhereUniqueInput) {
  return await prisma.tournament_t.delete({
    where: t_detail,
  });
}

async function updateTournament(
  t_detail: Prisma.tournament_tWhereUniqueInput,
  // updateData: Tournament_Partial
  updateData: any
) {
  return await prisma.tournament_t.update({
    where: { id: t_detail.id },
    data: updateData,
  });
}

async function getAllTournaments() {
  return await prisma.tournament_t.findMany();
}

async function getUniqueTournament(
  t_detail: Prisma.tournament_tWhereUniqueInput,
  selectReturnFields?: Prisma.tournament_tSelect
) {
  return await prisma.tournament_t.findUnique({
    where: t_detail,
    select: selectReturnFields,
  });
}

//T extends object might be not necessery
//Use -? to make sure fields are not optional
// function Util_getSpecificFields<T extends object>(targetObj: T) {
//   const queryObj = {} as { [K in keyof T]-?: T[K] };
//   //   const queryObj = {}
//   for (let key in targetObj) {
//     if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
//       let value = targetObj[key];
//       if (~!!value) {
//         queryObj[key] = value as T[typeof key];
//       }
//     }
//   }
//   return queryObj;
// }

// (async function main() {
// const test2 = await createTournament({ name: '321', on_off_line: 1 });
// console.log(test2);
// const test3 = await deleteTournament({ id: 3 });
// console.log(test3);
// const test4 = await updateTournament({ id: 2 }, { name: 'updatedT' });
// console.log(test4);
// const test0 = await getAllTournaments();
// console.log(test0);
// const test1 = await getUniqueTournament({ id: 1 });
// console.log(test1);
// })();
