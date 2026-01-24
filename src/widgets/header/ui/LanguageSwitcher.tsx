import { useTranslation } from "react-i18next";

import { GlobeIcon } from "lucide-react";

import { type Language, SUPPORTED_LANGUAGES } from "@/shared/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const languageLabels: Record<Language, string> = {
  en: "English",
};

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (value: Language | null) => {
    if (value) {
      i18n.changeLanguage(value);
    }
  };

  return (
    <Select
      value={i18n.language as Language}
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger aria-label={t("language.select")}>
        <SelectValue>
          <GlobeIcon className="size-4" />
          <span className="hidden sm:inline">
            {languageLabels[i18n.language as Language] ?? i18n.language}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {languageLabels[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
