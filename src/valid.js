export function valid(value) {
  return { value };
}

export function invalid(msg) {
  return { invalid: msg };
}
