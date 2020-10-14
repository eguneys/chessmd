import { brush } from './brush';
import * as util from './util';
import * as dom from './dom';
import * as SVG from './svg';

let { ranks,
      files,
      key2pos,
      fPosToTranslateAbs } = util;

let { svg, renderMarker, renderShape } = SVG;

let { div, tag, fTranslateAbs, fListen, updateChildren } = dom;

export function renderLine(line, fHover, fOut) {
  let onHover = ply => {
    return _ => {
      fListen('mouseover', el => fHover(ply, el))(_);
      fListen('mouseout', fOut)(_);
    };
  };

  return line.flatMap(([mwhite, mblack]) => {
    let onHoverWhite = mwhite && onHover(mwhite.ply),
        onHoverBlack = mblack && onHover(mblack.ply);

    return mwhite && mblack ?
      [
        tag('strong.moven', (mwhite.ply + 1) / 2 + '. '),
        tag('span.movem', mwhite.move.san + ' ', onHoverWhite),
        tag('span.movem', mblack.move.san + ' ', onHoverBlack),
      ]
      : mwhite ? [
        tag('strong.moven', (mwhite.ply + 1) / 2 + '. '),
        tag('span.movem', mwhite.move.san + ' ', onHoverWhite)
      ] : [
        tag('strong.moven', mblack.ply / 2 + '... '),
        tag('span.movem', mblack.move.san + ' ', onHoverBlack),
      ];
  });

}

export function renderFen(color, pieces, shapes, bounds, lastMove) {

  let fPosToTranslate = fPosToTranslateAbs(bounds);

  let board = tag('md-board', [
    ...lastMove.map(key => {
      let pos = key2pos(key);
      let move = tag(`square.last-move`, [],
                     fTranslateAbs(fPosToTranslate(pos)));
      move.mdKey = key;
      return move;
    }),
    ...Object.keys(pieces).map(key => {
      let pos = key2pos(key);
      let _ = pieces[key];
      let piece = tag(`piece.${_.color}.${_.role}`, [],
                      fTranslateAbs(fPosToTranslate(pos)));

      piece.mdKey = key;
      
      return piece;
    })
  ]);

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

  return {
    wrapper,
    board,
    svg: _svg
  };
}

export function updateSvg(els, shapes, color) {

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

export function updateBounds(asWhite, elBoard) {

  let bounds = elBoard.getBoundingClientRect();
  let fPosToTranslate = fPosToTranslateAbs(bounds);
  updateChildren(elBoard, _ => {
    fTranslateAbs(fPosToTranslate(key2pos(_.mdKey)), asWhite)(_);
  });

}
