import { objFilter, objForeach, objMap, groupToMap } from './outil';
import { valid, invalid } from './valid';
import * as util from './util';
import { parseLine } from './parser';
import Situation from './situation';
import { renderLineModel } from './rendermodel';
import { renderLine, renderFen, updateBounds, updateSvg } from './render';
import { fTranslateAbs, fAddClass, fHide, fShow, div } from './dom';

import { parseMdFull, updatePreview } from './md';

function isInViewport(bounds) {
  return bounds.top >= 0 &&
    bounds.left >= 0 &&
    bounds.bottom <= window.innerHeight &&
    bounds.right <= window.innerWidth;
}

function listenEndScroll(onEndScroll) {
  let isScrolling;
  document.addEventListener('scroll', function(event) {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(onEndScroll, 60);
  }, false);
}

function listenResize(element, fResize) {
  const observer = new window.ResizeObserver(fResize);
  observer.observe(element);
  return () => {
    observer.unobserve(element);
  };
}

export function Ply(play, ctx, el) {

  let { history } = play;

  let game,
      color,
      shapes,
      ply,
      pieces,
      lastMove,
      move,
      bounds,
      error;

  this.el = el;
  this.bounds = () => bounds;

  this.init = (data) => {
    game = data.game || 'main';
    color = data.color;
    shapes = util.readShapes(data.shapes);
    ply = parseInt(data.ply);
    pieces = {};
    lastMove = [];

    move = history.moveFor(game, ply);

    if (move) {
      move.value.fold(_ => {
        let situation = _.situationAfter();
        pieces = situation.board.pieces;
        lastMove.push(_.orig.key);
        lastMove.push(_.dest.key);
      }, _ => {
        error = _;
      });
    } else {
      error = `No move found ${game}:${ply}`;
    }

    color = color || history.colorFor(game);

    bounds = el.getBoundingClientRect();
  };

  let els;

  this.syncVisible = () => {
    bounds = el.getBoundingClientRect();
    this.isInViewport = isInViewport(bounds);
  };

  let unlisten;
  this.render = () => {
    if (!unlisten) {
    } else {
      unlisten();

      el.removeChild(els.wrapper);
    }
    this.wrap();
  };


  this.wrap = () => {

    els = renderFen(color, pieces, shapes, bounds, lastMove);

    el.appendChild(els.wrapper);

    unlisten = listenResize(el, () => {
      updateBounds(util.asWhite(color), els.board);
      updateSvg(els, shapes, color);
    });
  };
};

export function MoveLine(play, ctx, el) {

  let sGame = el.dataset.game || 'main initial';
  let sLine = el.dataset.line;
  let sColor = el.dataset.color;

  let _game = sGame.split(' ');
  if (_game.length === 1) {
    _game.push('main');
  }
  this.game = _game[0];
  this.base = _game[1];
  this.color = sColor;

  if (this.game === this.base) {
    console.warn(`Same name for variation ${this.game}`);
    this.base += "X";
  }

  let line = parseLine(sLine);

  this.flat = line.flat()
    .flatMap(_ => _ ? _.copyMap(_ => [_])
             .getOrElse(_ => []): 
             []);

  let fHover = (ply, el) => {
    play.show(this.game, ply, el);
  };

  let fOut = () => {
    play.hide();
  };

  this.wrap = () => {

    const plyMove = (ply) => {
      let move = play.history.moveFor(this.game, ply);
      if (!move) {
        return invalid(`No move for ${this.game}`);
      }
      return move.value;
    };

    let depth = play.history.lineDepthFor(this.game);

    let fStyle = fAddClass(`depth${depth}`);

    let lineModel = line.map(([mw, mb]) =>
      [mw && renderLineModel(mw, plyMove),
       mb && renderLineModel(mb, plyMove)]
    );

    let children = renderLine(lineModel, fHover, fOut);

    children.forEach(_ => el.appendChild(_));
    fStyle(el);
  };

};

export function History(play, ctx) {

  let { lines } = play;

  let linesByGame = groupToMap(lines, line => {
    return { [line.game]: line };
  });

  let allGames = Object.keys(linesByGame);

  let movesByGame = {};
  let lineDepthByGame = {};
  let colorByGame = {};

  function findColors() {
    allGames.forEach(game => {
      colorByGame[game] = findColorByGameHelper(game);
    });
  }

  findColors();

  function findColorByGameHelper(game) {

    if (game === 'initial' || !linesByGame[game]) {
      return 'white';
    }

    let line = linesByGame[game][0];

    return line.color || findColorByGameHelper(line.base);
  }

  function playVariations() {
    function step(curr, depth, color) {
      objForeach(playVariationsHelper(curr), (_, v) => {
        movesByGame[_] = v;
        lineDepthByGame[_] = depth;
        step(_, depth + 1);
      });
    }
    step('initial', 0, 'white');
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
      if (moves.length === 0) {
        return {};
      };

      let situation = situationFor(base, moves[0].ply - 1);
      return { [_]:  playMoves(moves, situation) };
    });
  }

  this.lineDepthFor = (base) => {
    return lineDepthByGame[base];
  };

  this.colorFor = (base) => {
    return colorByGame[base];
  };

  this.situationFor = situationFor;
  this.moveFor = moveFor;

  function moveFor(base, ply) {
    if (!movesByGame[base]) {
      console.warn(`No variation found for ${base}`);
      return null;
    }

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

    let move = moveFor(base, ply);

    if (move) {
      return move.value.map(_ =>
        _.situationAfter()
      ).getOrElse(Situation.apply);
    } else {
      return Situation.apply();
    }
  }

  function playMoves(moves, situation) {
    return moves.map(({ ply, move }) => {
      let value = situation ? move.move(situation).flatMap(_ => {
        situation = _.situationAfter();
        return valid(_);
      }, _ => {
        situation = null;
        return invalid(_);
      }) : invalid('No situation.');

      return {
        ply,
        value
      };
    });
  };
  
}

export const makePlys = (play, ctx) => {
  let { element } = ctx;

  let res = [];
  for (let _ of element.querySelectorAll('[data-ply]')) {
    let ply = new Ply(play, ctx, _);
    ply.init({
      game: _.dataset.game,
      color: _.dataset.color,
      shapes: _.dataset.shapes,
      ply: _.dataset.ply
    });
    res.push(ply);
  }
  return res;
};

export const makeMoveLines = (play, ctx) => {
  let { element } = ctx;
  let res = [];
  for (let _ of element.querySelectorAll('[data-line]')) {
    res.push(new MoveLine(play, ctx, _));
  }
  return res;
};

export function Play(ctx) {

  let { element } = ctx;

  let lines = this.lines = makeMoveLines(this, ctx);
  let history = this.history = new History(this, ctx);
  let plys = this.plys = makePlys(this, ctx);

  let hoverEl = div('.hover-ply', [], fHide);
  let hoverPly = new Ply(this, ctx, hoverEl);

  this.wrap = () => {

    element.appendChild(hoverEl);
    
    lines.forEach(_ => _.wrap());
    plys.forEach(_ => _.wrap());
  };

  let visiblePly = this.visiblePly = () => {
    return plys.filter(_ => _.isInViewport)[0];
  };

  function findVisiblePly() {
    plys.forEach(_ => _.syncVisible());
  }

  this.listen = () => {
    listenEndScroll(findVisiblePly);
    findVisiblePly();
  };

  this.hide = () => {
    fHide(hoverEl);
  };

  this.show = (game, ply, elN) => {

    let vp = visiblePly();
    let posToTranslate = [window.pageXOffset, window.pageYOffset];
    if (vp) {
      posToTranslate[0] += vp.bounds().left;
      posToTranslate[1] += vp.bounds().top;
    } else {
      let { clientWidth } = ctx.element;
      let offBounds = elN.getBoundingClientRect();
      let helBounds = hoverEl.getBoundingClientRect();

      if (offBounds.left < clientWidth / 2) {
        posToTranslate[0] += clientWidth - helBounds.width - 4;
      }

    }

    fTranslateAbs(posToTranslate)(hoverEl);
    
    hoverPly.init({
      game,
      ply
    });
    hoverPly.render();
    fShow(hoverEl);
  };
}

export function app(element, options) {
  
  let ctx = {
    element
  };

  if (options.content) {
    let model = parseMdFull(options.content);
    updatePreview(model, element);
   }


  let play = new Play(ctx);

  play.wrap();
  play.listen();

}
