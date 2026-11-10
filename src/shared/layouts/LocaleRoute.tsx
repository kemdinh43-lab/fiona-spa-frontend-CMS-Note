import { useLayoutEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useSiteContent } from "../hooks/useSiteContent";
import {
  isUrlLocale,
  languageFromUrlLocale
} from "../i18n/locale";

export function LocaleRoute() {
  const { locale } = useParams();
  const { language, setLanguage } = useSiteContent();
  const routeLanguage = isUrlLocale(locale)
    ? languageFromUrlLocale(locale)
    : null;

  useLayoutEffect(() => {
    if (!routeLanguage) return;
    if (language !== routeLanguage) setLanguage(routeLanguage, false);
    document.documentElement.lang = routeLanguage;
  }, [language, routeLanguage, setLanguage]);

  if (!routeLanguage) return <Navigate to="/en" replace />;
  if (language !== routeLanguage) return null;
  return <Outlet />;
}
