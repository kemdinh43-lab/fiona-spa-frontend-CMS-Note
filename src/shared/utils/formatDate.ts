import type { LanguageCode } from "../types/spa";

const locales: Record<LanguageCode, string> = {
  en: "en-GB",
  vi: "vi-VN",
  ko: "ko-KR",
  "zh-CN": "zh-CN"
};

export const formatDate = (value: string, language: LanguageCode = "en"): string =>
  new Intl.DateTimeFormat(locales[language], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));

export const bookingTimes = Array.from({ length: 57 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
});
