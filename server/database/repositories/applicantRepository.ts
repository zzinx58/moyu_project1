import prisma, { main } from '../client';

export async function mainTest() {
  return await main();
}

export async function getAllApplicants() {
  return await prisma.tournament_apply_t.findMany();
}
