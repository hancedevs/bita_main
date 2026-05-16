"use client";

import { useState } from "react";
import {
  Search,
  ArrowRight,
  Truck,
  MapPin,
  ChevronRight,
  Bike,
  Footprints,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchQuotes, selectVehicle, clearQuotes, VehicleType } from "@/store/quoteSlice";
import { PriceResponse } from "@/store/quoteSlice";

interface HeroProps {
  activeTab: "track" | "quote";
  onSwitchTab: (tab: "track" | "quote") => void;
  onOpenModal: (modal: string) => void;
  onTrack?: (code: string) => void;
  onProceedToBook?: (quoteDetails: {
    from: string;
    to: string;
    weight: string;
    pickupCoords: [number, number];
    deliveryCoords: [number, number];
    quotes: {
      MOTORBIKE: PriceResponse | null;
      BICYCLE: PriceResponse | null;
      FOOT: PriceResponse | null;
    };
    selectedVehicle: VehicleType;
  }) => void;
}

const VEHICLE_ICONS = {
  MOTORBIKE: Truck,
  BICYCLE: Bike,
  FOOT: Footprints,
};

const VEHICLE_LABELS = {
  MOTORBIKE: "Motorbike",
  BICYCLE: "Bicycle",
  FOOT: "Foot",
};

const VEHICLE_TIMES = {
  MOTORBIKE: "~30-60 min",
  BICYCLE: "~1-2 hours",
  FOOT: "~2-4 hours",
};

export function Hero({ activeTab, onSwitchTab, onOpenModal, onTrack, onProceedToBook }: HeroProps) {
  const dispatch = useAppDispatch();
  const { quotes, selectedVehicle, loading } = useAppSelector((state) => state.quote);

  const [trackInput, setTrackInput] = useState("");
  const [quoteFrom, setQuoteFrom] = useState("");
  const [quoteTo, setQuoteTo] = useState("");
  const [quoteWeight, setQuoteWeight] = useState("");
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) {
      toast("Please enter a tracking number");
      return;
    }
    if (onTrack) {
      onTrack(trackInput.trim());
    } else {
      toast("BITA-987654321 — In transit via Dubai. Expected delivery: Dec 15, 09:30 AM");
    }
  };

  const handleGetQuote = () => {
    if (!quoteFrom || !quoteTo) {
      toast("Select origin and destination");
      return;
    }
    if (!fromCoords || !toCoords) {
      toast("Please select valid locations from the dropdown");
      return;
    }
    dispatch(fetchQuotes({ pickupCoords: fromCoords, deliveryCoords: toCoords }));
  };

  const handleProceed = () => {
    if (onProceedToBook && fromCoords && toCoords) {
      onProceedToBook({
        from: quoteFrom,
        to: quoteTo,
        weight: quoteWeight,
        pickupCoords: fromCoords,
        deliveryCoords: toCoords,
        quotes,
        selectedVehicle: selectedVehicle || "MOTORBIKE",
      });
    } else {
      toast("Proceeding to booking with these details pre-filled...");
    }
  };

  const quickActions = [
    {
      icon: Truck,
      label: "Schedule a pickup",
      sublabel: "We come to your door",
      onClick: () => onOpenModal("pickup"),
    },
    {
      icon: MapPin,
      label: "Find a drop-off point",
      sublabel: "5 locations in Addis Ababa",
      onClick: () => onOpenModal("locations"),
    },
  ];

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 map-bg-light dark:hidden" />
        <div className="absolute inset-0 map-bg-dark hidden dark:block" />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] dark:hidden" />
        <div className="absolute inset-0 bg-black/35 hidden dark:block" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-red rounded-full blur-[200px] opacity-[0.06] dark:opacity-[0.08] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-20 md:pb-24">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-3">
            <div className="flex lg:hidden justify-center mb-8">
              <img
                src="https://z-cdn-media.chatglm.cn/files/c8529ae0-ba16-459b-91f5-cea4dc45044c.png?auth_key=1877574723-771b8d44b7504736bda05ea6b126f2c5-0-5605d852b7b38bb8c5b4a320605e7d8f"
                alt="BITA Express"
                className="w-36 h-36 object-contain drop-shadow-[0_10px_30px_rgba(212,5,17,0.25)]"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black dark:text-white leading-[1.1] tracking-tight">
              Track a shipment
              <br />
              or get a quote.
            </h1>
            <p className="text-sm text-black/40 dark:text-white/40 mt-3 leading-relaxed max-w-md">
              No account needed to track. For quotes, have your origin,
              destination, and weight ready.
            </p>

            <div className="mt-8 flex gap-6 border-b border-black/10 dark:border-white/10 pb-0">
              <button
                onClick={() => onSwitchTab("track")}
                className={`tab-btn text-sm font-semibold pb-3 ${
                  activeTab === "track" ? "active text-brand-red" : "text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70"
                }`}
              >
                Track Shipment
              </button>
              <button
                onClick={() => onSwitchTab("quote")}
                className={`tab-btn text-sm font-semibold pb-3 ${
                  activeTab === "quote" ? "active text-brand-red" : "text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70"
                }`}
              >
                Get a Quote
              </button>
            </div>

            {activeTab === "track" && (
              <div className="mt-6">
                <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25 dark:text-white/25" />
                    <input
                      type="text"
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      placeholder="BITA-2024-987654321 or any tracking number"
                      className="track-input w-full pl-11 pr-4 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 text-sm focus:outline-none focus:border-brand-red/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-4 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-brand-red/20"
                  >
                    Track <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                {/* <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => setTrackInput("BITA-987654321")}
                    className="text-[11px] text-black/20 dark:text-white/20 hover:text-brand-red transition-colors underline underline-offset-2"
                  >
                    Try: BITA-987654321
                  </button>
                  <button
                    onClick={() => toast("Opening multi-track page...")}
                    className="text-[11px] text-black/30 dark:text-white/30 hover:text-brand-red transition-colors underline underline-offset-2"
                  >
                    Track multiple →
                  </button>
                </div> */}
              </div>
            )}

            {activeTab === "quote" && (
              <div className="mt-6">
                <div className="space-y-3">
                  <LocationAutocomplete
                    value={quoteFrom}
                    onChange={(val, coords) => {
                      setQuoteFrom(val);
                      if (coords) setFromCoords(coords);
                    }}
                    placeholder="Pickup location"
                    label="From"
                  />
                  <LocationAutocomplete
                    value={quoteTo}
                    onChange={(val, coords) => {
                      setQuoteTo(val);
                      if (coords) setToCoords(coords);
                    }}
                    placeholder="Delivery location"
                    label="To"
                  />
                  <div>
                    <label className="text-[11px] text-black/30 dark:text-white/30 uppercase tracking-wider font-medium mb-1.5 block">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={quoteWeight}
                      onChange={(e) => setQuoteWeight(e.target.value)}
                      placeholder="e.g. 5"
                      min="0.1"
                      step="0.1"
                      className="w-full px-4 py-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 text-sm focus:outline-none focus:border-brand-red/50 transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={handleGetQuote}
                  disabled={loading}
                  className="mt-4 bg-brand-red hover:bg-brand-red-dark disabled:bg-black/10 disabled:dark:bg-white/10 text-white px-8 py-4 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 w-full sm:w-auto disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>Get Quote <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                {quotes.MOTORBIKE && (
                  <div className="mt-4">
                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 mt-2 space-y-3">
                      <div className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider font-medium">
                        Estimated Quote
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(["MOTORBIKE", "BICYCLE", "FOOT"] as const).map((vehicle) => {
                          const quote = quotes[vehicle];
                          if (!quote) return null;
                          const Icon = VEHICLE_ICONS[vehicle];
                          return (
                            <button
                              key={vehicle}
                              onClick={() => dispatch(selectVehicle(vehicle))}
                              className={`bg-black/5 dark:bg-white/5 rounded-lg p-3 text-left transition-all border-2 ${
                                selectedVehicle === vehicle
                                  ? "border-brand-red"
                                  : "border-transparent hover:border-brand-red/30"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Icon className={`w-4 h-4 ${selectedVehicle === vehicle ? "text-brand-red" : "text-black/40 dark:text-white/40"}`} />
                                <span className={`text-sm font-medium ${selectedVehicle === vehicle ? "text-brand-red" : "text-black/60 dark:text-white/60"}`}>
                                  {VEHICLE_LABELS[vehicle]}
                                </span>
                              </div>
                              <div className="text-xl font-bold text-black dark:text-white">${quote.price}</div>
                              <div className="text-xs text-black/40 dark:text-white/40 mt-0.5">
                                Est. {VEHICLE_TIMES[vehicle]}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-[11px] text-black/25 dark:text-white/25 mt-2">
                      {quoteWeight}kg · {quoteFrom} → {quoteTo}
                    </div>
                    <button
                      onClick={handleProceed}
                      className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-2.5 text-sm font-semibold rounded-lg transition-colors mt-1"
                    >
                      Proceed to Book
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:flex flex-col items-center gap-6 lg:col-span-2 pt-4">
            <div className="hero-float">
              <img
                src="https://z-cdn-media.chatglm.cn/files/c8529ae0-ba16-459b-91f5-cea4dc45044c.png?auth_key=1877574723-771b8d44b7504736bda05ea6b126f2c5-0-5605d852b7b38bb8c5b4a320605e7d8f"
                alt="BITA Express"
                className="w-48 h-48 object-contain drop-shadow-[0_20px_50px_rgba(212,5,17,0.25)]"
              />
            </div>
            <div className="space-y-2 w-full max-w-xs">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/15 dark:hover:border-white/15 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
                    <action.icon className="w-4 h-4 text-brand-red" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {action.label}
                    </div>
                    <div className="text-[11px] text-black/25 dark:text-white/25 truncate">
                      {action.sublabel}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-black/15 dark:text-white/15 ml-auto shrink-0" />
                </button>
              ))}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { img: "/assets/box.png", title: "Standard", sub: "From ETB 18/kg", desc: "1-5 days" },
                  { img: "/assets/motter bike.png", title: "Economy", sub: "From ETB 12/kg", desc: "5-10 days" },
                  { img: "/assets/plane.png", title: "Premium", sub: "Same day", desc: "Within hours" },
                ].map((svc) => (
                  <button
                    key={svc.title}
                    onClick={() => toast(`${svc.title} selected`)}
                    className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-3 hover:bg-black/10 dark:hover:bg-white/10 hover:border-brand-red/30 transition-all text-center"
                  >
                    <img src={svc.img} alt={svc.title} className="w-8 h-8 mx-auto mb-1 object-contain" />
                    <div className="text-[10px] font-semibold text-brand-red">{svc.title}</div>
                    <div className="text-[10px] text-black/50 dark:text-white/50">{svc.sub}</div>
                    <div className="text-[9px] text-black/25 dark:text-white/25 mt-0.5">{svc.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-10 bg-white dark:bg-black rounded-t-[2.5rem] transition-colors duration-500" />
      </div>
    </section>
  );
}