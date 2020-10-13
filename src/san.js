import { valid, invalid } from './valid';
import { objForeach } from './outil';
import { Pos } from './pos';
import Actor from './actor';

export function Std(
  dest,
  role,
  capture,
  file,
  rank,
  promotion,
  san) {
  
  this.san = san;
  this.dest = dest;
  this.role = role;
  this.capture = capture;
  this.file = file;
  this.rank = rank;
  this.promotion = promotion;
  

  this.move = (situation) => {

    let res = null;

    objForeach(situation.board.pieces, (pos, piece) => {
      if (res) {
        return;
      }
      if (piece.color === situation.color && piece.role === role.roleString) {
        let a = new Actor(piece, Pos.fromKey(pos), situation.board);
        res = a.pseudoValidMoves().find(m => 
          m.dest.key === dest.key
        );
      }
    });

    if (!res) {
      return invalid(`No move found: ${san}`);
    }

    return valid(res);
  };

}

export function Castle(side) {
  this.side = side;
}
