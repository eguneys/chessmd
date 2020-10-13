export function partition(list, f) {
  let a = [], b = [];

  list.forEach(_ => f(_) ? a.push(_) : b.push(_));

  return [a, b];
}

export function objMap(obj, f) {
  let res = {};

  Object.keys(obj).forEach(key => {
    let u = f(key, obj[key]);
    let _ = Object.keys(u)[0];
    res[_] = u[_];
  });

  return res;
}

export function objForeach(obj, f) {
  Object.keys(obj).forEach(key => f(key, obj[key]));
}
