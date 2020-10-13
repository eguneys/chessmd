import Board from './board';
import Actor from './actor';

export default function Situation(board, color) {

  this.board = board;
  this.color = color;
  
  let actors = board.actorsOf(color);

  const validMoves = () => {
    let res = {};
    actors.forEach(_ => {
      let moves = _.psuedoValidMoves();

      if (moves.length > 0) {
        res[_.pos.key] = moves;
      }
    });
  };
}

Situation.apply = () =>
new Situation(Board.initial(), 'white');
