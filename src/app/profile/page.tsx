// TODO: config provider
// name input

export const metadata = {
  title: "Character Profile",
  description: "Honkai Star Rail Character Profile & Character Card",
};

export default async function Profile() {
  return (
    <main>
      <div>uid here</div>
      <div>lang select</div>
    </main>
  );
}

const IMG_REPO = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master";
export const img = (suffix: string) =>
  suffix.startsWith("/") ? IMG_REPO + suffix : IMG_REPO + "/" + suffix;

const LANG = {
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
