import * as fixtures from './fixtures';
import { app as ChessMd } from '../main';

export default function() {

  let $md = document.getElementById('chessmd');

  let content = fixtures.indianGame;
  
  let d = document.createElement('div');

  $md.appendChild(d);

  for (let i = 0; i < 100; i++) {
    ChessMd(d, {
      content
    });
  }

  console.log('done');

  console.log(d);
  
}
