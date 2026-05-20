"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  MessageSquare,
  AlertTriangle,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { reportIssue, clearIssueReport, IssueType } from "@/store/issuesSlice";

// The faqs and issueTypes will be moved inside the component to use translations

export function SupportPage() {
  const t = useTranslations("SupportPage");
  const dispatch = useAppDispatch();
  const { loading: issueLoading } = useAppSelector((state) => state.issues);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [issueForm, setIssueForm] = useState({
    tracking: "",
    type: "",
    email: "",
    phone: "",
    description: "",
  });

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
    { q: t("faq5Q"), a: t("faq5A") },
    { q: t("faq6Q"), a: t("faq6A") },
    { q: t("faq7Q"), a: t("faq7A") },
    { q: t("faq8Q"), a: t("faq8A") },
  ];

  const issueTypes = [
    { value: "DAMAGED_ITEM", label: t("issueDamaged") },
    { value: "MISSING_ITEM", label: t("issueMissing") },
    { value: "LATE_DELIVERY", label: t("issueLate") },
    { value: "WRONG_ADDRESS", label: t("issueAddress") },
    { value: "PACKAGE_NOT_RECEIVED", label: t("issueNotReceived") },
    { value: "OTHER", label: t("issueOther") },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast(t("messageSent"));
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.type) {
      toast(t("selectIssueType"));
      return;
    }
    dispatch(reportIssue({
      trackingNumber: issueForm.tracking,
      issueType: issueForm.type as IssueType,
      email: issueForm.email,
      phone: issueForm.phone,
      description: issueForm.description,
    })).then((result) => {
      if (reportIssue.fulfilled.match(result)) {
        toast(t("issueReported"));
        setIssueForm({ tracking: "", type: "", email: "", phone: "", description: "" });
        dispatch(clearIssueReport());
      } else {
        toast(result.payload as string || "Failed to submit issue report.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Map Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 map-bg-light dark:hidden" />
          <div className="absolute inset-0 map-bg-dark hidden dark:block" />
          {/* Light mode: white frosted overlay */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] dark:hidden" />
          {/* Dark mode: reduced overlay to show map */}
          <div className="absolute inset-0 bg-black/35 hidden dark:block" />
          {/* Subtle red radial glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-red rounded-full blur-[200px] opacity-[0.06] dark:opacity-[0.08] pointer-events-none" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block text-black/70 dark:text-white/70 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {t("badge")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white leading-tight tracking-tight">
            {t("heading")}
          </h1>
          <p className="text-base md:text-lg text-black/70 dark:text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-8 bg-white dark:bg-black rounded-t-[2rem] transition-colors duration-500" />
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Phone,
                title: t("callUs"),
                detail: t("callDetail"),
                sub: t("callHours"),
                action: "tel:+251946766667",
                actionLabel: t("callNow"),
              },
              {
                icon: Mail,
                title: t("emailSupport"),
                detail: t("emailDetail"),
                sub: t("emailHours"),
                action: "mailto:Bitaexpresss@gmail.com",
                actionLabel: t("sendEmail"),
              },
              {
                icon: MapPin,
                title: t("visitUs"),
                detail: (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-black/70 dark:text-white/70">
                      <span className="font-semibold text-brand-red">{t("ethiopia")}</span>
                      <br />{t("ethiopiaAddress")}
                      <br />{t("ethiopiaAddress2")}
                      <a
                        href="https://maps.app.goo.gl/x9jbcQRoTU1VMGAz5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors"
                      >
                        {t("getDirections")}
                      </a>
                    </div>
                    <div className="text-sm font-medium text-black/70 dark:text-white/70">
                      <span className="font-semibold text-brand-red">{t("china")}</span>
                      <br />{t("chinaAddress")}
                      <br />{t("chinaAddress2")}
                      <a
                        href="https://maps.app.goo.gl/Ky2b9QQGMbiCvT1Z9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors"
                      >
                        {t("getDirections")}
                      </a>
                    </div>
                  </div>
                ),
                sub: t("callHours"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-6 hover:border-brand-red/20 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-red/8 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="text-base font-bold text-black dark:text-white mb-1">
                  {item.title}
                </h3>
                <div className="text-sm font-medium text-black/70 dark:text-white/70">
                  {item.detail}
                </div>
                <p className="text-xs text-black/35 dark:text-white/35 mt-0.5">
                  {item.sub}
                </p>
                <a
                  href={item.action}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:text-brand-red-dark mt-4 transition-colors"
                >
                  {item.actionLabel}{" "}
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Issue Report */}
      <section className="py-12 md:py-20 bg-black/[0.02] dark:bg-white/[0.02] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-red/8 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    {t("contactForm")}
                  </h3>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    {t("contactFormDesc")}
                  </p>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    {t("fullName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder={t("yourName")}
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    {t("email")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder={t("yourEmail")}
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    {t("subject")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder={t("yourSubject")}
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    {t("message")} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder={t("yourMessage")}
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {t("sendMessage")}
                </button>
              </form>
            </div>

            {/* Issue Report Form */}
            <div className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-red/8 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    {t("reportIssue")}
                  </h3>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    {t("reportIssueDesc")}
                  </p>
                </div>
              </div>
              <form onSubmit={handleIssueSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    {t("trackingNumber")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={issueForm.tracking}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, tracking: e.target.value })
                    }
                    placeholder={t("trackingPlaceholder")}
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    {t("issueType")} *
                  </label>
                  <select
                    required
                    value={issueForm.type}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, type: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">{t("selectIssue")}</option>
                    {issueTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                      {t("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={issueForm.email}
                      onChange={(e) =>
                        setIssueForm({ ...issueForm, email: e.target.value })
                      }
                      placeholder={t("yourEmail")}
                      className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                      {t("phone")}
                    </label>
                    <input
                      type="tel"
                      value={issueForm.phone}
                      onChange={(e) =>
                        setIssueForm({ ...issueForm, phone: e.target.value })
                      }
                      placeholder={t("phonePlaceholder")}
                      className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    {t("description")} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={issueForm.description}
                    onChange={(e) =>
                      setIssueForm({
                        ...issueForm,
                        description: e.target.value,
                      })
                    }
                    placeholder={t("descPlaceholder")}
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={issueLoading}
                  className="w-full bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white py-3.5 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {issueLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" /> {t("submitReport")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-xl bg-brand-red/8 flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-6 h-6 text-brand-red" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              {t("faqTitle")}
            </h2>
            <p className="text-base text-black/40 dark:text-white/40 mt-3">
              {t("faqDesc")}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                >
                  <span className="text-sm font-semibold text-black dark:text-white pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-black/30 dark:text-white/30 shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-96 pb-5" : "max-h-0"
                    }`}
                >
                  <div className="px-5 text-sm text-black/50 dark:text-white/50 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 md:py-16 bg-black/[0.02] dark:bg-white/[0.02] transition-colors duration-500">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-8 md:p-10">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">
              {t("stillNeedHelp")}
            </h3>
            <p className="text-sm text-black/40 dark:text-white/40 mb-6 max-w-md mx-auto">
              {t("stillNeedDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${t("callDetail").replace(/\s+/g, "")}`}
                className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 font-semibold rounded-xl transition-colors text-sm inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> {t("callUs")} {t("callDetail")}
              </a>
              <a
                href="mailto:support@bitaexpress.com"
                className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white px-6 py-3 font-semibold rounded-xl transition-colors text-sm inline-flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
              >
                <Mail className="w-4 h-4" /> {t("emailSupport2")}
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-black/25 dark:text-white/25">
              <Clock className="w-3.5 h-3.5" /> {t("hours2")}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
