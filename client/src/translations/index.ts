import { LanguageCode } from "@/contexts/LanguageContext";
import en from "./en.json";
import fr from "./fr.json";
import de from "./de.json";
import es from "./es.json";
import zh from "./zh.json";
import ar from "./ar.json";
import ru from "./ru.json";
import pt from "./pt.json";

/**
 * Static translations object containing all manual translations
 * This is used for UI elements, navigation, forms, and other static content
 */
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

/**
 * Type for translation keys - allows TypeScript autocomplete for translation paths
 */
export type TranslationKey = keyof typeof en;

/**
 * Deeply nested translation key paths for dot notation access
 */
export type DeepTranslationKey = 
  | "navigation.home"
  | "navigation.journeys"
  | "navigation.meetups"
  | "navigation.innerNutrition"
  | "navigation.sages"
  | "navigation.ashrams"
  | "navigation.dailyQuotes"
  | "navigation.login"
  | "navigation.signUp"
  | "navigation.logout"
  | "navigation.myCollection"
  | "navigation.welcome"
  | "navigation.about"
  | "navigation.loading"
  | "navigation.whyIndianPhilosophies"
  | "navigation.understandingPhilosophies"
  | "navigation.aboutUs"
  | "navigation.howWeExplore"
  | "hero.title"
  | "hero.subtitle"
  | "hero.cta"
  | "hero.secondaryCta"
  | "hero.trustedPartners"
  | "about.title"
  | "about.description"
  | "contact.title"
  | "contact.name"
  | "contact.email"
  | "contact.subject"
  | "contact.message"
  | "contact.send"
  | "contact.success"
  | "auth.login"
  | "auth.register"
  | "auth.forgotPassword"
  | "auth.resetPassword"
  | "auth.firstName"
  | "auth.lastName"
  | "auth.email"
  | "auth.password"
  | "auth.confirmPassword"
  | "auth.loginButton"
  | "auth.registerButton"
  | "auth.forgotPasswordButton"
  | "auth.resetPasswordButton"
  | "auth.alreadyHaveAccount"
  | "auth.dontHaveAccount"
  | "auth.backToLogin"
  | "dashboard.title"
  | "dashboard.noBookmarks"
  | "dashboard.journeys"
  | "dashboard.sages"
  | "dashboard.ashrams"
  | "dashboard.articles"
  | "common.loading"
  | "common.readMore"
  | "common.learnMore"
  | "common.viewDetails"
  | "common.bookNow"
  | "common.register"
  | "common.search"
  | "common.filter"
  | "common.all"
  | "common.featured"
  | "common.popular"
  | "common.recent"
  | "common.save"
  | "common.cancel"
  | "common.close"
  | "footer.tagline"
  | "footer.madeWithLove"
  | "footer.explore"
  | "footer.satsang"
  | "footer.insights"
  | "footer.community"
  | "footer.newsletter"
  | "footer.joinUs"
  | "footer.memberLogin"
  | "footer.connect"
  | "footer.aboutUs"
  | "footer.contact"
  | "footer.social"
  | "footer.copyright"
  | "footer.privacy"
  | "footer.terms"
  | "footer.subscribeNewsletter"
  | "footer.subscribe";

/**
 * Utility function to get nested translation value using dot notation
 * @param obj - Translation object
 * @param path - Dot-separated path like "navigation.home"
 * @returns Translation value or fallback
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
}

/**
 * Get translation for a specific language and key
 * @param language - Language code
 * @param key - Translation key or dot-separated path
 * @param fallback - Fallback text if translation not found
 * @returns Translated text
 */
export function getTranslation(
  language: LanguageCode,
  key: DeepTranslationKey,
  fallback?: string
): string {
  const languageTranslations = translations[language];
  const translation = getNestedValue(languageTranslations, key);
  
  // If translation not found, try English as fallback
  if (translation === key && language !== 'en') {
    const englishTranslation = getNestedValue(translations.en, key);
    return englishTranslation !== key ? englishTranslation : (fallback || key);
  }
  
  return translation || fallback || key;
}
