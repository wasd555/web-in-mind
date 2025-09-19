"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CONSENT_VERSION, CookieConsent, isConsentExpired } from "./types";
import { buildDefaultConsent, readConsentFromLocalStorage, writeConsentCookie, writeConsentToLocalStorage } from "./storage";
import { updateConsentSnapshot } from "./guard";

type ConsentContextValue = {
  consent: CookieConsent | null;
  setConsent: (next: CookieConsent) => void;
  openSettings: () => void;
  closeSettings: () => void;
  settingsOpen: boolean;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<CookieConsent | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const stored = readConsentFromLocalStorage();
    if (!stored || stored.version !== CONSENT_VERSION || isConsentExpired(stored.updatedAt)) {
      // Not yet decided or outdated → show banner later, but initialize default per DNT
      const def = buildDefaultConsent();
      setConsentState(def);
      return;
    }
    setConsentState(stored);
  }, []);

  const setConsent = useCallback((next: CookieConsent) => {
    const withMeta: CookieConsent = { ...next, updatedAt: new Date().toISOString(), version: CONSENT_VERSION };
    setConsentState(withMeta);
    writeConsentToLocalStorage(withMeta);
    writeConsentCookie(withMeta);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo<ConsentContextValue>(() => ({ consent, setConsent, openSettings, closeSettings, settingsOpen }), [consent, setConsent, openSettings, closeSettings, settingsOpen]);

  useEffect(() => {
    updateConsentSnapshot(consent);
  }, [consent]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useCookieConsentHook(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useCookieConsentHook must be used within ConsentProvider");
  return ctx;
}


