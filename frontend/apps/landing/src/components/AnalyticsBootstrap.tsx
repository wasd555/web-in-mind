"use client";

import { useEffect } from "react";
import { consentGuard } from "../lib/consent/guard";
import { useCookieConsent } from "../lib/consent/hook";
import { initAnalytics } from "../lib/consent/exampleAnalytics";

export default function AnalyticsBootstrap() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    // Example: initialize analytics only if allowed
    consentGuard(() => {
      initAnalytics();
    }, "analytics");
  }, [consent]);

  return null;
}


