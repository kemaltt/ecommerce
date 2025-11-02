import React from "react";
import { useLocale } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const OPTIONS: { id: "en" | "de" | "tr"; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "tr", label: "Türkçe", flag: "🇹🇷" },
];

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale();

  const current = OPTIONS.find((o) => o.id === locale) || OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-2 flex items-center gap-2">
          <span className="text-lg">{current.flag}</span>
          <span className="hidden sm:inline text-sm font-medium">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.id}
            onClick={() => {
              setLocale(opt.id);
              // debug log to help verify locale changes
              // eslint-disable-next-line no-console
              console.log(`LanguageSwitcher: setLocale -> ${opt.id}`);
            }}
            className="flex items-center gap-3"
          >
            <span className="text-lg">{opt.flag}</span>
            <span className="text-sm">{opt.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
