import fixtures from './fixtures';
import { app as ChessMd } from '../main';

import { parseMdFull, updatePreview } from '../md';

function mdhtml(code) {
  let $_ = document.createElement('div');

  updatePreview(parseMdFull(code), $_);

  ChessMd($_, {});

  return $_;
}

function genCode(len) {
  let chars = "<>abcdefgh.NBQRKO-12345678 ".split('');

  function nextChar() {
    return chars[Math.floor(Math.random()*chars.length)];
  };

  let res = "";

  for (let i = 0; i < len; i++) {
    res += nextChar();
  }

  return res;
}

function repeat(code, n) {
  let res = "";
  while (--n) {
    res += code;
  }
  return res;
}

function corrupt(code, rate = 0.9) {
  let chars = "<>abcdefgh.NBQRKO-12345678 ".split('');

  function nextChar() {
    return chars[Math.floor(Math.random()*chars.length)];
  };

  let res = "";
  for (let i = 0; i < code.length; i++) {
    res += Math.random() < rate ? code[i] : nextChar();
  }
  return res;
}

export default function() {
  let $test = document.getElementById('mdtest');

  // simple($test);

  more($test);

}

function more($test) {

  function work(code) {
    $test.appendChild(mdhtml(code));
  }
  
  work(`
No move line Nf3 <Nf3>
`);

  work(corrupt(repeat(`<e6 e6 e6> <1. Nf3 Nf6 2. Ba5 Bg4 3. e4> <4... a6> <5... Qa7> <7... a8>`, 100), 0.98));

}

function simple($test) {

  let code;

  code = `
<1. e3 e6 2. Nf3 Nf6 3. d3> 
<3... d6 4. a3 a6> 
=8
<main2 main 3. d4 d5 4. a3 a6>
<main3 main 3. d4> .

`;
  $test.appendChild(mdhtml(code));

  code = `
=8
<main2 main 3. d4 d5 4. a3 a6>
<main3 main 3. d4> .
`;
  $test.appendChild(mdhtml(code));

  code = `<1. e3 e6 2. Nf3 Nf6 3. d3> <4. a3 a6>
=8
`;  
  $test.appendChild(mdhtml(code));

  code = `#Invalid Variation\n 1.Nf3 Nf5 <1. Nf3 Nf5 2. d3> variation <main2 main 2. d4 d5 3. Nd3>`;
  $test.appendChild(mdhtml(code));
  
  code = `#Valid\n 1.Nf3 Nf6 <1. Nf3 Nf6>`;
  $test.appendChild(mdhtml(code));

  code = `#Black Continuation\n 1.Nf3 Nf6 <1. Nf3 Nf6 2. e3> and <2... e6>`;
  $test.appendChild(mdhtml(code));

  code = `#One space\n 1.Nf3 Nf6 <1. Nf3 Nf6 >`;
  $test.appendChild(mdhtml(code));

  code = `#Invalid san\n 1.Nf3 Xf$ <1. Nf3 Xf$>`;
  $test.appendChild(mdhtml(code));

  code = `#Incomplete line\n 1.Nf3 Nf6 2.  <1. Nf3 Nf6 2. >`;
  $test.appendChild(mdhtml(code));

  code = `#Invalid move\n 1.Nf3 Nf5 <1. Nf3 Nf5 2. d3>`;
  $test.appendChild(mdhtml(code));


}
