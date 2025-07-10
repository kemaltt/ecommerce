import { useLocation } from "wouter";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

const pageNames = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/products": "Products",
  "/customers": "Customers",
  "/marketplaces": "Marketplaces",
};

type ThemeMode = "light" | "dark" | "system";

export default function Header() {
  const [location] = useLocation();
  const currentPageName = pageNames[location as keyof typeof pageNames] || "Dashboard";
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as ThemeMode) || "system";
    }
    return "system";
  });

  const getActiveTheme = () => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return theme;
  };

  useEffect(() => {
    const applyTheme = () => {
      const active = getActiveTheme();
      if (active === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    applyTheme();
    if (theme === "system") {
      const listener = () => applyTheme();
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);
      return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const modes: ThemeMode[] = ["light", "dark", "system"];
  const icons: Record<ThemeMode, JSX.Element> = {
    light: <Sun className="w-5 h-5 text-yellow-500" />,
    dark: <Moon className="w-5 h-5" />,
    system: <Monitor className="w-5 h-5" />,
  };
  const labels: Record<ThemeMode, string> = {
    light: "Açık Mod",
    dark: "Koyu Mod",
    system: "Sistem Modu",
  };
  const nextMode = () => {
    const idx = modes.indexOf(theme);
    setTheme(modes[(idx + 1) % modes.length]);
  };

  return (
    <header className="bg-gradient-to-r from-gray-700 to-gray-500 text-white shadow-md border-b border-gray-200 dark:border-border px-6 py-4  ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">{currentPageName}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={nextMode}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background dark:bg-muted hover:bg-muted dark:hover:bg-muted/40 transition-colors"
            title={labels[theme]}
            aria-label="Tema değiştir"
            type="button"
          >
            {icons[theme]}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-foreground">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
