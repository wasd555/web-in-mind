import { CookieConsent, ConsentCategory } from "./types";

let latestConsent: CookieConsent | null = null;

export function updateConsentSnapshot(consent: CookieConsent | null) {
  latestConsent = consent;
}

export function consentGuard(fn: () => void, category: ConsentCategory): void {
  if (category === "essential") {
    fn();
    return;
  }
  if (!latestConsent) return;
  if (category === "analytics" && latestConsent.analytics) {
    fn();
  }
  if (category === "marketing" && latestConsent.marketing) {
    fn();
  }
}


