import { useState, useEffect, useCallback } from "react";
import {
  Globe,
  ChevronDown,
  MapPin,
  Phone,
  User,
  Search,
  X,
  Menu,
  Home,
  Info,
  Headphones,
  Check,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export type PageView = "home" | "about" | "support" | "terms" | "privacy" | "carrier";

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onScrollTo: (id: string) => void;
}

export function Navbar({ currentPage, onNavigate, onScrollTo }: NavbarProps) {
  const t = useTranslations("Navbar");
  const tSupport = useTranslations("SupportPage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // search functionality
    }
    setSearchOpen(false);
    setSearchValue("");
  };

  const handleNavClick = useCallback(
    (page: PageView) => {
      onNavigate(page);
      setMobileMenuOpen(false);
      if (page === "home") {
        setTimeout(() => onScrollTo("hero"), 100);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onNavigate, onScrollTo]
  );

  const switchLanguage = (newLocale: "en" | "am") => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuOpen(false);
  };

  const navItems = [
    { label: t("home"), page: "home" as PageView, icon: Home },
    { label: t("about"), page: "about" as PageView, icon: Info },
    { label: t("support"), page: "support" as PageView, icon: Headphones },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "am", name: "Amharic (አማርኛ)" },
  ];

  return (
    <>
      <ThemeToggle />

      {/* Top Bar */}
      <div className="bg-black text-white dark:bg-white dark:text-black text-xs hidden md:block transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 hover:text-brand-red transition-colors"
                onBlur={() => setTimeout(() => setLangMenuOpen(false), 200)}
              >
                <Globe className="w-3.5 h-3.5" />
                {languages.find(l => l.code === locale)?.name}
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg shadow-xl z-[60] overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code as "en" | "am")}
                      className={`w-full text-left px-3 py-2 text-[11px] flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${locale === lang.code ? "text-brand-red font-bold" : "text-black/70 dark:text-white/70"
                        }`}
                    >
                      {lang.name}
                      {locale === lang.code && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1 hover:text-brand-red transition-colors">
              <MapPin className="w-3.5 h-3.5" /> {tSupport("ethiopia") || "Ethiopia"}{" "}
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${tSupport("callDetail")?.replace(/\s+/g, "") || "+251946766667"}`}
              className="flex items-center gap-1 hover:text-brand-red transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5" /> {tSupport("callDetail") || "+251 94 676 6667"}
            </a>
            <span className="text-white/20 dark:text-black/20">|</span>
            <a
              href="/auth/login"
              className="flex items-center gap-1 hover:text-brand-red transition-colors"
            >
              <User className="w-3.5 h-3.5" /> {t("logIn")}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl transition-all duration-500 ${scrolled ? "shadow-lg shadow-black/5 dark:shadow-black/20" : ""
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-[68px]">
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center shrink-0"
          >
            <img
              src="https://z-cdn-media.chatglm.cn/files/aadb4316-9e0c-4244-832d-fdb53765d1ed.png?auth_key=1877574723-2941d9d585774f4f97ed9c01016d4d86-0-e56397bb508db8ef7277ffdff393dce4"
              alt="BITA Express Logo"
              className="h-11 md:h-13 w-auto object-contain"
            />
          </button>

          <nav className="hidden lg:flex items-center gap-1 h-full">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`relative px-5 h-full flex items-center text-sm font-medium transition-colors ${currentPage === item.page
                  ? "text-brand-red"
                  : "text-black/60 dark:text-white/60 hover:text-brand-red"
                  }`}
              >
                <item.icon className="w-4 h-4 mr-1.5" />
                {item.label}
                {currentPage === item.page && (
                  <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-brand-red rounded-full" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder={t("search")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-48 md:w-64 px-3 py-2 text-sm border border-black/15 dark:border-white/15 bg-transparent rounded-l focus:outline-none focus:border-brand-red text-black dark:text-white placeholder-black/30 dark:placeholder-white/30"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-brand-red text-white px-3 py-2 rounded-r hover:bg-brand-red-dark transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="ml-1 p-2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-black/50 dark:text-white/50 hover:text-brand-red transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-black dark:text-white hover:text-brand-red"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-black border-t border-black/5 dark:border-white/10 shadow-lg transition-colors duration-500">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full text-left px-6 py-3.5 text-sm font-medium border-b border-black/5 dark:border-white/10 transition-colors flex items-center gap-2 ${currentPage === item.page
                  ? "text-brand-red bg-brand-red/5"
                  : "text-black dark:text-white hover:text-brand-red hover:bg-brand-red/5"
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            {/* Mobile Language Switcher */}
            <div className="px-6 py-4 flex items-center gap-4 bg-black/[0.02] dark:bg-white/[0.02]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code as "en" | "am")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${locale === lang.code
                    ? "bg-brand-red text-white border-brand-red"
                    : "bg-transparent text-black/50 dark:text-white/50 border-black/10 dark:border-white/10"
                    }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
