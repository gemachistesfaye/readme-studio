/**
 * Direction used by all "move" helpers: -1 moves towards the start of the
 * list, 1 moves towards the end of the list.
 */
export type MoveDirection = -1 | 1;

/**
 * True when the item at `index` can still move one position towards the start.
 */
export function canMoveUp(index: number, total: number): boolean {
  return index > 0 && index < total;
}

/**
 * True when the item at `index` can still move one position towards the end.
 */
export function canMoveDown(index: number, total: number): boolean {
  return index >= 0 && index < total - 1;
}

/**
 * Returns a new array with the item at `fromIndex` relocated to `toIndex`.
 *
 * The input array is never mutated. Out-of-range indexes are a no-op that
 * still returns a fresh copy, so React state identity is always safe.
 */
export function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];

  if (fromIndex < 0 || fromIndex >= next.length) return next;
  if (toIndex < 0 || toIndex >= next.length) return next;

  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  return next;
}

/**
 * Returns a new array with the item matching `id` shifted one step in
 * `direction`. Items keep their identity (ids and content are untouched).
 *
 * Unknown ids and moves past either boundary are no-ops.
 */
export function moveItemById<T extends { id: string }>(
  items: readonly T[],
  id: string,
  direction: MoveDirection
): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return [...items];

  return moveItem(items, index, index + direction);
}
