"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import {
  ArrowRight,
  Check,
  FileText,
  Package,
  Luggage,
  Download,
  Calculator,
  Zap,
  Truck,
  Clock,
  ShoppingCart,
  Plane,
  ScanLine,
  BellRing,
  MapPin,
  Wallet,
  Signal,
  Wifi,
  BatteryFull,
  Bell,
  Search,
  PackageSearch,
  Home,
  User,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

/* ====== Reveal on Scroll ====== */
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ====== Trust Logos ====== */
export function TrustLogos() {
  const logos = [
    "ethiopianairlines.com",
    "dashenbrewery.com",
    "awashbank.com",
    "ethiotelecom.et",
    "midroc.com",
  ];

  return (
    <section className="bg-white dark:bg-black py-7 overflow-hidden transition-colors duration-500 -mt-1 relative z-10">
      <div className="flex items-center">
        <div className="shrink-0 px-6 text-[10px] font-semibold tracking-[0.15em] uppercase text-black/12 dark:text-white/12">
          Trusted by
        </div>
        <div className="shrink-0 w-px h-4 bg-black/8 dark:bg-white/8" />
        <div className="overflow-hidden flex-1 relative">
          <div className="flex gap-12 items-center marquee-track whitespace-nowrap">
            {[...logos, ...logos].map((logo, i) => (
              <img
                key={i}
                src={`https://logo.clearbit.com/${logo}`}
                alt=""
                className="h-5 w-auto opacity-15 hover:opacity-40 transition-opacity grayscale hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Popular Routes ====== */
interface RouteData {
  id: string;
  origin: string;
  destination: string;
  transitTime: string;
  pricing: {
    economy: number;
    premium: number;
    standard: number;
  };
}

const ROUTE_FLAGS: Record<string, string> = {
  "ET": "🇪🇹",
  "DE": "🇩🇪",
  "GB": "🇬🇧",
  "US": "🇺🇸",
  "AE": "🇦🇪",
  "KE": "🇰🇪",
  "SA": "🇸🇦",
  "CN": "🇨🇳",
  "HK": "🇭🇰",
};

function getRouteFlag(id: string): string {
  const parts = id.split("-");
  const from = ROUTE_FLAGS[parts[0]] || "📍";
  const to = ROUTE_FLAGS[parts[1]] || "📍";
  return `${from}→${to}`;
}

export function RoutesSection({ onFillRoute }: { onFillRoute: (from: string, to: string) => void }) {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://apii.bittaexpress.com/routes");
        if (!response.ok) throw new Error("Failed to fetch routes");
        const data = await response.json();
        setRoutes(data.data || []);
      } catch (err) {
        setError("Failed to load routes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <section id="routes" className="bg-white dark:bg-black py-14 md:py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
<Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white tracking-tight">
                Popular routes
              </h2>
              <p className="text-sm text-black/40 dark:text-white/40 mt-1">
                Transit times and starting prices per kg.
              </p>
            </div>
            <button
              onClick={() => toast("Opening full route calculator...")}
              className="text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors shrink-0 flex items-center gap-1"
            >
              All routes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="border border-black/8 dark:border-white/10 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-brand-red animate-spin" />
              </div>
            ) : error ? (
              <div className="py-8 text-center text-sm text-black/40 dark:text-white/40">
                {error}
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-black/[0.02] dark:bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider text-black/35 dark:text-white/35">
                  <div className="col-span-4">Route</div>
                  <div className="col-span-1 text-center">Transit</div>
                  <div className="col-span-2 text-center">Standard</div>
                  <div className="col-span-2 text-center">Premium</div>
                  <div className="col-span-2 text-center">Economy</div>
                  <div className="col-span-1" />
                </div>

                {/* Rows */}
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="route-row grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-t border-black/5 dark:border-white/10 items-center"
                  >
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <span className="text-base">{getRouteFlag(route.id)}</span>
                      <div>
                        <div className="text-sm font-semibold text-black dark:text-white">
                          {route.origin} → {route.destination}
                        </div>
                        <div className="text-[11px] text-black/30 dark:text-white/30 sm:hidden">
                          {route.transitTime} days · ETB {route.pricing.standard.toFixed(2)} / ETB {route.pricing.economy.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-1 text-center hidden sm:block">
                      <span className="text-sm text-black/60 dark:text-white/60">{route.transitTime} days</span>
                    </div>
                    <div className="sm:col-span-2 text-center hidden sm:block">
                      <span className="text-sm font-semibold text-black dark:text-white">ETB {route.pricing.standard.toFixed(2)}</span>
                    </div>
                    <div className="sm:col-span-2 text-center hidden sm:block">
                      <span className="text-sm font-semibold text-brand-red">ETB {route.pricing.premium.toFixed(2)}</span>
                    </div>
                    <div className="sm:col-span-2 text-center hidden sm:block">
                      <span className="text-sm text-black/50 dark:text-white/50">ETB {route.pricing.economy.toFixed(2)}</span>
                    </div>
                    <div className="sm:col-span-1 text-right hidden sm:block">
                      <button
                        onClick={() => onFillRoute(route.origin, route.destination)}
                        className="text-brand-red hover:text-brand-red-dark transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <p className="text-[11px] text-black/25 dark:text-white/25 mt-3">
            * Per kg for small package. Click → for exact quote.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
/* ====== Mobile App Section ====== */
export function MobileAppSection() {
  return (
    <section id="app" className="bg-black/[0.02] dark:bg-white/[0.02] py-16 md:py-24 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-brand-red mb-4">
                Mobile App
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white leading-tight tracking-tight">
                Ship from your pocket.
              </h2>
              <p className="text-base text-black/40 dark:text-white/40 mt-4 leading-relaxed max-w-md">
                Everything you can do on the website, now on your phone. Track
                shipments, schedule pickups, calculate quotes, and scan labels —
                all without opening a browser.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: ScanLine, title: "Scan to track", desc: "Point your camera at any BITA label to instantly open tracking" },
                  { icon: BellRing, title: "Push notifications", desc: "Know the moment your package is out for delivery" },
                  { icon: MapPin, title: "Live map tracking", desc: "See your driver's location in real-time on delivery day" },
                  { icon: Wallet, title: "Wallet & payments", desc: "Pay with telebirr, CBE Birr, or card directly in the app" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-red/8 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-black dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-black/35 dark:text-white/35 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none opacity-70">Download on the</div>
                    <div className="text-base font-semibold leading-tight -mt-0.5">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 0 0-1.42l-2.302-2.302-2.302 2.302a1 1 0 0 1 0-1.42l2.302-2.302zM5.864 21.342L16.8 15.088l-2.302-2.302-8.634 8.556z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none opacity-70">GET IT ON</div>
                    <div className="text-base font-semibold leading-tight -mt-0.5">Google Play</div>
                  </div>
                </a>
              </div>
              <p className="text-xs text-black/25 dark:text-white/25 mt-4">
                Free · 4.8★ rating · 50K+ downloads
              </p>
            </div>

            {/* Phone Mockup */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-[280px] h-[560px] bg-black rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl shadow-black/30 dark:shadow-black/60 overflow-hidden relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-b-2xl z-20" />
                  <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 p-4 pt-10 flex flex-col">
                    <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 px-1 mb-4">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <Signal className="w-3 h-3" /><Wifi className="w-3 h-3" /><BatteryFull className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-brand-red rounded flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">B</span>
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">BITA Express</span>
                      </div>
                      <Bell className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-xl px-3 py-2.5 mb-5 border border-zinc-200 dark:border-zinc-700">
                      <Search className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-[11px] text-zinc-400">Track or get a quote</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {[
                        { icon: PackageSearch, label: "Track", highlight: true },
                        { icon: Calculator, label: "Quote", highlight: false },
                        { icon: Truck, label: "Pickup", highlight: false },
                        { icon: ScanLine, label: "Scan", highlight: false },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-1.5">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.highlight ? "bg-brand-red/10" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                            <item.icon className={`w-4 h-4 ${item.highlight ? "text-brand-red" : "text-zinc-600 dark:text-zinc-300"}`} />
                          </div>
                          <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 border border-zinc-200 dark:border-zinc-700 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-zinc-900 dark:text-white font-mono">BITA-987654321</span>
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400 px-2 py-0.5 rounded-full">In Transit</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mb-3">Berlin → Addis Ababa</div>
                      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-brand-red rounded-full" style={{ width: "65%" }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-400">
                        <span>Picked up</span><span>Customs</span><span>Delivered</span>
                      </div>
                    </div>
                    <div className="flex justify-around items-center pt-4 mt-auto border-t border-zinc-200 dark:border-zinc-700">
                      <div className="flex flex-col items-center gap-0.5">
                        <Home className="w-4 h-4 text-brand-red" /><span className="text-[8px] text-brand-red font-semibold">Home</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <Package className="w-4 h-4 text-zinc-400" /><span className="text-[8px] text-zinc-400">Shipments</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 -mt-5 bg-brand-red rounded-2xl flex items-center justify-center shadow-lg shadow-brand-red/30">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <Wallet className="w-4 h-4 text-zinc-400" /><span className="text-[8px] text-zinc-400">Wallet</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <User className="w-4 h-4 text-zinc-400" /><span className="text-[8px] text-zinc-400">Profile</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification card floating */}
                <div className="absolute -left-16 top-32 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl shadow-black/20 dark:shadow-black/50 p-3 w-48 border border-zinc-100 dark:border-zinc-700 hero-float">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-900 dark:text-white">Out for delivery!</span>
                  </div>
                  <p className="text-[9px] text-zinc-400 leading-relaxed">
                    Your package from Berlin is out for delivery. Expected by 3:00 PM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
const docCategories = [
  {
    icon: FileText,
    title: "Sending Documents",
    desc: "Invoices, letters, contracts.",
    items: ["Completed waybill", "Valid ID of sender", "Contents description"],
  },
  {
    icon: Package,
    title: "Sending Goods (Commercial)",
    desc: "Products for sale, samples.",
    items: ["Commercial invoice", "Packing list", "Export license (if required)", "Certificate of origin"],
  },
  {
    icon: Luggage,
    title: "Personal Effects",
    desc: "Moving, relocation.",
    items: ["Packing list with values", "Copy of passport", "Visa/residence permit", "Non-sale declaration"],
  },
];

export function DocsSection() {
  return (
    <section id="docs" className="bg-black/[0.02] dark:bg-white/[0.02] py-14 md:py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Before you ship: what you need
          </h2>
          <p className="text-sm text-black/40 dark:text-white/40 mt-1 max-w-lg">
            Prepare based on what you&apos;re sending.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {docCategories.map((cat) => (
              <div
                key={cat.title}
                className="doc-card bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-6 cursor-pointer"
                onClick={() => toast(`Opening ${cat.title} checklist PDF...`)}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-red/8 flex items-center justify-center mb-4">
                  <cat.icon className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="text-base font-bold text-black dark:text-white mb-1.5">
                  {cat.title}
                </h3>
                <p className="text-sm text-black/40 dark:text-white/40 leading-relaxed mb-4">
                  {cat.desc}
                </p>
                <ul className="space-y-2 text-sm text-black/50 dark:text-white/50">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => toast("Downloading checklist PDF (247KB)...")}
              className="text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download full checklist
            </button>
            <button
              onClick={() => toast("Opening customs duty estimator...")}
              className="text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" /> Estimate customs duties
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ====== Tracking Section ====== */
export function TrackingSection() {
  const [showFullHistory, setShowFullHistory] = useState(false);

  return (
    <section id="tracking" className="bg-white dark:bg-black py-14 md:py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2">
              <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-brand-red mb-3">
                How tracking looks
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white leading-tight tracking-tight">
                See every step of the journey.
              </h2>
              <p className="text-sm text-black/40 dark:text-white/40 mt-3 leading-relaxed">
                Real-time timeline updated as your shipment moves through
                checkpoints.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { title: "SMS & email notifications", desc: "Alerted at every status change" },
                  { title: "Proof of delivery", desc: "Photo & signature" },
                  { title: "Share tracking link", desc: "Send to recipient, no account needed" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-black dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-black/35 dark:text-white/35">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[11px] text-black/30 dark:text-white/30 uppercase tracking-widest font-medium">
                    Tracking ID
                  </div>
                  <div className="text-lg font-bold text-black dark:text-white mt-1 font-mono">
                    BITA-987654321
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot" />{" "}
                  Delivered
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-black/25 dark:text-white/25 mb-8 pb-6 border-b border-black/5 dark:border-white/10">
                <span className="flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5" /> Frankfurt → Addis Ababa
                </span>
                <span>·</span>
                <span>2d 18h</span>
              </div>

              <div className="space-y-0">
                {/* Timeline items - active */}
                {[
                  { title: "Delivered — signed by M. Tadesse", loc: "Bole, Addis Ababa", time: "Dec 15 · 09:32", active: true },
                  { title: "Out for delivery", loc: "Addis sorting hub", time: "Dec 15 · 06:15", active: true },
                  { title: "In transit via Dubai", loc: "DXB hub", time: "Dec 14 · 14:40", active: true },
                  { title: "Customs cleared", loc: "Bole Intl.", time: "Dec 14 · 11:20", active: true },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <div className={`w-px flex-1 my-1.5 ${i < 2 ? "bg-brand-red/20" : "bg-black/5 dark:bg-white/10"}`} />
                    </div>
                    <div className="pb-5">
                      <div className="text-sm font-semibold text-black dark:text-white">{item.title}</div>
                      <div className="text-xs text-black/30 dark:text-white/30 mt-0.5">{item.loc}</div>
                      <div className="text-[11px] text-black/20 dark:text-white/20 mt-0.5 font-mono">{item.time}</div>
                    </div>
                  </div>
                ))}

                {/* Extra timeline - toggled */}
                {showFullHistory && (
                  <>
                    {[
                      { title: "Picked up", loc: "Frankfurt, DE", time: "Dec 12 · 15:00" },
                      { title: "Shipment booked", loc: "Berlin, DE", time: "Dec 12 · 10:00" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-5 h-5 rounded-full bg-black/8 dark:bg-white/10 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-black/25 dark:text-white/25" />
                          </div>
                          {i === 0 && <div className="w-px flex-1 my-1.5 bg-black/5 dark:bg-white/10" />}
                        </div>
                        <div className={i === 0 ? "pb-5" : "pb-2"}>
                          <div className="text-sm font-medium text-black/50 dark:text-white/50">{item.title}</div>
                          <div className="text-xs text-black/25 dark:text-white/25 mt-0.5">{item.loc}</div>
                          <div className="text-[11px] text-black/15 dark:text-white/15 mt-0.5 font-mono">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <button
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors mt-2 uppercase"
              >
                {showFullHistory ? "Show less" : "Show full history"}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ====== Support Section ====== */
const services = [
  { icon: Zap, title: "standard", desc: "1-5 days. Door-to-door, customs included.", price: "From ETB 18/kg", action: "Get quote" },
  { icon: Truck, title: "Economy", desc: "5-10 days. Cost-effective.", price: "From ETB 12/kg", action: "Get quote" },
  { icon: Clock, title: "premium", desc: "Within hours. Addis metro only.", price: "From ETB 500", action: "Schedule" },
];

export function ServicesSection({ onOpenModal }: { onOpenModal: (modal: string) => void }) {
  return (
    <section id="services" className="bg-black/[0.02] dark:bg-white/[0.02] py-14 md:py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Shipping services
          </h2>
          <p className="text-sm text-black/40 dark:text-white/40 mt-1">
            Choose based on speed and what you&apos;re sending.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="service-card bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-6 cursor-pointer"
                onClick={() => {
                  if (svc.title === "Same Day") {
                    onOpenModal("pickup");
                    toast("Same Day — Addis metro only");
                  } else if (svc.title === "E-commerce") {
                    toast("E-commerce: Shopify, WooCommerce, custom API integration");
                  } else {
                    toast(`${svc.title} selected — fill destination for quote`);
                  }
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-red/8 flex items-center justify-center mb-4">
                  <svc.icon className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="text-base font-bold text-black dark:text-white mb-1">
                  {svc.title}
                </h3>
                <p className="text-xs text-black/35 dark:text-white/35 leading-relaxed mb-3">
                  {svc.desc}
                </p>
                <div className="text-sm font-bold text-black dark:text-white">
                  {svc.price}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-red mt-3">
                  {svc.action} <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}


export function SupportSection({ onOpenModal }: { onOpenModal: (modal: string) => void }) {
  return (
    <section id="support" className="bg-brand-red py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-white">
          <div>
            <h3 className="text-lg font-bold mb-2">Problem with your shipment?</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              File a claim, report damage. Average resolution: 48 hours.
            </p>
            <button
              onClick={() => onOpenModal("claim")}
              className="bg-white text-brand-red px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-black hover:text-white transition-all"
            >
              File a Claim
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Need to talk to someone?</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Available during business hours.
            </p>
            <a href="tel:+251111234567" className="text-lg font-semibold hover:underline block">
              +251 94 676 6667
            </a>
            <span className="text-white/40 text-xs">Mon–Sat, 8AM–6PM CAT</span>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Prepare before you call</h3>
            <ul className="space-y-1.5 text-sm text-white/70 mt-3">
              {["Your tracking number", "Sender & recipient details", "Photos if damaged", "Description of the issue"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}


