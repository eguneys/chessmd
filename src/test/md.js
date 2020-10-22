import fixtures from './fixtures';
import { app as ChessMd } from '../main';

import { parseMdFull, updatePreview } from '../md';

function mdhtml(code) {
  let $_ = document.createElement('div');

  updatePreview(parseMdFull(code), $_);

  ChessMd($_, {});

  return $_;
}

export default function() {

  let $test = document.getElementById('mdtest');
  let code;

  code = `

# This is a header
This is a paragraph. Embed chess notation like <1. e3 e5 2. Nf3 Nf6 3.d3> 
Continue paragraph. Continue from black's move <3... d6 4. a3 a6> 

To embed a chess board use ply number like:
=8

Embed variation lines <main2 main 3. d4 d5 4. a3 a6> . "main2" is variation name and "main" is the parent line.

Make sure to put a space at beginning and end of lines <main3 main 3. d4> .

Happy blogging
`;
  $test.appendChild(mdhtml(code));

  code = `
# This is a header
This is a paragraph. Embed chess notation like <1. e3 e6 2. Nf3 Nf6 3. d3> 
Continue paragraph. Continue from black's move <3... d6 4. a3 a6> 

To embed a chess board use ply number like:
=8

Embed variation lines <main2 main 3. d4 d5 4. a3 a6> . "main2" is variation name and "main" is the parent line.

Make sure to put a space at beginning and end of lines <main3 main 3. d4> .

Happy blogging
`;
  $test.appendChild(mdhtml(code));

  code = `
To embed a chess board use ply number like:
=8

Embed variation lines <main2 main 3. d4 d5 4. a3 a6> . "main2" is variation name and "main" is the parent line.

Make sure to put a space at beginning and end of lines <main3 main 3. d4> .

Happy blogging
`;
  $test.appendChild(mdhtml(code));

  code = `
# This is a header

This is a paragraph. Add chess notation like <1. e3 e6 2. Nf3 Nf6 3. d3> Continue from black's move <4. a3 a6>

To start a new paragraph add two new lines.

To embed a chess board use ply number like:

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
