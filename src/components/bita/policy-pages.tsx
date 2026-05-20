"use client";

import { useTranslations } from "next-intl";
import { type PageView } from "./navbar";
import {
    ShieldCheck,
    FileText,
    Truck,
    ArrowLeft,
    Calendar,
    Lock,
    Globe,
    Scale
} from "lucide-react";

interface PolicyPagesProps {
    view: "terms" | "privacy" | "carrier";
    onBack: () => void;
}

export function PolicyPages({ view, onBack }: PolicyPagesProps) {
    const t = useTranslations("Policies");
    const tGlobal = useTranslations("Navbar");

    const getContent = () => {
        switch (view) {
            case "terms":
                return {
                    title: t("termsTitle"),
                    icon: FileText,
                    badge: t("termsBadge"),
                    updated: t("termsUpdated"),
                    sections: [
                        { h: t("termsH1"), p: t("termsP1") },
                        { h: t("termsH2"), p: t("termsP2") },
                        { h: t("termsH3"), p: t("termsP3") },
                        { h: t("termsH4"), p: t("termsP4") },
                        { h: t("termsH5"), p: t("termsP5") },
                    ]
                };
            case "privacy":
                return {
                    title: t("privacyTitle"),
                    icon: ShieldCheck,
                    badge: t("privacyBadge"),
                    updated: t("privacyUpdated"),
                    sections: [
                        { h: t("privacyH1"), p: t("privacyP1") },
                        { h: t("privacyH2"), p: t("privacyP2") },
                        { h: t("privacyH3"), p: t("privacyP3") },
                        { h: t("privacyH4"), p: t("privacyP4") },
                        { h: t("privacyH5"), p: t("privacyP5") },
                    ]
                };
            case "carrier":
                return {
                    title: t("carrierTitle"),
                    icon: Truck,
                    badge: t("carrierBadge"),
                    updated: t("carrierUpdated"),
                    sections: [
                        { h: t("carrierH1"), p: t("carrierP1") },
                        { h: t("carrierH2"), p: t("carrierP2") },
                        { h: t("carrierH3"), p: t("carrierP3") },
                        { h: t("carrierH4"), p: t("carrierP4") },
                        { h: t("carrierH5"), p: t("carrierP5") },
                    ]
                };
        }
    };

    const content = getContent();
    const Icon = content.icon;

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Navigation */}
                <button
                    onClick={onBack}
                    className="group mb-8 flex items-center gap-2 text-sm font-semibold text-black/40 dark:text-white/40 hover:text-brand-red transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    {t("backToHome")}
                </button>

                {/* Header Section */}
                <div className="bg-black text-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 mb-10 overflow-hidden relative border border-white/5 shadow-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-[100px] opacity-10 -ml-16 -mb-16" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-6">
                            <Icon className="w-3.5 h-3.5 text-brand-red" />
                            <span className="text-[10px] font-bold tracking-wider uppercase text-white/80">
                                {content.badge}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                            {content.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-xs text-white/40">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{content.updated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
                                <span>{t("secureCloud")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5" />
                                <span>{t("globalApplicability")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-12 mb-20">
                    {content.sections.map((section, idx) => (
                        <div key={idx} className="relative pl-0 md:pl-8 group">
                            {/* Timeline dot decoration - desktop only */}
                            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-black/[0.06] dark:bg-white/[0.06] mt-2 mb-2" />
                            <div className="hidden md:block absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-brand-red transition-colors" />

                            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-4 tracking-tight flex items-center gap-3">
                                <span className="text-xs font-black text-brand-red/30 dark:text-brand-red/50 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                                {section.h}
                            </h2>
                            <p className="text-base text-black/50 dark:text-white/50 leading-relaxed max-w-3xl">
                                {section.p}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Summary / Confirmation Box */}
                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <Scale className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                        {t("legallyBinding")}
                    </h3>
                    <p className="text-sm text-black/40 dark:text-white/40 max-w-md mx-auto mb-6">
                        {t("legallyDesc")}
                    </p>
                    <button
                        onClick={onBack}
                        className="text-xs font-bold text-brand-red hover:text-brand-red-dark transition-colors uppercase tracking-widest"
                    >
                        {t("iUnderstandBack")}
                    </button>
                </div>
            </div>
        </div>
    );
}
