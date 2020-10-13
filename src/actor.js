import { Pos, 
         King,
         Queen,
         Bishop,
         Knight,
         Pawn,
         Rook } from './pos';

import { KingSide, QueenSide } from './side';

export default function Actor(piece, pos, board) {
  let color = piece.color;

  this.color = color;
  this.pos = pos;
  this.pseudoValidMoves = pseudoValidMoves;

  function pseudoValidMoves() {
    let res = [];

    switch (piece.role) {
    case 'pawn':
      let next = pawnDir()(pos);
      let fwd = next;
      function capture(horizontal) {
        let p = horizontal(next);
        if (!p) {
          return p;
        }
        if (!board.pieces[p.key] ||
            board.pieces[p.key].color === color) {
          return null;
        }
        return p;
      }
      let p2 = pawnDir()(fwd);

      res.push([
        fwd || [],
        p2 || [],
        capture(_ => _.left()) || [],
        capture(_ => _.right()) || [],
      ].flat());
      break;
    case 'king':
      res.push(shortRange(King.dirs));
      res.push(castle);
      break;
    case 'knight':
      res.push(shortRange(Knight.dirs));
      break;
    case 'bishop':
      res.push(longRange(Bishop.dirs));
      break;
    case 'rook':
      res.push(longRange(Rook.dirs));
      break;
    case 'queen':
      res.push(longRange(Queen.dirs));
      break;
    }

    return res.flatMap(_ =>
      _.map(_ => ({
        orig: pos,
        dest: _,
        castle: _.castle,
        role: piece.role
      }))
    );
  }

  const castle = castleOn(KingSide)
        .concat(castleOn(QueenSide));
  
  function castleOn(side) {
    
    let kingPos = board.kingPosOf(color);

    if (!kingPos) {
      return [];
    }

    let tr = side.tripToRook(kingPos, board);
    let rookPos = tr[tr.length - 1];

    let newKingPos = Pos.atfr(side.castledKingFile, kingPos.rank);
    let newRookPos = Pos.atfr(side.castledRookFile, rookPos.rank);

    return [{
      castle: {
        king: { [kingPos.key]: newKingPos },
        rook: { [rookPos.key]: newRookPos },
        side: side.name
      }
    }];
  }

  function forward(p) {
    return p;
  }

  function pawnDir() {
    return pawnDirOf(piece.color);
  }

  function pawnDirOf(color) {
    return color === 'white' ? _ => _.up(): _ => _.down();
  }

  function shortRange(dirs) {
    return dirs.flatMap(_ => _(pos)).flatMap(to => {
      return to || [];
    });
  }

  function longRange(dirs) {
    let res = [];

    function addAll(p, dir) {
      let to;
      if ((to = dir(p))) {
        res.push(to);
        addAll(to, dir);
      }
    }

    dirs.forEach(_ => addAll(pos, _));

    return res;
  };
}
