import { useLocation, useNavigate } from "react-router-dom";
import { useSiteContent } from "../hooks/useSiteContent";
import { replacePathLocale } from "../i18n/locale";
import type { LanguageCode } from "../types/spa";

const languages = [
  { code: "en" as const, labelKey: "language.english", label: "English" },
  { code: "ko" as const, labelKey: "language.korean", label: "한국어" },
  { code: "vi" as const, labelKey: "language.vietnamese", label: "Tiếng Việt" },
  { code: "zh-CN" as const, labelKey: "language.chinese", label: "中文" }
];

function FlagIcon({ language }: { language: LanguageCode }) {
  if (language === "vi") {
    return (
      <svg viewBox="0 0 30 20" className="h-4 w-6 overflow-hidden rounded-sm shadow-sm" aria-hidden="true">
        <rect width="30" height="20" fill="#da251d" />
        <path d="m15 4 1.47 4.53h4.76l-3.85 2.8 1.47 4.52L15 13.05l-3.85 2.8 1.47-4.52-3.85-2.8h4.76z" fill="#ff0" />
      </svg>
    );
  }

  if (language === "ko") {
    return (
      <svg viewBox="0 0 30 20" className="h-4 w-6 overflow-hidden rounded-sm shadow-sm" aria-hidden="true">
        <rect width="30" height="20" fill="#fff" />
        <path d="M15 6a4 4 0 0 1 0 8 2 2 0 0 0 0-4 2 2 0 0 1 0-4Z" fill="#0047a0" />
        <path d="M15 14a4 4 0 0 1 0-8 2 2 0 0 0 0 4 2 2 0 0 1 0 4Z" fill="#cd2e3a" />
        <g stroke="#111" strokeWidth="1">
          <path d="M5 4l4 2M4.5 5l4 2M21 13l4 2M21.5 12l4 2" />
          <path d="M21 6l4-2M21.5 7l4-2M5 16l4-2M4.5 15l4-2" />
        </g>
      </svg>
    );
  }

  if (language === "zh-CN") {
    return (
      <svg viewBox="0 0 30 20" className="h-4 w-6 overflow-hidden rounded-sm shadow-sm" aria-hidden="true">
        <rect width="30" height="20" fill="#de2910" />
        <path d="m6 3 1 3h3L7.6 7.8l.9 3L6 9 3.5 10.8l.9-3L2 6h3z" fill="#ffde00" />
        <g fill="#ffde00">
          <circle cx="12" cy="3.2" r=".8" />
          <circle cx="14.2" cy="5.2" r=".8" />
          <circle cx="14" cy="8" r=".8" />
          <circle cx="11.5" cy="9.8" r=".8" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 30 20" className="h-4 w-6 overflow-hidden rounded-sm shadow-sm" aria-hidden="true">
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0l30 20M30 0 0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0l30 20M30 0 0 20" stroke="#c8102e" strokeWidth="2" />
      <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
      <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { language: active, setLanguage, t } = useSiteContent();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (language: LanguageCode) => {
    setLanguage(language);
    navigate({
      pathname: replacePathLocale(location.pathname, language),
      search: location.search,
      hash: location.hash
    });
  };

  return (
    <div
      className="flex items-center gap-1"
      aria-label={t("language.switcher", "Chọn ngôn ngữ")}
    >
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          title={t(language.labelKey, language.label)}
          aria-label={t(language.labelKey, language.label)}
          aria-pressed={active === language.code}
          onClick={() => changeLanguage(language.code)}
          className={`grid h-9 w-10 place-items-center rounded-full transition ${
            active === language.code
              ? "bg-blush shadow-sm"
              : "bg-transparent hover:bg-blush/50"
          }`}
        >
          <FlagIcon language={language.code} />
        </button>
      ))}
    </div>
  );
}
