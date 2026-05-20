"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { PageView } from "./navbar";

interface FooterProps {
  onScrollTo: (id: string) => void;
  onSwitchTab: (tab: "track" | "quote") => void;
  onOpenModal: (modal: string) => void;
  onNavigate?: (page: PageView) => void;
}

export function Footer({ onScrollTo, onSwitchTab, onOpenModal, onNavigate }: FooterProps) {
  const t = useTranslations("Footer");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (page: PageView) => {
    if (onNavigate) {
      onNavigate(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-black text-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
              <img
                src="https://z-cdn-media.chatglm.cn/files/aadb4316-9e0c-4244-832d-fdb53765d1ed.png?auth_key=1877574723-2941d9d585774f4f97ed9c01016d4d86-0-e56397bb508db8ef7277ffdff393dce4"
                alt="BITA Express"
                className="h-12 w-auto object-contain mb-4 brightness-0 invert"
              />
              <p className="text-xs text-white/25 leading-relaxed mb-4">
                {t("tagline")}
              </p>
              <a
                href="tel:+251946766667"
                className="text-sm text-white/40 hover:text-brand-red transition-colors font-medium"
              >
                +251 94 676 6667
              </a>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
                {t("colShipping")}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("home");
                      else onScrollTo("hero");
                      onSwitchTab("quote");
                    }}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("getQuote")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("home");
                      else onScrollTo("hero");
                      onSwitchTab("track");
                    }}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("trackShipment")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenModal("pickup")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("schedulePickup")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenModal("locations")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("dropoff")}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
                {t("colResources")}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate("home");
                      else onScrollTo("docs");
                    }}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("docChecklist")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenModal("restricted")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("restricted")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => toast("Opening customs estimator...")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("customs")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => toast("Opening guides...")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("guides")}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
                {t("colSupport")}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => onOpenModal("claim")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("fileClaim")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("support")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("contactUs")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("support")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("faqs")}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
                {t("colCompany")}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => navigateTo("about")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("aboutUs")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => toast("Careers — 8 open positions...")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("careers")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("privacy")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("privacy")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("terms")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("terms")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("carrier")}
                    className="text-sm text-white/30 hover:text-brand-red transition-colors"
                  >
                    {t("carrier")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/15">
              {t("copyright")}
            </span>
            <div className="flex items-center gap-2">
              {[
                { label: "Tg", msg: "Opening Telegram..." },
                { label: "Fb", msg: "Opening Facebook..." },
                { label: "Li", msg: "Opening LinkedIn..." },
                { label: "X", msg: "Opening X..." },
              ].map((social) => (
                <button
                  key={social.label}
                  onClick={() => toast(social.msg)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-red flex items-center justify-center text-[11px] text-white/25 hover:text-white transition-all"
                >
                  {social.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 left-6 z-50 w-10 h-10 bg-brand-red text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-red-dark transition-all ${showScrollTop
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
          }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </>
  );
}
