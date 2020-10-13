import parseSan from '../parser';
import { KingSide, QueenSide } from '../side';

export default function() {

  let oo = parseSan("O-O");
  let ooo = parseSan("O-O-O");
  let e3 = parseSan("e3");
  let Nd4 = parseSan("Nd4");
  let Bb6C = parseSan("Bb6+");
  let kCastle = parseSan("O-O");
  let qCastle = parseSan("O-O-O");
  let Qxa8 = parseSan("Qxa8");
  let Rxb1C = parseSan("Rxb1+");

  valid(oo, _ => {
    eq('oo', _.side, KingSide);
  });

  valid(ooo, _ => {
    eq('ooo', _.side, QueenSide);
  });

  valid(e3, _ => {
    eq('e3 dest', _.dest.key, 'e3');
    eq('e3 role', _.role.roleString, 'pawn');
  });

  valid(Nd4, _ => {
    eq('Nd4 dest', _.dest.key, 'd4');
    eq('Nd4 role', _.role.roleString, 'knight');
  });

  valid(Bb6C, _ => {
    eq('Bb6C dest', _.dest.key, 'b6');
    eq('Bb6C role', _.role.roleString, 'bishop');
  });

  valid(Qxa8, _ => {
    eq('Qxa8 dest', _.dest.key, 'a8');
    eq('Qxa8 role', _.role.roleString, 'queen');
    eq('Qxa8 capture', _.capture, true);
  });

  valid(Rxb1C, _ => {
    eq('Rxb1C dest', _.dest.key, 'b1');
    eq('Rxb1C role', _.role.roleString, 'rook');
    eq('Rxb1C capture', _.capture, true);
  });
}

function valid(v, f) {
  if (v.invalid) {
    console.log('❌', v.invalid);
  } else f(v.value);
}

function eq(msg, a, b) {
  if (a !== b) {
    console.log('❌', msg);
  } else {
    console.log('✓', msg);
  }
}
