// maps to version 1.0.0 from the backend
// backend version is formatted as semver patches, but minor patches are
// ignored (ingame 1.2 is saved as 1.2.0 in the backend)
export const BASE_1_0 = new Date(2023, 3, 26, 0, 0, 0);

export const LANG = {
  cn: "简体中文",
  cht: "繁體中文",
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  id: "Bahasa Indonesia",
  jp: "日本語",
  kr: "한국어",
  pt: "Português",
  ru: "Русский",
  th: "ภาษาไทย",
  vi: "Tiếng Việt",
} as const;
