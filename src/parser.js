import { valid, invalid } from './valid';
import { Castle, Std } from './san';
import { KingSide, QueenSide } from './side';
import { Pos, Role, Pawn } from './pos';

export default function parseSan(san) {

  const moveRegex = /^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][1-8])(=?[NBQR]?)(\+?)(\#?)$/;
  
  if (san === 'O-O' || san === 'o-o' || san === '0-0') {
    return valid(new Castle(KingSide));
  }
  if (san === 'O-O-O' || san === 'o-o-o' || san === '0-0-0') {
    return valid(new Castle(QueenSide));
  }

  let match = san.match(moveRegex);

  if (!match) {
    return invalid(`Couldn't parse ${san}`);
  }

  let [_, role, file, rank, capture, pos, prom, check, mate] = match;

  let dest = Pos.fromKey(pos);

  if (pos) {
    return valid(new Std(
      dest,
      Role.forsyth(role) || Pawn,
      capture !== "",
      file,
      rank,
      prom,
      san
    ));
  }

  return invalid(`Invalid move ${san}`);
}

export function parseLine(line) {
  const blackMoveRegex = /^(\d*)\.\.\.$/;
  const whiteMoveRegex = /^(\d*)\.$/;

  let oneMove,
      ply,
      _moves = [];

  line.split(' ').forEach(next => {
    let match;
    if ((match = next.match(blackMoveRegex))) {
      ply = parseInt(match[0]) * 2;
      oneMove = [null];
    } else if ((match = next.match(whiteMoveRegex))) {
      ply = parseInt(match[0]) * 2 - 1;
      oneMove = [];
    } else {

      let { value, 
            invalid } = parseSan(next);

      if (invalid) {
        console.warn(invalid);
        oneMove.push(null);
      } else {
        oneMove.push({
          ply,
          move: value
        });
        ply++;
      }

      if (oneMove.length === 2) {
        _moves.push(oneMove);
        oneMove = [];
      }
    }
  });

  if (oneMove.length === 1) {
    _moves.push(oneMove);
  }
  
  return _moves;
}