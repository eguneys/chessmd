export function tag(nameklass, children = [], fStyle) {

  let [name, ...klass] = nameklass.split('.');

  let el = document.createElement(name);

  klass.forEach(_ => {
    el.classList.add(_);
  });

  if (children.forEach) {
    children.forEach(_ => {
      el.appendChild(_);
    });
  } else {
    el.append(children);
  }

  if (fStyle) {
    fStyle(el);
  }

  return el;
}

export const div = (klass, children) => tag('div' + klass, children);

export const updateChildren = (el, fupdate) => {
  el = el.firstChild;

  while (el) {
    fupdate(el);
    el = el.nextSibling;
  }
};

export const fTranslateAbs = (pos) => {
  return el => {
    el.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
  };
};
