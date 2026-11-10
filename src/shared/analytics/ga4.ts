export type AnalyticsEventParameters = Record<
  string,
  string | number | boolean | undefined
>;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const googleTagScriptId = "fiona-google-tag";
const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
const configuredSiteUrl = (import.meta.env.VITE_SITE_URL ?? "https://fionaspadanang.com").trim();

let analyticsConfigured = false;

function ensureGtag(): Gtag {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag() {
    window.dataLayer?.push(arguments);
  };
  return window.gtag;
}

function isValidMeasurementId(value: string): boolean {
  return /^G-[A-Z0-9]+$/u.test(value);
}

function isAllowedHostname(): boolean {
  if (import.meta.env.DEV && import.meta.env.VITE_GA_DEBUG === "true") return true;

  try {
    const productionHostname = new URL(configuredSiteUrl).hostname;
    return window.location.hostname === productionHostname;
  } catch {
    return false;
  }
}

export function initializeAnalytics(): boolean {
  if (!isValidMeasurementId(measurementId) || !isAllowedHostname()) return false;
  if (analyticsConfigured) return true;

  const gtag = ensureGtag();
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted"
  });

  const script = document.createElement("script");
  script.id = googleTagScriptId;
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  analyticsConfigured = true;
  return true;
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters: AnalyticsEventParameters = {}
) {
  if (!initializeAnalytics()) return;

  const safeParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== undefined)
  );
  ensureGtag()("event", eventName, safeParameters);
}

export function getAnalyticsSetupStatus() {
  return {
    hasValidMeasurementId: isValidMeasurementId(measurementId),
    isAllowedHostname: isAllowedHostname(),
    isConfigured: analyticsConfigured
  };
}
