import * as util from './util';
import * as dom from './dom';
import { findMove } from './chess';
import { parseLine } from './parser';
import Situation from './situation';
import { renderFen, updateBounds, updateSvg } from './render';

let { tag } = dom;

function render(ctx) {

  for (let elply of ctx.plys) {
    let elements = renderPly(elply, ctx.allMoves[elply.ply]);
    listen(elply.el, () => {
      updateBounds(elements, elply);
      updateSvg(elements, elply);
    });    
  }

}

function listen(element, fResize) {
  const observer = new window.ResizeObserver(fResize);
  observer.observe(element);
}

export function Ply(ctx, el) {

  let { history } = ctx;

  this.el = el;
  let game = el.dataset.game;
  let color = el.dataset.color;
  let shapes = util.readShapes(el.dataset.shapes);
  let ply = parseInt(el.dataset.ply);

  let lastMove = history.plyMove(ply);

  let pieces = {};

  let bounds = el.getBoundingClientRect();

  let asWhite = color === 'white';

  let els;

  this.wrap = () => {
    els = renderFen(color, pieces, shapes, bounds);

    el.appendChild(els.wrapper);

    listen(el, () => {
      updateBounds(asWhite, els.board);
      updateSvg(els, shapes, color);
    });
  };
};

export function MoveLine(ctx, el) {

  let sLine = el.dataset.line;

  let line = parseLine(sLine);
  this.flat = line.flat()
    .flatMap(_ => _ ? [_]:[]);

  let elPly;
  this.elPly = () => {
    if (!elPly) {
      elPly = findElPly();
    }
    return elPly;
  };

  function findElPly() {
    let elPly = el.nextSibling;
    
    while (elPly) {
      if (ctx.plys.find(_ => _.el === elPly)) {
        break;
      }
      elPly = elPly.nextSibling;
    }
    return elPly;
  }

  this.wrap = () => {
    let children = line.flatMap(([mwhite, mblack]) => 
      mwhite && mblack ?
        [
          tag('strong.moven', (mwhite.ply + 1) / 2 + '. '),
          tag('span.movem', mwhite.move.san + ' '),
          tag('span.movem', mblack.move.san + ' '),
        ]
        : mwhite ? [
          tag('strong.moven', (mwhite.ply + 1) / 2 + '. '),
          tag('span.movem', mwhite.move.san + ' ')
        ] : [
          tag('strong.moven', mblack.ply / 2 + '... '),
          tag('span.movem', mblack.move.san + ' '),    
        ]);

    children.forEach(_ => el.appendChild(_));
  };

};

export function History(ctx) {

  let { lines } = ctx;

  let moves = lines.flatMap(_ => _.flat)
      .sort((a, b) => a.ply < b.ply ? -1 : a.ply === b.ply ? 0 : 1);

  let situation = Situation.apply();
  moves = moves.map(({ ply, move }) => {
    if (!situation) {
      return { ply, value: null };
    }
    let { invalid, value } = move.move(situation);
    if (invalid) {
      console.warn(invalid);
      situation = null;
      return { ply, value: invalid };
    }
    situation = value.after;
    return {
      ply,
      value
    };
  }).filter(_ => _);

  this.plyMove = ply => {
    return moves.find(_ => _.ply === ply);
  };
  
}

export const makePlys = (ctx, el) => {
  let res = [];
  for (let _ of el.querySelectorAll('[data-ply]')) {
    res.push(new Ply(ctx, _));
  }
  return res;
};

export const makeMoveLines = (ctx, el) => {
  let res = [];
  for (let _ of el.querySelectorAll('[data-line]')) {
    res.push(new MoveLine(ctx, _));
  }
  return res;
};

export function app(element, options) {

  let ctx = {};

  ctx.lines = makeMoveLines(ctx, element);
  ctx.history = new History(ctx);
  ctx.plys = makePlys(ctx, element);

  ctx.lines.forEach(_ => _.wrap());
  ctx.plys.forEach(_ => _.wrap());
}
