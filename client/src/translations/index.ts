import { LanguageCode } from "@/contexts/LanguageContext";
import en from "./en.json";
import fr from "./fr.json";
import de from "./de.json";
import es from "./es.json";
import zh from "./zh.json";
import ar from "./ar.json";
import ru from "./ru.json";
import pt from "./pt.json";

export const translations = {
  en,
  fr,
  de,
  es,
  zh,
  ar,
  ru,
  pt,
} as const;

export type TranslationKey = keyof typeof en;

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

export function getTranslation(
  language: LanguageCode,
  key: string,
  fallback?: string
): string {
  const languageTranslations = translations[language];
  const translation = getNestedValue(languageTranslations, key);
  
  if (translation === key && language !== 'en') {
    const englishTranslation = getNestedValue(translations.en, key);
    return englishTranslation !== key ? englishTranslation : (fallback || key);
  }
  
  return translation || fallback || key;
}
