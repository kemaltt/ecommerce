import React, { useMemo, useState, useEffect, createContext, useContext } from "react";
import { IntlProvider } from "react-intl";
import en from "./en";
import de from "./de";
import tr from "./tr";

const MESSAGES: Record<string, Record<string, string>> = {
  en,
  de,
  tr,
};

export type Locale = "en" | "de" | "tr";

export const DEFAULT_LOCALE: Locale = "en";
const STORAGE_KEY = "locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within I18nProvider");
  return ctx;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "de" || stored === "tr") return stored;
    } catch {
      // ignore
    }
    return DEFAULT_LOCALE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const messages = useMemo(() => {
    const m = MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE];
    return m;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages} defaultLocale={DEFAULT_LOCALE} onError={() => {}}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

export default I18nProvider;
