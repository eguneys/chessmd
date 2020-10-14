import { objFilter, objForeach, objMap, groupToMap } from './outil';
import * as util from './util';
import { parseLine } from './parser';
import Situation from './situation';
import { renderLine, renderFen, updateBounds, updateSvg } from './render';
import { fAddClass } from './dom';

function listen(element, fResize) {
  const observer = new window.ResizeObserver(fResize);
  observer.observe(element);
}

export function Ply(ctx, el) {

  let { history } = ctx;

  this.el = el;
  let game = el.dataset.game || 'main';
  let color = el.dataset.color;
  let shapes = util.readShapes(el.dataset.shapes);
  let ply = parseInt(el.dataset.ply);
  let pieces = {};
  let lastMove = [];

  let move = history.moveFor(game, ply);
  if (move) {
    let situation = move.value.situationAfter();
    pieces = situation.board.pieces;
    lastMove.push(move.value.orig.key);
    lastMove.push(move.value.dest.key);
  }

  let bounds = el.getBoundingClientRect();

  let els;

  this.wrap = () => {

    els = renderFen(color, pieces, shapes, bounds, lastMove);

    el.appendChild(els.wrapper);

    listen(el, () => {
      updateBounds(util.asWhite(color), els.board);
      updateSvg(els, shapes, color);
    });
  };
};

export function MoveLine(ctx, el) {

  let sGame = el.dataset.game || 'main initial';
  let sLine = el.dataset.line;

  let _game = sGame.split(' ');
  if (_game.length === 1) {
    _game.push('main');
  }
  this.game = _game[0];
  this.base = _game[1];

  let line = parseLine(sLine);
  this.flat = line.flat()
    .flatMap(_ => _ ? [_]:[]);

  this.wrap = () => {
    let { history } = ctx;
    let depth = history.lineDepthFor(this.game);

    let fStyle = fAddClass(`depth${depth}`);

    let children = renderLine(line);

    children.forEach(_ => el.appendChild(_));
    fStyle(el);
  };

};

export function History(ctx) {

  let { lines } = ctx;

  let linesByGame = groupToMap(lines, line => {
    return { [line.game]: line };
  });

  let movesByGame = {};
  let lineDepthByGame = {};

  function playVariations() {
    function step(curr, depth) {
      objForeach(playVariationsHelper(curr), (_, v) => {
        movesByGame[_] = v;
        lineDepthByGame[_] = depth;
        step(_, depth + 1);
      });
    }
    step('initial', 0);
  }

  playVariations();

  function playVariationsHelper(base) {
    let variationLines = objFilter(linesByGame, (_, lines) => 
      lines[0].base === base);

    let variationMoves = objMap(variationLines, (_, lines) => ({
      [_]: lines.flatMap(_ => _.flat)
        .sort((a, b) => a.ply < b.ply ? -1 : a.ply === b.ply ? 0 : 1)
    }));

    return objMap(variationMoves, (_, moves) => {
      let situation = situationFor(base, moves[0].ply - 1);
      return { [_]:  playMoves(moves, situation) };
    });
  }

  this.lineDepthFor = (base) => {
    return lineDepthByGame[base];
  };

  this.situationFor = situationFor;
  this.moveFor = moveFor;

  function moveFor(base, ply) {
    let oMove = movesByGame[base]
        .find(_ => _.ply === ply);

    if (!oMove) {
      console.warn(`No move found for ${base} ${ply}`);
      return null;
    }
    return oMove;
  }

  function situationFor(base, ply) {
    if (ply === 0) {
      return Situation.apply();
    }

    let oMove = moveFor(base, ply);

    return oMove.value.situationAfter();
  }

  function playMoves(moves, situation) {
    return moves.map(({ ply, move }) => {
      if (!situation) {
        return { ply, value: null };
      }
      let { invalid, value } = move.move(situation);
      if (invalid) {
        console.warn(invalid);
        situation = null;
        return { ply, value: invalid };
      }
      situation = value.situationAfter();
      return {
        ply,
        value
      };
    }).filter(_ => _);
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
