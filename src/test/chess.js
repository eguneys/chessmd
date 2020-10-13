import { parseSan } from '../parser';
import Situation from '../situation';
import { KingSide } from '../side';

export default function() {

  let situation, fen, board, moves;

  //console.log(Pos.A1.right());

  // board = Board.initial();
  // let rt = KingSide.tripToRook(board.kingPosOf('white'), board);


  situation = Situation.apply();
  let moveD4 = parseSan('d4')
    .value
      .move(situation)
      .value;

  situation = moveD4.situationAfter();

  let moveE5 = parseSan('e5').value.move(situation)
      .value;

  situation = moveE5.situationAfter();

  let moveD5 = parseSan('d5').value.move(situation).invalid;

  // pawn

  fen = '8/8/8/3P4/8/8/8/8 w - - 0 1';


  // long range

  fen = '8/8/8/3q4/8/8/8/8 w - - 0 1';
  
}
