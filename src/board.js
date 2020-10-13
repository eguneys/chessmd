import { objMap, partition } from './outil';
import * as util from './util';
import { Pos } from './pos';
import Actor from './actor';

export default function Board(pieces, color) {

  this.actorsOf = () => {
    let [white, black] = 
        partition(
          Object.values(this.actors),
          _ => _.color === 'white');

    return {
      white,
      black
    };
  };

  let opponent = () => color === 'white' ? 'black' : 'white';

  this.kingPosOf = (color) => {
    let res = Object.keys(pieces)
    .find(_ => {
      let piece = pieces[_];
      return piece.color === color &&
        piece.role === 'king';
    });
    return Pos.fromKey[res];
  };

  this.color = color;
  this.pieces = pieces;

  this.actors = objMap(pieces, (pos, piece) => {
    return { 
      [pos]: new Actor(piece, Pos.fromKey(pos), this) };
  });
}

Board.initial = () =>
Board.fromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

Board.fromFen = (fen) => {
  let { pieces, color } = util.readFen(fen);
  return new Board(pieces, color);
};
