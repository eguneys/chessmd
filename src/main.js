import * as util from './util';
import { renderFen, updateBounds, updateSvg } from './render';

function scan(element) {
  element.querySelectorAll('[data-fen]').forEach((el) => {
    let state = util.readFen({
      fen: el.dataset.fen,
      shapes: el.dataset.shapes,
    });
    let elements = renderFen(el, state);
    listen(el, () => {
      updateBounds(elements, state);
      updateSvg(elements, state);
    });
  });
}

function listen(element, fResize) {
  const observer = new window.ResizeObserver(fResize);
  observer.observe(element);
}

export function app(element, options) {
  scan(element);
}
