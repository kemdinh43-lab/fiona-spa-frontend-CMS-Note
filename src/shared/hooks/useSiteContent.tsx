import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren
} from "react";
import {
  fetchSiteContent,
  getFallbackSiteContent
} from "../services/contentService";
import type {
  LanguageCode,
  ServiceTranslationFields,
  SiteContentResponse
} from "../types/spa";
import {
  defaultLanguage,
  getStoredLanguage,
  languageStorageKey
} from "../i18n/locale";

export type Translate = (
  key: string,
  fallback?: string,
  values?: Record<string, string | number>
) => string;

interface SiteContentContextValue extends SiteContentResponse {
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  language: LanguageCode;
  setLanguage: (language: LanguageCode, persistPreference?: boolean) => void;
  t: Translate;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);
const minimumRefreshMs = 10 * 60_000;

function getInitialLanguage(): LanguageCode {
  return getStoredLanguage() || defaultLanguage;
}

function applyServiceTranslation<T extends ServiceTranslationFields>(
  item: T,
  translation?: ServiceTranslationFields
): T {
  return {
    ...item,
    ...translation
  };
}

function phoneHrefFromDisplay(phone: string, fallback: string): string {
  const digits = phone.replace(/\D/gu, "");
  if (!digits) return fallback;
  const internationalDigits = digits.startsWith("0")
    ? `84${digits.slice(1)}`
    : digits;
  return `tel:+${internationalDigits}`;
}

export function SiteContentProvider({ children }: PropsWithChildren) {
  const [content, setContent] = useState<SiteContentResponse>(getFallbackSiteContent);
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequest = useRef<AbortController | null>(null);

  const load = useCallback(async (bypassCache = false) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;

    try {
      const nextContent = await fetchSiteContent(controller.signal, bypassCache);
      setContent(nextContent);
      setError(null);
    } catch (loadError) {
      if (controller.signal.aborted) return;
      console.warn("[site-content] Using local fallback content.", loadError);
      setError(loadError instanceof Error ? loadError.message : "Unable to load site content");
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(() => load(true), [load]);
  const setLanguage = useCallback(
    (nextLanguage: LanguageCode, persistPreference = true) => {
      setLanguageState(nextLanguage);
      if (persistPreference) {
        localStorage.setItem(languageStorageKey, nextLanguage);
      }
      document.documentElement.lang = nextLanguage;
    },
    []
  );

  useEffect(() => {
    void load();
    const configuredRefreshMs = Number(import.meta.env.VITE_SITE_CONTENT_REFRESH_MS);
    const refreshMs = Number.isFinite(configuredRefreshMs)
      ? Math.max(configuredRefreshMs, minimumRefreshMs)
      : minimumRefreshMs;
    const interval = window.setInterval(() => void load(), refreshMs);

    return () => {
      activeRequest.current?.abort();
      window.clearInterval(interval);
    };
  }, [load]);

  const value = useMemo(() => {
    const t: Translate = (key, fallback = key, values) => {
      const template =
        content.translations[language]?.[key] ||
        content.translations.en?.[key] ||
        content.translations.vi?.[key] ||
        fallback;
      if (!values) return template;
      return Object.entries(values).reduce(
        (text, [name, replacement]) =>
          text.split(`{${name}}`).join(String(replacement)),
        template
      );
    };
    const localizedFields = (id: string) =>
      content.serviceTranslations[id]?.[language] ||
      content.serviceTranslations[id]?.en ||
      content.serviceTranslations[id]?.vi;
    const hotline = t("brand.hotline", content.brand.hotline);

    return {
      ...content,
      brand: {
        ...content.brand,
        hotline,
        phoneHref: phoneHrefFromDisplay(hotline, content.brand.phoneHref),
        address: t("brand.address", content.brand.address),
        slogan: t("brand.slogan", content.brand.slogan)
      },
      serviceCategories: content.serviceCategories.map((category) =>
        applyServiceTranslation(category, localizedFields(category.id))
      ),
      spaServices: content.spaServices.map((service) =>
        applyServiceTranslation(service, localizedFields(service.id))
      ),
      spaPackages: content.spaPackages.map((item) =>
        applyServiceTranslation(item, localizedFields(item.id))
      ),
      reviews: content.reviews.map((review) => ({
        ...review,
        country: review.country
          ? t(`reviews.country.${review.country.toLowerCase()}`, review.country)
          : review.country,
        content: t(`reviews.${review.id}.content`, review.content)
      })),
      blogPosts: content.blogPosts.map((post) => {
        const translation =
          post.translations?.[language] || post.translations?.en || post.translations?.vi;
        return { ...post, ...translation };
      }),
      galleryImages: content.galleryImages.map((item) => {
        const translation =
          item.translations?.[language] || item.translations?.en || item.translations?.vi;
        return { ...item, ...translation };
      }),
      isLoading,
      error,
      refresh,
      language,
      setLanguage,
      t
    };
  }, [content, error, isLoading, language, refresh, setLanguage]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentContextValue {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return context;
}
