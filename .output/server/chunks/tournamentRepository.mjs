import { p as prisma } from './client.mjs';

const tournamentRepository = {
  createTournament,
  deleteTournament,
  updateTournament,
  getAllTournaments,
  getUniqueTournament
};
async function createTournament(t_detail) {
  return await prisma.tournament_t.create({
    data: t_detail
  });
}
async function deleteTournament(t_detail) {
  return await prisma.tournament_t.delete({
    where: t_detail
  });
}
async function updateTournament(t_detail, updateData) {
  return await prisma.tournament_t.update({
    where: { id: t_detail.id },
    data: updateData
  });
}
async function getAllTournaments() {
  return await prisma.tournament_t.findMany();
}
async function getUniqueTournament(t_detail, selectReturnFields) {
  return await prisma.tournament_t.findUnique({
    where: t_detail,
    select: selectReturnFields
  });
}

export { tournamentRepository as t };
//# sourceMappingURL=tournamentRepository.mjs.map
