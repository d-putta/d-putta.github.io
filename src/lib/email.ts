import type { Profile } from '@/content/types';

/** Builds the mailto link at runtime so the address is never plain text in the HTML. */
export function buildMailto(email: Profile['email']): { address: string; href: string } {
  const address = `${email.user}${String.fromCharCode(64)}${email.domain}.${email.tld}`;
  const href = `mailto:${address}?subject=${encodeURIComponent(email.subject)}`;
  return { address, href };
}
