export function valid(value) {
  return { value };
}

export function invalid(msg) {
  return { invalid: msg };
}

export function toValid(value, msg) {
  return value ? valid(value):invalid(msg);
}
