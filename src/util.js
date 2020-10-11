import { brush } from './brush';

export const files = ['a', 'b', 'c', 'd', 'e' , 'f', 'g', 'h'];
export const ranks = ['1', '2', '3,', '4', '5', '6', '7', '8'];

export const allKeys = Array.prototype.concat(...files.map(c => ranks.map(r => c + r)));

export const pos2key = pos => allKeys[8 * pos[0] + pos[1]];

export const key2pos = k => [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];

export const black = 'black',
      white = 'white';

let colors = {
  'w': white,
  'b': black
};

let roles = {
  'k': 'king',
  'q': 'queen',
  'r': 'rook',
  'b': 'bishop',
  'n': 'knight',
  'p': 'pawn'
};

export function readFen({
  fen,
  shapes
}) {
  let [sPieces, sTurn, sCastles, sExtra] = fen.split(' ');

  let color = colors[sTurn];

  let pieces = sPieces.split('/').flatMap((sRow, row) => {
    row = 7 - row;
    let res = [];

    let col = 0;
    for (let char of sRow) {
      let role,
          color;
      if ((role = roles[char])) {
        color = black;
      } else if ((role = roles[char.toLowerCase()])) {
        color = white;
      }
      if (color) {
        res.push({
          pos: [col, row],
          key: pos2key([col, row]),
          role,
          color
        });
        col++;
      } else {
        col += parseInt(char);
      }
    }
    return res;
  });

  let sShapes = shapes.split(' ');

  shapes = sShapes.map(_ => {
    let [s1,s2] = _.split('-');

    return {
      orig: (_ => _)(s1),
      dest: (_ => _)(s2),
      brush
    };
  });
  

  return {
    pieces,
    color,
    shapes
  };
}

const posToTranslateBase = (pos, asWhite, xFactor, yFactor) => [
  (asWhite ? pos[0] : 7 - pos[0]) * xFactor,
  (asWhite ? 7 - pos[1] : pos[1]) * yFactor
];

export const fPosToTranslateAbs = bounds => {
  const xFactor = bounds.width / 8,
        yFactor = bounds.height / 8;

  return (pos, asWhite) =>
  posToTranslateBase(pos, asWhite, xFactor, yFactor);
};
