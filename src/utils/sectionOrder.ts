import { ReadmeSectionId } from '@/types';
import { DEFAULT_SECTION_ORDER } from '@/constants/sections';
import { MoveDirection, moveItem } from './listOrder';

const KNOWN_SECTION_IDS: ReadonlySet<string> = new Set<string>([
  ...DEFAULT_SECTION_ORDER,
  'githubStats',
]);

/**
 * Type guard for a known reorderable README section id.
 */
export function isReadmeSectionId(value: unknown): value is ReadmeSectionId {
  return typeof value === 'string' && KNOWN_SECTION_IDS.has(value);
}

/**
 * Defensively normalizes any persisted / incoming section order into a safe,
 * complete, duplicate-free list of known section ids.
 *
 * Strategy:
 *   1. Keep valid known ids in their configured relative order.
 *   2. Drop unknown ids and duplicates.
 *   3. Append any missing known ids in default order.
 *
 * This keeps `generateMarkdown()` crash-free today and stays forward
 * compatible with future persisted drafts (Phase 14).
 */
export function normalizeSectionOrder(order: unknown): ReadmeSectionId[] {
  const seen = new Set<ReadmeSectionId>();
  const normalized: ReadmeSectionId[] = [];

  if (Array.isArray(order)) {
    for (const candidate of order) {
      if (!isReadmeSectionId(candidate) || seen.has(candidate)) continue;
      seen.add(candidate);
      normalized.push(candidate);
    }
  }

  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) normalized.push(id);
  }

  return normalized;
}

/**
 * True when the given order matches the canonical default order exactly.
 * Used to disable the "Reset order" action when nothing would change.
 */
export function isDefaultSectionOrder(order: unknown): boolean {
  const normalized = normalizeSectionOrder(order);
  return normalized.every((id, index) => id === DEFAULT_SECTION_ORDER[index]);
}

/**
 * Returns a new order with the given section shifted one step in `direction`.
 */
export function moveSectionInOrder(
  order: ReadmeSectionId[],
  sectionId: ReadmeSectionId,
  direction: MoveDirection
): ReadmeSectionId[] {
  const normalized = normalizeSectionOrder(order);
  const position = getSectionPosition(normalized, sectionId);
  return moveItem(normalized, position, position + direction);
}

/**
 * Position of a section within the given order, or -1 when absent.
 */
export function getSectionPosition(
  order: ReadmeSectionId[],
  sectionId: ReadmeSectionId
): number {
  return order.indexOf(sectionId);
}
