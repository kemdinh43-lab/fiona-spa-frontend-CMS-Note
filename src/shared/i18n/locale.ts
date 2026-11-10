import type { LanguageCode } from "../types/spa";

export type UrlLocale = "vi" | "en" | "ko" | "zh";

export const defaultLanguage: LanguageCode = "en";
export const supportedLanguages: LanguageCode[] = ["en", "ko", "vi", "zh-CN"];
export const supportedUrlLocales: UrlLocale[] = ["en", "ko", "vi", "zh"];
export const languageStorageKey = "fiona.language";

const languageByLocale: Record<UrlLocale, LanguageCode> = {
  vi: "vi",
  en: "en",
  ko: "ko",
  zh: "zh-CN"
};

const localeByLanguage: Record<LanguageCode, UrlLocale> = {
  vi: "vi",
  en: "en",
  ko: "ko",
  "zh-CN": "zh"
};

export function isUrlLocale(value: string | undefined): value is UrlLocale {
  return supportedUrlLocales.includes(value as UrlLocale);
}

export function isSupportedLanguage(value: string | null | undefined): value is LanguageCode {
  return Boolean(value && supportedLanguages.includes(value as LanguageCode));
}

export function languageFromUrlLocale(locale: UrlLocale): LanguageCode {
  return languageByLocale[locale];
}

export function urlLocaleFromLanguage(language: LanguageCode): UrlLocale {
  return localeByLanguage[language];
}

export function getStoredLanguage(storage: Pick<Storage, "getItem"> = localStorage): LanguageCode | null {
  const stored = storage.getItem(languageStorageKey);
  return isSupportedLanguage(stored) ? stored : null;
}

export function languageFromBrowserLanguages(languages: readonly string[]): LanguageCode | null {
  for (const value of languages) {
    const language = value.trim().toLowerCase();
    if (!language) continue;

    if (language.startsWith("vi")) return "vi";
    if (language.startsWith("ko")) return "ko";
    if (language.startsWith("zh")) return "zh-CN";
    if (language.startsWith("en")) return "en";
  }

  return null;
}

export function languageFromCountry(country?: string | null): LanguageCode {
  switch (country?.trim().toUpperCase()) {
    case "VN":
      return "vi";
    case "KR":
      return "ko";
    case "CN":
      return "zh-CN";
    default:
      return defaultLanguage;
  }
}

export function localizePath(path: string, language: LanguageCode): string {
  if (!path.startsWith("/")) return path;

  const locale = urlLocaleFromLanguage(language);
  const suffixIndex = path.search(/[?#]/u);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : path.slice(suffixIndex);
  const segments = pathname.split("/");

  if (isUrlLocale(segments[1])) {
    segments[1] = locale;
    return `${segments.join("/") || `/${locale}`}${suffix}`;
  }

  return pathname === "/"
    ? `/${locale}${suffix}`
    : `/${locale}${pathname}${suffix}`;
}

export function replacePathLocale(pathname: string, language: LanguageCode): string {
  const locale = urlLocaleFromLanguage(language);
  const segments = pathname.split("/");

  if (isUrlLocale(segments[1])) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}
