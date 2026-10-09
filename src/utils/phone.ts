/**
 * ISAACIFY Phone Normalization Utility
 * Standardizes phone numbers to canonical E.164 format with special support for Sri Lankan phone numbers.
 */

export function normalizePhoneNumber(rawPhone?: string | null): string {
  if (!rawPhone) return '';

  // 1. Remove all whitespace, hyphens, parentheses, periods, and leading/trailing spaces
  let cleaned = rawPhone.trim().replace(/[\s\-\(\)\.]/g, '');

  if (!cleaned) return '';

  // 2. Sri Lankan phone number normalization
  // Case A: "+94" followed by 9 digits (e.g. "+94716718281")
  if (cleaned.startsWith('+94')) {
    const digits = cleaned.slice(3).replace(/\D/g, '');
    if (digits.length === 9) {
      return `+94${digits}`;
    }
    return `+94${digits}`;
  }

  // Case B: "94" without '+' prefix followed by 9 digits (e.g. "94716718281")
  if (cleaned.startsWith('94') && cleaned.length >= 11) {
    const digits = cleaned.slice(2).replace(/\D/g, '');
    if (digits.length === 9) {
      return `+94${digits}`;
    }
    return `+94${digits}`;
  }

  // Case C: Leading '0' followed by 9 digits (e.g. "0716718281")
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    const digits = cleaned.slice(1).replace(/\D/g, '');
    if (digits.length === 9) {
      return `+94${digits}`;
    }
  }

  // Case D: Direct 9 digits starting with 7 (e.g. "716718281")
  if (/^[7][0-9]{8}$/.test(cleaned)) {
    return `+94${cleaned}`;
  }

  // Case E: If already has a plus with country code (e.g. "+1...", "+44..."), keep standard E.164
  if (cleaned.startsWith('+')) {
    return cleaned.replace(/[^\+0-9]/g, '');
  }

  // Default fallback: prepend '+' if numeric
  return `+${cleaned.replace(/\D/g, '')}`;
}

/**
 * Validates whether a phone number is a valid Sri Lankan mobile number
 */
export function isValidSriLankanPhone(phone?: string | null): boolean {
  if (!phone) return false;
  const normalized = normalizePhoneNumber(phone);
  // Valid SL mobile: +94 followed by 7 and 8 more digits (9 digits total: 70, 71, 72, 74, 75, 76, 77, 78)
  return /^\+947[0-9]{8}$/.test(normalized);
}

/**
 * Formats a canonical phone number for display (e.g. "+94 71 671 8281")
 */
export function formatPhoneForDisplay(canonicalPhone?: string | null): string {
  if (!canonicalPhone) return '';
  const normalized = normalizePhoneNumber(canonicalPhone);
  if (normalized.startsWith('+94') && normalized.length === 12) {
    const prefix = normalized.slice(0, 3); // +94
    const operator = normalized.slice(3, 5); // 71
    const part1 = normalized.slice(5, 8); // 671
    const part2 = normalized.slice(8); // 8281
    return `${prefix} ${operator} ${part1} ${part2}`;
  }
  return normalized;
}
