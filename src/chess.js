export function applyMove(board, sanMove) {

  let move = validMoves(board).find(_ => {

    if (sanMove.castle) {
      return _.castle && _.castle.side === sanMove.castle;
    }

    if (sanMove.origFile) {
      if (sanMove.origFile !== _.orig[0]) {
        return false;
      }
    }

    return _.dest === sanMove.dest &&
      _.role === sanMove.role;
  });

  if (!move) {
    console.warn(`Invalid move, ${sanMove.san}`);
    return null;
  }

  return move;
}
