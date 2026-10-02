/** Moves `index` by `step` inside a list of `length` items, wrapping at both ends. */
export default function wrapIndex(index: number, step: number, length: number): number {
  if (length <= 0) {
    return 0;
  }

  return (((index + step) % length) + length) % length;
}
