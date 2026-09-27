import { ReadmeBadge } from '@/types';

/**
 * Cleanly encodes text for Shields.io URL path parameters.
 * Replaces '-' with '--', '_' with '__', and encodes special characters.
 */
export function encodeBadgeComponent(text: string): string {
  return encodeURIComponent(text.trim().replace(/-/g, '--').replace(/_/g, '__'));
}

/**
 * Constructs the raw Shields.io image URL for a given badge definition.
 */
export function buildBadgeImageUrl(badge: ReadmeBadge): string {
  const label = encodeBadgeComponent(badge.label);
  const message = badge.message ? encodeBadgeComponent(badge.message) : '';
  const color = badge.color ? badge.color.trim().replace(/^#/, '') : 'blue';

  const path = message ? `${label}-${message}-${color}` : `${label}-${color}`;
  const params = new URLSearchParams();

  if (badge.style && badge.style !== 'flat') {
    params.set('style', badge.style);
  }

  if (badge.logo) {
    params.set('logo', badge.logo.trim());
    params.set('logoColor', 'white');
  }

  const query = params.toString();
  return `https://img.shields.io/badge/${path}${query ? `?${query}` : ''}`;
}

/**
 * Generates the standard Markdown representation for a badge.
 * Wraps in a link if badge.link is specified.
 */
export function generateBadgeMarkdown(badge: ReadmeBadge): string {
  const altText = badge.message ? `${badge.label}: ${badge.message}` : badge.label;
  const imageUrl = buildBadgeImageUrl(badge);
  const imgMarkdown = `![${altText}](${imageUrl})`;

  if (badge.link && badge.link.trim()) {
    return `[${imgMarkdown}](${badge.link.trim()})`;
  }

  return imgMarkdown;
}

/**
 * Formats a list of badges into a markdown row separated by spaces.
 */
export function generateBadgesRow(badges: ReadmeBadge[]): string {
  if (!badges || badges.length === 0) {
    return '';
  }

  return badges.map(generateBadgeMarkdown).join(' ');
}
