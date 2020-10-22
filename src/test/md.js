import fixtures from './fixtures';
import { app as ChessMd } from '../main';

import { parseMdFull, updatePreview } from '../md';

function mdhtml(code) {
  let $_ = document.createElement('div');

  updatePreview(parseMdFull(code), $_);

  return $_;
}

export default function() {

  let $test = document.getElementById('mdtest');
  
  let code = `1.Nf3 Nf6 <1. Nf3 Nf6>`;

  $test.appendChild(mdhtml(code));

}
