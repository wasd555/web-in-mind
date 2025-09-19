"use client";

import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useCookieConsent } from "../lib/consent/hook";
import { CONSENT_VERSION } from "../lib/consent/types";
import type { CookieConsent as ConsentModel } from "../lib/consent/types";
import { translations } from "../lib/consent/i18n";
import { updateConsentSnapshot, consentGuard } from "../lib/consent/guard";
import { hasValidPersistedConsent } from "../lib/consent/storage";
import { initAnalytics } from "../lib/consent/exampleAnalytics";

function useLocale(): "ru" | "en" {
  if (typeof navigator !== "undefined") {
    const lang = (navigator.language || "ru").toLowerCase();
    if (lang.startsWith("ru")) return "ru";
  }
  return "en";
}

function Banner() {
  const { consent, setConsent, openSettings } = useCookieConsent();
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const t = translations[locale];

  // Banner visible if consent is default (not yet saved with version) or outdated
  const shouldShow = useMemo(() => {
    if (!consent) return false;
    // Show until there is a valid persisted consent (version match + not expired)
    return !hasValidPersistedConsent();
  }, [consent]);

  useEffect(() => {
    setVisible(shouldShow);
  }, [shouldShow]);

  useEffect(() => {
    updateConsentSnapshot(consent);
  }, [consent]);

  // Example init guarded analytics on consent changes
  useEffect(() => {
    consentGuard(() => initAnalytics(), "analytics");
  }, [consent]);

  if (!consent) return null;
  if (!visible) return null;

  const acceptAll = () => {
    const next: ConsentModel = { essential: true, analytics: true, marketing: true, updatedAt: new Date().toISOString(), version: CONSENT_VERSION };
    setConsent(next);
    setVisible(false);
  };
  const rejectAll = () => {
    const next: ConsentModel = { essential: true, analytics: false, marketing: false, updatedAt: new Date().toISOString(), version: CONSENT_VERSION };
    setConsent(next);
    setVisible(false);
  };

  return (
    <div
      className={[
        "fixed z-50",
        "w-full max-w-md md:max-w-lg",
        "md:bottom-4 md:right-4",
        "bottom-2 inset-x-0 mx-2 md:inset-auto",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
      role="region"
      aria-label={t.title}
    >
      <div className="rounded-2xl shadow-lg ring-1 ring-black/5 bg-white/90 backdrop-blur-lg p-4 text-sm text-gray-800">
        <p className="font-medium text-gray-900">{t.title}</p>
        <p className="mt-1 text-gray-700">{t.description} <a className="underline hover:no-underline" href="/privacy" target="_blank" rel="noreferrer noopener">{t.privacy}</a>.</p>
        <div className="mt-3 flex items-center gap-2 flex-wrap md:flex-nowrap">
          <button onClick={acceptAll} className="inline-flex rounded-full bg-teal-600 text-white px-5 py-2 text-sm shadow hover:bg-teal-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t.acceptAll}</button>
          <button onClick={rejectAll} className="inline-flex rounded-full bg-white text-gray-900 ring-1 ring-black/10 px-5 py-2 text-sm shadow-sm hover:bg-white/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t.rejectAll}</button>
          <button onClick={openSettings} className="inline-flex rounded-full bg-white text-gray-900 ring-1 ring-black/10 px-5 py-2 text-sm shadow-sm hover:bg-white/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t.settings}</button>
        </div>
      </div>
    </div>
  );
}

function Modal() {
  const { consent, setConsent, settingsOpen, closeSettings } = useCookieConsent();
  const locale = useLocale();
  const t = translations[locale];
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const [analytics, setAnalytics] = useState(!!consent?.analytics);
  const [marketing, setMarketing] = useState(!!consent?.marketing);

  useEffect(() => {
    if (!settingsOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSettings();
      }
      if (e.key === "Tab") {
        const first = firstFocusableRef.current;
        const last = lastFocusableRef.current;
        if (!first || !last) return;
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [settingsOpen, closeSettings]);

  useEffect(() => {
    setAnalytics(!!consent?.analytics);
    setMarketing(!!consent?.marketing);
  }, [consent]);

  if (!settingsOpen) return null;

  const save = () => {
    if (!consent) return;
    setConsent({ ...consent, analytics, marketing });
    closeSettings();
  };

  return (
    <div className="fixed inset-0 z-50" aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-desc" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={closeSettings} />
      <div className="absolute inset-0 flex items-end md:items-center justify-center p-2 md:p-4">
        <div ref={dialogRef} tabIndex={-1} className="w-full max-w-md rounded-2xl bg-white p-4 ring-1 ring-black/10 shadow-xl outline-none transition-transform" style={{ transform: "translateY(0)" }}>
          <h2 id="cookie-settings-title" className="text-lg font-semibold text-gray-900">{t.modalTitle}</h2>
          <p id="cookie-settings-desc" className="mt-1 text-sm text-gray-700">{t.modalDesc}</p>

          <div className="mt-4 grid gap-3">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked disabled className="mt-1" />
              <div>
                <p className="font-medium">{t.essential}</p>
                <p className="text-xs text-gray-600">Необходимы для работы сайта.</p>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1" />
              <div>
                <p className="font-medium">{t.analytics}</p>
                <p className="text-xs text-gray-600">Аналитика посещений и событий.</p>
              </div>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1" />
              <div>
                <p className="font-medium">{t.marketing}</p>
                <p className="text-xs text-gray-600">Персонализированные рекомендации и маркетинг.</p>
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 justify-end">
            <button ref={firstFocusableRef} onClick={save} className="inline-flex rounded-full bg-teal-600 text-white px-5 py-2 text-sm shadow hover:bg-teal-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t.save}</button>
            <button ref={lastFocusableRef} onClick={closeSettings} className="inline-flex rounded-full bg-white text-gray-900 ring-1 ring-black/10 px-5 py-2 text-sm shadow-sm hover:bg-white/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t.cancel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CookieConsent() {
  return (
    <Fragment>
      <Banner />
      <Modal />
    </Fragment>
  );
}


