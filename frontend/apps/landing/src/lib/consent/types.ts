export type ConsentCategory = "essential" | "analytics" | "marketing";

export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string; // ISO string
  version: number;
};

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "cookie_consent_v1";
export const CONSENT_MAX_AGE_SECONDS = 31536000; // 12 months

export function isConsentExpired(updatedAtIso: string): boolean {
  const updatedAtMs = Date.parse(updatedAtIso);
  if (Number.isNaN(updatedAtMs)) return true;
  const now = Date.now();
  return now - updatedAtMs > CONSENT_MAX_AGE_SECONDS * 1000;
}


