"use client";

import { useState } from "react";
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

const faqs = [
  {
    q: "How do I track my shipment?",
    a: "Enter your tracking number (e.g., BITA-987654321) in the Track Shipment field on our homepage. You'll see real-time status updates, a full timeline, and a live map showing your package's location.",
  },
  {
    q: "What items are restricted or prohibited?",
    a: "Explosives, flammable liquids, toxic substances, radioactive material, live animals, counterfeit goods, and narcotics cannot be shipped. Items like lithium batteries, alcohol, perfume, and electronics can be shipped with restrictions. Check our Restricted Items page for the full list.",
  },
  {
    q: "How long does international shipping take?",
    a: "Express delivery takes 1-5 business days depending on the destination. Economy shipping takes 5-10 business days. Same-day delivery is available within the Addis Ababa metro area.",
  },
  {
    q: "What documents do I need to ship internationally?",
    a: "Required documents vary by shipment type. For documents: a completed waybill and valid ID. For commercial goods: commercial invoice, packing list, export license (if required), and certificate of origin. For personal effects: packing list, passport copy, and visa/residence permit.",
  },
  {
    q: "How do I file a claim for a lost or damaged package?",
    a: "You can file a claim through our Support page or by calling +251 11 123 4567. You'll need your tracking number, a description of the issue, and photos if the package is damaged. Average resolution time is 48 hours.",
  },
  {
    q: "Can I schedule a pickup?",
    a: "Yes! You can schedule a pickup from the homepage. We'll come to your door in Addis Ababa. Select your preferred date and time window, and our driver will arrive at your location.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept telebirr, CBE Birr, Awash Bank, cash at our branches, and all major credit/debit cards. Business customers can also set up monthly invoicing.",
  },
  {
    q: "Do you offer e-commerce integration?",
    a: "Yes! We integrate with Shopify, WooCommerce, and custom platforms via our API. Features include auto-fulfillment, bulk label generation, and real-time tracking updates for your customers.",
  },
];

const issueTypes = [
  { value: "DAMAGED_ITEM", label: "Damaged item" },
  { value: "MISSING_ITEM", label: "Missing item" },
  { value: "LATE_DELIVERY", label: "Late delivery" },
  { value: "WRONG_ADDRESS", label: "Wrong address" },
  { value: "PACKAGE_NOT_RECEIVED", label: "Package not received" },
  { value: "OTHER", label: "Other" },
];

export function SupportPage() {
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message sent! We'll respond within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.type) {
      toast("Please select an issue type");
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
        toast("Issue reported! Check your email for updates.");
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
            Support Center
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white leading-tight tracking-tight">
            We&apos;re here to help.
          </h1>
          <p className="text-base md:text-lg text-black/70 dark:text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
            Got a question, issue, or just need guidance? Our support team is
            available to assist you every step of the way.
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
                title: "Call Us",
                detail: "+251 94 676 6667",
                sub: "Mon–Sat, 8AM–6PM CAT",
                action: "tel:+251946766667",
                actionLabel: "Call now",
              },
              {
                icon: Mail,
                title: "Email Support",
                detail: "Bitaexpresss@gmail.com",
                sub: "Response within 24 hours",
                action: "mailto:Bitaexpresss@gmail.com",
                actionLabel: "Send email",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                detail: (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-black/70 dark:text-white/70">
                      <span className="font-semibold text-brand-red">Ethiopia</span>
                      <br />Addis Ababa, Bole Medhinalem
                      <br />Blen Building, 4th Floor, Office 404
                    </div>
                    <div className="text-sm font-medium text-black/70 dark:text-white/70">
                      <span className="font-semibold text-brand-red">China</span>
                      <br />Guangzhou City
                      <br />Central Plaza, Office 1503B
                    </div>
                  </div>
                ),
                sub: "Mon–Sat, 8AM–6PM",
                action: "#",
                actionLabel: "Get directions",
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
                    Contact Support
                  </h3>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    General inquiries and questions
                  </p>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    Subject *
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
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    Message *
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
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
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
                    Report an Issue
                  </h3>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    Problems with a specific shipment
                  </p>
                </div>
              </div>
              <form onSubmit={handleIssueSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={issueForm.tracking}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, tracking: e.target.value })
                    }
                    placeholder="BITA-XXXXXXXXX"
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    Issue Type *
                  </label>
                  <select
                    required
                    value={issueForm.type}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, type: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select issue type</option>
                    {issueTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={issueForm.email}
                      onChange={(e) =>
                        setIssueForm({ ...issueForm, email: e.target.value })
                      }
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={issueForm.phone}
                      onChange={(e) =>
                        setIssueForm({ ...issueForm, phone: e.target.value })
                      }
                      placeholder="+251 9XX XXX XXXX"
                      className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
                    Description *
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
                    placeholder="Describe the issue in detail..."
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
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" /> Submit Report
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
              Frequently Asked Questions
            </h2>
            <p className="text-base text-black/40 dark:text-white/40 mt-3">
              Quick answers to common questions.
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
                    className={`w-4 h-4 text-black/30 dark:text-white/30 shrink-0 mt-0.5 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-96 pb-5" : "max-h-0"
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
              Still need help?
            </h3>
            <p className="text-sm text-black/40 dark:text-white/40 mb-6 max-w-md mx-auto">
              Our team is available Monday through Saturday, 8AM to 6PM CAT.
              We typically respond within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+251111234567"
                className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 font-semibold rounded-xl transition-colors text-sm inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call +251 11 123 4567
              </a>
              <a
                href="mailto:support@bitaexpress.com"
                className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white px-6 py-3 font-semibold rounded-xl transition-colors text-sm inline-flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
              >
                <Mail className="w-4 h-4" /> Email Support
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-black/25 dark:text-white/25">
              <Clock className="w-3.5 h-3.5" /> Mon–Sat · 8:00AM – 6:00PM CAT
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
