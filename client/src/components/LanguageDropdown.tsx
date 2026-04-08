import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/contexts/LanguageContext";

/**
 * LanguageDropdown - Language selection component for navigation bar
 * 
 * Features:
 * - Displays current language with flag and name
 * - Dropdown menu with all supported languages
 * - Smooth transitions and loading states
 * - Optimized for both desktop and mobile views
 * - Persists selection to localStorage via LanguageContext
 */
export function LanguageDropdown() {
  const { currentLanguage, setLanguage, isTranslating, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = availableLanguages[currentLanguage];

  const handleLanguageChange = (languageCode: LanguageCode) => {
    if (languageCode !== currentLanguage) {
      setLanguage(languageCode);
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1.5"
          data-testid="button-language-dropdown"
        >
          <span className="text-lg leading-none">{currentLang.flag}</span>
          <span className="font-medium text-sm">{currentLang.code.toUpperCase()}</span>
          {isTranslating ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg"
      >
        {Object.entries(availableLanguages).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as LanguageCode)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[hsl(70,71%,62%)]/20 transition-colors ${
              currentLanguage === code ? "bg-[hsl(70,71%,62%)]/10 font-semibold" : ""
            }`}
            data-testid={`menu-language-${code}`}
          >
            <span className="text-xl">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {lang.name}
              </span>
              <span className="text-xs text-gray-500 uppercase">
                {lang.code}
              </span>
            </div>
            {currentLanguage === code && (
              <div className="ml-auto w-2 h-2 rounded-full bg-[hsl(70,71%,62%)]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}