import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  defaultLanguage,
  getStoredLanguage,
  languageFromBrowserLanguages,
  languageFromCountry,
  urlLocaleFromLanguage
} from "../i18n/locale";
import type { LanguageCode } from "../types/spa";

interface LocaleResponse {
  country?: string | null;
}

function getBrowserLanguages(): string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages?.length) return [...navigator.languages];
  return navigator.language ? [navigator.language] : [];
}

export function RootLocaleRedirect() {
  const [language, setLanguage] = useState<LanguageCode | null>(null);

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage) {
      setLanguage(storedLanguage);
      return;
    }

    const browserLanguages = getBrowserLanguages();
    const browserLanguage = languageFromBrowserLanguages(browserLanguages);

    if (browserLanguage) {
      setLanguage(browserLanguage);
      return;
    }

    if (browserLanguages.some((value) => value.trim())) {
      setLanguage(defaultLanguage);
      return;
    }

    const controller = new AbortController();

    void fetch("/api/locale", {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Locale lookup failed: ${response.status}`);
        return response.json() as Promise<LocaleResponse>;
      })
      .then((payload) => setLanguage(languageFromCountry(payload.country)))
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn("[locale] Falling back to English.", error);
        setLanguage(defaultLanguage);
      });

    return () => controller.abort();
  }, []);

  if (!language) return null;
  return <Navigate to={`/${urlLocaleFromLanguage(language)}`} replace />;
}
