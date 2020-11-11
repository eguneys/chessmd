import { fSeq, objMap, objForeach } from '../outil';
import { fAttribute, tag, textNode, fListen } from '../dom';
import { Code, Text, Ply, Paragraph, Heading } from './parser';

export function updatePreview(model, $preview) {

  let toRemove = [];
  let $_ = $preview.firstChild;
  while ($_) {
    toRemove.push($_);
    $_ = $_.nextSibling;
  }

  for (let $_ of toRemove) $preview.removeChild($_);

  let tags = model.map(({ type, content, pos }) => {
    return {
      pos,
      $_: createPTag(type, content, pos)
    };
  });

  tags.forEach(_ => {
    $preview.appendChild(_.$_);
  });

  return tags;
}

function createParagraph(content) {
  return tag(`p`, content.map(({ type, content }) => {
    switch (type) {
    case Code:
      let dataGame = content.variation ? `${content.variation} ${content.base}` : null;
      let attribute = { 'data-line': content.line };

      if (dataGame) {
        attribute['data-game'] = dataGame;
      }
      return tag('span', [], fAttribute(attribute));
      break;
    case Text:
      return textNode(content);
      break;
    default:
      return null;
      break;
    }
  }));
}

function createPly(content) {
  let [ply, base] = content.split(' ');

  let attr = { 'data-ply': ply };
  if (base) attr['data-game'] = base;
  return tag('div', [], fAttribute(attr));
}

function createPTag(type, content) {
  switch (type) {
  case Ply:
    return createPly(content);
    break;
  case Paragraph:
    return createParagraph(content);
    break;
  case Heading:
    return tag('h2', content);
    break;
  default:
    return null;
    break;
  }
}
