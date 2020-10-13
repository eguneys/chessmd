import Board from '../board';
import { validMoves } from '../chess';
import { KingSide } from '../side';

export default function() {

  let fen, board, moves;

  //console.log(Pos.A1.right());

  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
  board = Board.fromFen(fen);
  let rt = KingSide.tripToRook(board.kingPosOf('white'), board);

  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // pawn

  fen = '8/8/8/3P4/8/8/8/8 w - - 0 1';


  // long range

  fen = '8/8/8/3q4/8/8/8/8 w - - 0 1';
  
}
