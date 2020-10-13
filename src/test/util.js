import * as util from '../util';

let { pos2key, key2pos } = util;

export default function () {

  console.log(pos2key(key2pos('f3')));
  
}
