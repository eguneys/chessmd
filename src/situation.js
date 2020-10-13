import Board from './board';
import Actor from './actor';

export default function Situation(board, color) {

  this.board = board;
  this.color = color;
  
  let actors = board.actorsOf(color);
}

Situation.apply = () =>
new Situation(Board.initial(), 'white');
