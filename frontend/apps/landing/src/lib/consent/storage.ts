import { CONSENT_MAX_AGE_SECONDS, CONSENT_STORAGE_KEY, CONSENT_VERSION, CookieConsent } from "./types";

function getDefaultFromDNT(): Pick<CookieConsent, "analytics" | "marketing"> {
  if (typeof navigator !== "undefined" && (navigator as any).doNotTrack === "1") {
    return { analytics: false, marketing: false };
  }
  return { analytics: false, marketing: false };
}

export function buildDefaultConsent(): CookieConsent {
  const dnt = getDefaultFromDNT();
  return {
    essential: true,
    analytics: dnt.analytics,
    marketing: dnt.marketing,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

export function readConsentFromLocalStorage(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (typeof parsed !== "object" || parsed == null) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsentToLocalStorage(consent: CookieConsent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // ignore
  }
}

export function writeConsentCookie(consent: CookieConsent): void {
  if (typeof document === "undefined") return;
  try {
    const encoded = encodeURIComponent(JSON.stringify(consent));
    const maxAge = CONSENT_MAX_AGE_SECONDS;
    document.cookie = `${CONSENT_STORAGE_KEY}=${encoded}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    if (typeof document !== "undefined") {
      document.cookie = `${CONSENT_STORAGE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  } catch {
    // ignore
  }
}

export function hasValidPersistedConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (!parsed || typeof parsed !== "object") return false;
    if (parsed.version !== CONSENT_VERSION) return false;
    const updatedAtMs = Date.parse(parsed.updatedAt || "");
    if (Number.isNaN(updatedAtMs)) return false;
    const ageSec = (Date.now() - updatedAtMs) / 1000;
    return ageSec <= CONSENT_MAX_AGE_SECONDS;
  } catch {
    return false;
  }
}


