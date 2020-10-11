import { brush } from './brush';
import * as util from './util';
import * as dom from './dom';
import * as SVG from './svg';

let { ranks,
      files,
      key2pos,
      fPosToTranslateAbs } = util;

let { svg, renderMarker, renderShape } = SVG;

let { div, tag, fTranslateAbs, updateChildren } = dom;

export function renderFen(element, fen) {

  let { color, pieces, shapes } = fen;

  let bounds = element.getBoundingClientRect();
  let fPosToTranslate = fPosToTranslateAbs(bounds);

  let board = tag('md-board', pieces.map(_ => {
    let piece = tag(`piece.${_.color}.${_.role}`, [],
                    fTranslateAbs(fPosToTranslate(_.pos)));

    piece.mdKey = _.key;
    
    return piece;
  }));

  let _svg = svg('svg', [
    svg('defs', [
      renderMarker(brush)
    ]),
    ...shapes.map(_ => renderShape(_, color, bounds))
  ]);

  let wrapper = tag('md-wrap', [
    board,
    _svg,
    tag('coords.ranks.' + color, ranks.map(_ =>
      tag('coord', _)
    )),
    tag('coords.files.' + color, files.map(_ =>
      tag('coord', _)
    )),
  ]);

  element.appendChild(wrapper);

  return {
    board,
    svg: _svg
  };
}

export function updateSvg(els, fen) {

  let { shapes, color } = fen;

  let { board, svg } = els;
  let bounds = board.getBoundingClientRect();

  let el = svg.firstChild;
  let toRemove = [];

  el = el.nextSibling;
  while (el) {
    toRemove.push(el);
    el = el.nextSibling;
  };

  for (const el of toRemove) svg.removeChild(el);

  
  shapes.forEach(_ => {
    svg.appendChild(renderShape(_, color, bounds));
  });
}

export function updateBounds(els, fen) {
  
  let { color } = fen;
  let { board } = els;

  let asWhite = color === 'white';

  let bounds = board.getBoundingClientRect();
  let fPosToTranslate = fPosToTranslateAbs(bounds);
  updateChildren(board, _ => {
    fTranslateAbs(fPosToTranslate(key2pos(_.mdKey)), asWhite)(_);
  });

}
