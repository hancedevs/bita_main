"use client";

import { useTranslations } from "next-intl";
import {
  Target,
  Eye,
  Globe2,
  Users,
  Award,
  Package,
  ArrowRight,
  Truck,
  Ship,
  Warehouse,
  ClipboardCheck,
  MapPin,
  Star,
  Loader2,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const galleryImages = [
  {
    url: "/assets/arlind-photography-7z1sdaLl4wM-unsplash.jpg",
    title: "Global Logistics",
  },
  {
    url: "/assets/bernd-dittrich-3jtEN0ZxT4Y-unsplash.jpg",
    title: "Air Freight",
  },
  {
    url: "/assets/rifki-kurniawan-k63Or81F8-M-unsplash.jpg",
    title: "Fleet Operations",
  },
  {
    url: "/assets/rowan-freeman-clYlmCaQbzY-unsplash.jpg",
    title: "Warehousing",
  },
];

export function AboutPage() {
  const t = useTranslations("AboutPage");
  const [api, setApi] = useState<CarouselApi>();

  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a message");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.bittaexpress.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          rating: rating,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Thank you! Your review has been submitted successfully.");
      setCustomerName("");
      setRating(0);
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Map Background Image */}
        <div className="absolute inset-0 bg-white dark:bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.2] dark:opacity-[0.4]"
            poster="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-commercial-airplane-in-flight-at-sunset-10023-large.mp4" type="video/mp4" />
          </video>
          {/* Light mode: white frosted overlay */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] dark:hidden" />
          {/* Dark mode: stark contrast overlay */}
          <div className="absolute inset-0 bg-black/60 hidden dark:block" />
          {/* Subtle red radial glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-red rounded-full blur-[200px] opacity-[0.06] dark:opacity-[0.08] pointer-events-none" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <img
              src="/assets/BE%20Logo%20(No%20BG,%20Full,%20Dark).svg"
              alt="BITA Express Logo"
              className="h-16 md:h-20 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </div>
          <span className="inline-block text-black/70 dark:text-white/70 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {t("heroBadge")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white leading-tight tracking-tight">
            {t("heroHeading")}
          </h1>
          <p className="text-base md:text-lg text-black/70 dark:text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-8 bg-white dark:bg-black rounded-t-[2rem] transition-colors duration-500" />
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-brand-red mb-3">
                {t("whoBadge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white leading-tight tracking-tight">
                {t("whoHeading")}
              </h2>
              <p className="text-base text-black/50 dark:text-white/50 mt-5 leading-relaxed">
                {t("whoDesc1")}
              </p>
              <p className="text-base text-black/50 dark:text-white/50 mt-4 leading-relaxed">
                {t("whoDesc2")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Package,
                  value: t("valPackages"),
                  label: t("statPackages"),
                },
                {
                  icon: Globe2,
                  value: t("valDestinations"),
                  label: t("statDestinations"),
                },
                {
                  icon: Users,
                  value: t("valTeam"),
                  label: t("statTeam"),
                },
                {
                  icon: Award,
                  value: t("valYears"),
                  label: t("statYears"),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-black/[0.02] dark:bg-white/[0.03] rounded-2xl p-6 border border-black/5 dark:border-white/10 text-center"
                >
                  <stat.icon className="w-6 h-6 text-brand-red mx-auto mb-3" />
                  <div className="text-2xl font-black text-black dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-black/40 dark:text-white/40 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Operations Gallery Slider */}
      <section className="py-0 overflow-hidden w-full">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="pl-0 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="relative group overflow-hidden h-[250px] md:h-[350px]">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                  <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <h4 className="text-white text-2xl font-black tracking-tight">{image.title}</h4>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-10 right-10 flex gap-2">
            <CarouselPrevious className="relative left-0 translate-y-0 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-brand-red hover:border-brand-red size-12" />
            <CarouselNext className="relative right-0 translate-y-0 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-brand-red hover:border-brand-red size-12" />
          </div>
        </Carousel>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-black/[0.02] dark:bg-white/[0.02] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-8 md:p-10">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                {t("missionTitle")}
              </h3>
              <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed">
                {t("missionDesc")}
              </p>
            </div>
            <div className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-8 md:p-10">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                {t("visionTitle")}
              </h3>
              <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed">
                {t("visionDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Logistics Solution - Realistic Map Visual */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-brand-red mb-3">
              {t("processBadge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
              {t("processHeading")}
            </h2>
            <p className="text-base text-black/40 dark:text-white/40 mt-3 max-w-lg mx-auto">
              {t("processSubtitle")}
            </p>
          </div>

          {/* Logistics Route Map Visual */}
          <div className="relative bg-gradient-to-br from-black/[0.02] to-black/[0.04] dark:from-white/[0.02] dark:to-white/[0.04] rounded-3xl border border-black/6 dark:border-white/10 overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80"
                alt=""
                className="w-full h-full object-cover opacity-[0.04] dark:opacity-[0.06]"
              />
            </div>

            <div className="relative z-10 p-6 md:p-10">
              {/* Origin → Destination Header */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-red shadow-lg shadow-brand-red/30" />
                  <span className="text-sm font-bold text-black dark:text-white">{t("originCity")}</span>
                  <span className="text-xs text-black/30 dark:text-white/30">{t("originCountry")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-px bg-brand-red/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red/30" />
                  <div className="w-8 h-px bg-brand-red/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red/40" />
                  <div className="w-8 h-px bg-brand-red/20" />
                  <Ship className="w-4 h-4 text-brand-red/50" />
                  <div className="w-8 h-px bg-brand-red/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red/40" />
                  <div className="w-8 h-px bg-brand-red/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-red/30" />
                  <div className="w-8 h-px bg-brand-red/20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-black/30 dark:text-white/30">{t("destWorldwide")}</span>
                  <span className="text-sm font-bold text-black dark:text-white">{t("destCount")}</span>
                  <span className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30" />
                </div>
              </div>

              {/* Process Steps - Horizontal on desktop, vertical on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                {/* Step 1 */}
                <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center p-4 group">
                  {/* Step Number & Icon */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-black/8 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-brand-red/20 transition-all duration-300">
                      <ClipboardCheck className="w-7 h-7 text-brand-red" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">1</div>
                  </div>
                  <div className="md:mt-4">
                    <h4 className="text-sm font-bold text-black dark:text-white mb-1">{t("step1Title")}</h4>
                    <p className="text-xs text-black/40 dark:text-white/40 leading-relaxed max-w-[200px] md:mx-auto">
                      {t("step1Desc")}
                    </p>
                  </div>
                  {/* Arrow connector - desktop only */}
                  <div className="hidden md:flex absolute top-8 -right-3 items-center">
                    <ArrowRight className="w-5 h-5 text-brand-red/25" />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center p-4 group">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-black/8 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-brand-red/20 transition-all duration-300">
                      <Warehouse className="w-7 h-7 text-brand-red" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">2</div>
                  </div>
                  <div className="md:mt-4">
                    <h4 className="text-sm font-bold text-black dark:text-white mb-1">{t("step2Title")}</h4>
                    <p className="text-xs text-black/40 dark:text-white/40 leading-relaxed max-w-[200px] md:mx-auto">
                      {t("step2Desc")}
                    </p>
                  </div>
                  <div className="hidden md:flex absolute top-8 -right-3 items-center">
                    <ArrowRight className="w-5 h-5 text-brand-red/25" />
                  </div>
                </div>

                {/* Step 3 - Highlighted */}
                <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center p-4 group">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20">
                      <Ship className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-red-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">3</div>
                  </div>
                  <div className="md:mt-4">
                    <h4 className="text-sm font-bold text-black dark:text-white mb-1">{t("step3Title")}</h4>
                    <p className="text-xs text-black/40 dark:text-white/40 leading-relaxed max-w-[200px] md:mx-auto">
                      {t("step3Desc")}
                    </p>
                  </div>
                  <div className="hidden md:flex absolute top-8 -right-3 items-center">
                    <ArrowRight className="w-5 h-5 text-brand-red/25" />
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center p-4 group">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-black/8 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-brand-red/20 transition-all duration-300">
                      <Truck className="w-7 h-7 text-brand-red" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">4</div>
                  </div>
                  <div className="md:mt-4">
                    <h4 className="text-sm font-bold text-black dark:text-white mb-1">{t("step4Title")}</h4>
                    <p className="text-xs text-black/40 dark:text-white/40 leading-relaxed max-w-[200px] md:mx-auto">
                      {t("step4Desc")}
                    </p>
                  </div>
                  <div className="hidden md:flex absolute top-8 -right-3 items-center">
                    <ArrowRight className="w-5 h-5 text-brand-red/25" />
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center p-4 group">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-black/8 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-brand-red/20 transition-all duration-300">
                      <MapPin className="w-7 h-7 text-brand-red" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">5</div>
                  </div>
                  <div className="md:mt-4">
                    <h4 className="text-sm font-bold text-black dark:text-white mb-1">{t("step5Title")}</h4>
                    <p className="text-xs text-black/40 dark:text-white/40 leading-relaxed max-w-[200px] md:mx-auto">
                      {t("step5Desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-black text-brand-red">{t("valGlobalDest")}</div>
                    <div className="text-xs text-black/35 dark:text-white/35 mt-0.5">{t("barDest")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-brand-red">{t("valDays")}</div>
                    <div className="text-xs text-black/35 dark:text-white/35 mt-0.5">{t("barDays")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-brand-red">{t("valBranches")}</div>
                    <div className="text-xs text-black/35 dark:text-white/35 mt-0.5">{t("barBranches")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-brand-red">{t("valTracking")}</div>
                    <div className="text-xs text-black/35 dark:text-white/35 mt-0.5">{t("barTracking")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid - Detailed Cards */}
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              {
                icon: Ship,
                title: t("servExpressTitle"),
                desc: t("servExpressDesc"),
                detail: t("servExpressDetail"),
              },
              {
                icon: Truck,
                title: t("servFreightTitle"),
                desc: t("servFreightDesc"),
                detail: t("servFreightDetail"),
              },
              {
                icon: Package,
                title: t("servEcomTitle"),
                desc: t("servEcomDesc"),
                detail: t("servEcomDetail"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-black rounded-2xl border border-black/6 dark:border-white/10 p-6 hover:border-brand-red/20 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/8 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-brand-red" />
                  </div>
                  <span className="text-[11px] font-semibold text-brand-red/60 group-hover:text-brand-red transition-colors">
                    {item.detail}
                  </span>
                </div>
                <h3 className="text-base font-bold text-black dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-black/40 dark:text-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews & Testimonials Section */}
      <section id="reviews" className="py-20 md:py-32 bg-black/[0.02] dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Heading & Info */}
            <div>
              <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-brand-red mb-3">
                {t("reviewsBadge")}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white leading-tight tracking-tight">
                {t("reviewsHeading")}
              </h2>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-red text-brand-red" />
                    ))}
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/40 mt-1">
                    Trusted by 5,000+ customers
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Glass Review Form */}
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-red/5 rounded-[2rem] blur-3xl -z-10" />
              <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
                <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                  {t("writeReview")}
                </h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                      {t("yourName")}
                    </label>
                    <Input
                      placeholder={t("yourName")}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={isSubmitting}
                      className="bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10 focus:border-brand-red/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                      {t("ratingLabel")}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          disabled={isSubmitting}
                          className="text-black/20 dark:text-white/20 hover:text-brand-red transition-colors focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-all ${
                              star <= rating
                                ? "fill-brand-red text-brand-red scale-110"
                                : "text-black/20 dark:text-white/20 hover:text-brand-red/70"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
                      {t("yourMessage")}
                    </label>
                    <Textarea
                      placeholder={t("reviewPlaceholder")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      className="min-h-[120px] bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10 focus:border-brand-red/50 transition-all"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-red hover:bg-black dark:hover:bg-white dark:hover:text-black py-6 text-base font-bold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      t("submitReview")
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white tracking-tight">
            {t("ctaHeading")}
          </h2>
          <p className="text-base text-black/40 dark:text-white/40 mt-3 max-w-md mx-auto">
            {t("ctaSubtitle")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#"
              className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3.5 font-semibold rounded-xl transition-colors text-sm inline-flex items-center justify-center gap-2"
            >
              {t("ctaGetStarted")}
            </a>
            <a
              href="tel:+251946766667"
              className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white px-8 py-3.5 font-semibold rounded-xl transition-colors text-sm inline-flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
            >
              {t("ctaCall")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
