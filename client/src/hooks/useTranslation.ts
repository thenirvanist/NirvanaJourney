import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

/**
 * useTranslation - Hook for accessing static translations
 * 
 * This hook provides access to manual translations stored in JSON files.
 * Use this for all static UI content like navigation, forms, buttons, etc.
 * 
 * @returns Object with translation function and current language info
 */
export function useTranslation() {
  const { currentLanguage, isTranslating } = useLanguage();

  /**
   * Get a static translation for the current language
   * @param key - Translation key using dot notation (e.g., "navigation.home")
   * @param fallback - Optional fallback text if translation not found
   * @returns Translated text
   */
  const t = (key: string, fallback?: string): string => {
    return getTranslation(currentLanguage, key, fallback);
  };

  /**
   * Get multiple translations at once
   * @param keys - Array of translation keys
   * @returns Object with key-value pairs of translations
   */
  const tMultiple = (keys: string[]) => {
    return keys.reduce((acc, key) => {
      acc[key] = t(key);
      return acc;
    }, {} as Record<string, string>);
  };

  return {
    t,
    tMultiple,
    currentLanguage,
    isTranslating,
    isEnglish: currentLanguage === 'en',
  };
}