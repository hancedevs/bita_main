"use client";

import { useState } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Bike,
  Footprints,
  Wallet,
  Building,
  Phone,
  FileText,
  Copy,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createBooking, clearBooking, PaymentMethod } from "@/store/bookingSlice";
import { VehicleType, PriceResponse } from "@/store/quoteSlice";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import { useTranslations } from "next-intl";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteDetails: {
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
  } | null;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;

// Constants moved inside component for translation support

const PACKAGE_TYPE_MAP: Record<string, string> = {
  "Documents": "DOCUMENTS",
  "Commercial goods": "COMMERCIAL_GOODS",
  "Personal effects": "PERSONAL_EFFECTS",
  "Electronics": "FRAGILE",
  "Clothing & textiles": "CLOTHING",
  "Food & spices": "FOOD",
  "Books & printed material": "DOCUMENTS",
  "Medical supplies": "MEDICAL",
  "Other": "OTHER",
};

// Payment methods and vehicle labels moved inside component

const VEHICLE_ICONS: Record<VehicleType, typeof Truck> = {
  MOTORBIKE: Truck,
  BICYCLE: Bike,
  FOOT: Footprints,
};

// Vehicle times moved inside component

export function BookingModal({ isOpen, onClose, quoteDetails }: BookingModalProps) {
  const t = useTranslations("Booking");
  const dispatch = useAppDispatch();
  const { bookingData, loading: bookingLoading, error: bookingError } = useAppSelector((state) => state.booking);

  const [step, setStep] = useState<Step>(1);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>("MOTORBIKE");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const stepLabels = [
    { num: 1, label: t("step1"), icon: FileText },
    { num: 2, label: t("step2"), icon: User },
    { num: 3, label: t("step3"), icon: MapPin },
    { num: 4, label: t("step4"), icon: Package },
    { num: 5, label: t("step5"), icon: CreditCard },
    { num: 6, label: t("step6"), icon: Check },
  ];

  const contentCategories = [
    { label: t("catDocuments"), value: "Documents" },
    { label: t("catCommercial"), value: "Commercial goods" },
    { label: t("catPersonal"), value: "Personal effects" },
    { label: t("catElectronics"), value: "Electronics" },
    { label: t("catClothing"), value: "Clothing & textiles" },
    { label: t("catFood"), value: "Food & spices" },
    { label: t("catBooks"), value: "Books & printed material" },
    { label: t("catMedical"), value: "Medical supplies" },
    { label: t("catOther"), value: "Other" },
  ];

  const paymentMethods = [
    { id: "CASH" as PaymentMethod, label: t("cash"), desc: t("cashDesc"), icon: Wallet },
    { id: "TELEBIRR" as PaymentMethod, label: t("telebirr"), desc: t("telebirrDesc"), icon: Phone },
    { id: "CBE_BIRR" as PaymentMethod, label: t("cbeBirr"), desc: t("cbeBirrDesc"), icon: Building },
  ];

  const VEHICLE_LABELS: Record<VehicleType, string> = {
    MOTORBIKE: t("motorbike"),
    BICYCLE: t("bicycle"),
    FOOT: t("foot"),
  };

  const VEHICLE_TIMES: Record<VehicleType, string> = {
    MOTORBIKE: t("estMotorbike"),
    BICYCLE: t("estBicycle"),
    FOOT: t("estFoot"),
  };

  const [sender, setSender] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [senderCoords, setSenderCoords] = useState<[number, number] | null>(null);

  const [recipient, setRecipient] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [recipientCoords, setRecipientCoords] = useState<[number, number] | null>(null);

  const [packageDetails, setPackageDetails] = useState({
    contentCategory: "",
    declaredValue: "",
    description: "",
    fragile: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  if (!isOpen || !quoteDetails) return null;

  if (bookingData && hasSubmitted && step === 5) {
    setStep(6);
  }

  if (bookingError) {
    toast.error(bookingError);
  }

  if (quoteDetails?.selectedVehicle && selectedVehicle !== quoteDetails.selectedVehicle) {
    setSelectedVehicle(quoteDetails.selectedVehicle);
  }

  const selectedQuote = quoteDetails.quotes[selectedVehicle];

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedQuote;
      case 2:
        return sender.fullName && sender.phone && sender.email && sender.address && senderCoords;
      case 3:
        return recipient.fullName && recipient.phone && recipient.email && recipient.address && recipientCoords;
      case 4:
        return packageDetails.contentCategory && packageDetails.declaredValue;
      case 5:
        return !!paymentMethod;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < 6) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    if (!selectedQuote || !paymentMethod) return;

    setHasSubmitted(true);

    dispatch(createBooking({
      senderName: sender.fullName,
      senderPhone: sender.phone,
      receiverName: recipient.fullName,
      receiverPhone: recipient.phone,
      pickupAddress: sender.address,
      deliveryAddress: recipient.address,
      pickupLat: senderCoords![0],
      pickupLng: senderCoords![1],
      deliveryLat: recipientCoords![0],
      deliveryLng: recipientCoords![1],
      packageType: PACKAGE_TYPE_MAP[packageDetails.contentCategory] || "OTHER",
      weight: parseFloat(quoteDetails.weight) || 1,
      serviceType: "CITY",
      deliveryType: selectedVehicle,
      paymentMethod,
    }));
  };

  const handleClose = () => {
    setStep(1);
    setSelectedVehicle("MOTORBIKE");
    setHasSubmitted(false);
    setSender({ fullName: "", phone: "", email: "", address: "" });
    setSenderCoords(null);
    setRecipient({ fullName: "", phone: "", email: "", address: "" });
    setRecipientCoords(null);
    setPackageDetails({ contentCategory: "", declaredValue: "", description: "", fragile: false });
    setPaymentMethod(null);
    dispatch(clearBooking());
    onClose();
  };

  const inputClass = "w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors";
  const labelClass = "text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5";
  const selectClass = "w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">{t("title")}</h3>
            <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{t("stepLabel")} {step} {t("of")} 6</p>
          </div>
          <button onClick={handleClose} className="p-1.5 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="flex items-center gap-1">
            {stepLabels.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300 ${step >= s.num ? "bg-brand-red text-white" : "bg-black/5 dark:bg-white/10 text-black/25 dark:text-white/25"}`}>
                    {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block transition-colors ${step >= s.num ? "text-black dark:text-white" : "text-black/25 dark:text-white/25"}`}>
                    {s.label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && <div className={`h-px flex-1 mx-2 transition-colors ${step > s.num ? "bg-brand-red" : "bg-black/8 dark:bg-white/10"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && selectedQuote && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-black dark:text-white mb-1">{t("reviewQuote")}</h4>
                <p className="text-xs text-black/40 dark:text-white/40">{t("reviewQuoteDesc")}</p>
              </div>

              <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-4 border border-black/5 dark:border-white/10">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                    <span className="font-semibold text-black dark:text-white">{quoteDetails.from}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-1">
                    <div className="w-4 h-px bg-black/10 dark:bg-white/10" />
                    <Truck className="w-3.5 h-3.5 text-brand-red" />
                    <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black dark:text-white">{quoteDetails.to}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="text-xs text-black/30 dark:text-white/30 mt-2 text-center">
                  {selectedQuote.distanceKm.toFixed(1)}km · {quoteDetails.weight}{t("weight")}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(["MOTORBIKE", "BICYCLE", "FOOT"] as const).map((vehicle) => {
                  const quote = quoteDetails.quotes[vehicle];
                  if (!quote) return null;
                  const Icon = VEHICLE_ICONS[vehicle];
                  return (
                    <button
                      key={vehicle}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all ${selectedVehicle === vehicle ? "border-brand-red bg-brand-red/5" : "border-black/8 dark:border-white/10 hover:border-brand-red/30"}`}
                    >
                      {selectedVehicle === vehicle && <div className="absolute top-2 right-2"><Check className="w-4 h-4 text-brand-red" /></div>}
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${selectedVehicle === vehicle ? "text-brand-red" : "text-black/40 dark:text-white/40"}`} />
                        <span className="text-sm font-bold text-black dark:text-white">{VEHICLE_LABELS[vehicle]}</span>
                      </div>
                      <div className="text-2xl font-black text-black dark:text-white">ETB {quote.price.toFixed(2)}</div>
                      <div className="flex items-center gap-1 text-xs text-black/40 dark:text-white/40 mt-1">
                        Est. {VEHICLE_TIMES[vehicle]}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-start gap-2 text-xs text-black/30 dark:text-white/30">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{t("priceIncludes")} Breakdown: {t("baseFare")} ETB {selectedQuote.breakdown.baseFare.toFixed(2)} + {t("distanceCharge")} ETB {selectedQuote.breakdown.distanceCharge.toFixed(2)}</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-black dark:text-white mb-1">{t("senderDetails")}</h4>
                <p className="text-xs text-black/40 dark:text-white/40">{t("senderDetailsDesc")}</p>
              </div>
              <div>
                <label className={labelClass}>{t("fullName")} *</label>
                <input type="text" value={sender.fullName} onChange={(e) => setSender({ ...sender, fullName: e.target.value })} placeholder={t("yourName")} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("phoneNumber")} *</label>
                  <input type="tel" value={sender.phone} onChange={(e) => setSender({ ...sender, phone: e.target.value })} placeholder={t("phonePlaceholder")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("email")} *</label>
                  <input type="email" value={sender.email} onChange={(e) => setSender({ ...sender, email: e.target.value })} placeholder={t("emailPlaceholder")} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("pickupAddress")} *</label>
                <LocationAutocomplete
                  value={sender.address}
                  onChange={(addr, coords) => {
                    setSender((s) => ({ ...s, address: addr }));
                    if (coords) setSenderCoords(coords);
                  }}
                  placeholder={t("searchPickup")}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-black dark:text-white mb-1">{t("recipientDetails")}</h4>
                <p className="text-xs text-black/40 dark:text-white/40">{t("recipientDetailsDesc")}</p>
              </div>
              <div>
                <label className={labelClass}>{t("fullName")} *</label>
                <input type="text" value={recipient.fullName} onChange={(e) => setRecipient({ ...recipient, fullName: e.target.value })} placeholder={t("recipientName")} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("phoneNumber")} *</label>
                  <input type="tel" value={recipient.phone} onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })} placeholder={t("recipientPhonePlaceholder")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("email")} *</label>
                  <input type="email" value={recipient.email} onChange={(e) => setRecipient({ ...recipient, email: e.target.value })} placeholder={t("recipientEmailPlaceholder")} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("deliveryAddress")} *</label>
                <LocationAutocomplete
                  value={recipient.address}
                  onChange={(addr, coords) => {
                    setRecipient((r) => ({ ...r, address: addr }));
                    if (coords) setRecipientCoords(coords);
                  }}
                  placeholder={t("searchDelivery")}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-black dark:text-white mb-1">{t("packageDetails")}</h4>
                <p className="text-xs text-black/40 dark:text-white/40">{t("packageDetailsDesc")}</p>
              </div>
              <div>
                <label className={labelClass}>{t("contentCategory")} *</label>
                <select value={packageDetails.contentCategory} onChange={(e) => setPackageDetails({ ...packageDetails, contentCategory: e.target.value })} className={selectClass}>
                  <option value="">{t("whatSending")}</option>
                  {contentCategories.map((cat) => <option key={cat.value}>{cat.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("declaredValue")} *</label>
                <input type="number" value={packageDetails.declaredValue} onChange={(e) => setPackageDetails({ ...packageDetails, declaredValue: e.target.value })} placeholder={t("declaredPlaceholder")} min="0" step="1" className={inputClass} />
                <p className="text-[10px] text-black/25 dark:text-white/25 mt-1">{t("insuranceNote")}</p>
              </div>
              <div>
                <label className={labelClass}>{t("description")}</label>
                <textarea rows={2} value={packageDetails.description} onChange={(e) => setPackageDetails({ ...packageDetails, description: e.target.value })} placeholder={t("descPlaceholder")} className={`${inputClass} resize-none`} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${packageDetails.fragile ? "bg-brand-red border-brand-red" : "border-black/15 dark:border-white/15"}`} onClick={() => setPackageDetails({ ...packageDetails, fragile: !packageDetails.fragile })}>
                  {packageDetails.fragile && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-black/60 dark:text-white/60">{t("markFragile")}</span>
              </label>
            </div>
          )}

          {step === 5 && selectedQuote && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-bold text-black dark:text-white mb-1">{t("paymentMethod")}</h4>
                <p className="text-xs text-black/40 dark:text-white/40">{t("paymentMethodDesc")}</p>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === method.id ? "border-brand-red bg-brand-red/5" : "border-black/8 dark:border-white/10 hover:border-brand-red/30"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === method.id ? "bg-brand-red/10" : "bg-black/[0.03] dark:bg-white/[0.05]"}`}>
                      <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? "text-brand-red" : "text-black/30 dark:text-white/30"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-black dark:text-white">{method.label}</div>
                      <div className="text-xs text-black/35 dark:text-white/35">{method.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${paymentMethod === method.id ? "border-brand-red" : "border-black/10 dark:border-white/10"}`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-4 border border-black/5 dark:border-white/10">
                <div className="text-[11px] font-semibold text-black/30 dark:text-white/30 uppercase tracking-wider mb-3">{t("orderSummary")}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50 dark:text-white/50">{VEHICLE_LABELS[selectedVehicle]} {t("shipping")} ({quoteDetails.weight}{t("weight")})</span>
                    <span className="font-semibold text-black dark:text-white">${selectedQuote.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50 dark:text-white/50">Distance</span>
                    <span className="font-semibold text-black dark:text-white">{selectedQuote.distanceKm.toFixed(1)}km</span>
                  </div>
                  <div className="border-t border-black/5 dark:border-white/10 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-black dark:text-white">{t("total")}</span>
                      <span className="text-lg font-black text-brand-red">${selectedQuote.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && bookingData && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-black dark:text-white">{t("confirmed")}</h4>
                <p className="text-sm text-black/40 dark:text-white/40 mt-1">{t("confirmedDesc")}</p>
              </div>

              <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-5 border border-black/5 dark:border-white/10">
                <div className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-widest font-semibold mb-2">{t("trackingNumber")}</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-brand-red font-mono">{bookingData.trackingNumber}</span>
                  <button onClick={() => { navigator.clipboard.writeText(bookingData.trackingNumber); toast(t("copied")); }} className="p-1.5 text-black/20 dark:text-white/20 hover:text-brand-red transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-4 border border-black/5 dark:border-white/10 text-left">
                <div className="text-[10px] text-black/30 dark:text-white/30 uppercase tracking-widest font-semibold mb-3">{t("shipmentDetails")}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("from")}</div><div className="font-medium text-black dark:text-white">{quoteDetails.from}</div></div>
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("to")}</div><div className="font-medium text-black dark:text-white">{quoteDetails.to}</div></div>
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("method")}</div><div className="font-medium text-black dark:text-white">{VEHICLE_LABELS[selectedVehicle]}</div></div>
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("distance")}</div><div className="font-medium text-black dark:text-white">{(bookingData.distanceMeters / 1000).toFixed(1)}km</div></div>
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("weight")}</div><div className="font-medium text-black dark:text-white">{quoteDetails.weight}{t("weight")}</div></div>
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("total")}</div><div className="font-bold text-brand-red">${bookingData.price}</div></div>
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("sender")}</div><div className="font-medium text-black dark:text-white">{sender.fullName}</div></div>
                  <div><div className="text-black/30 dark:text-white/30 text-xs">{t("recipient")}</div><div className="font-medium text-black dark:text-white">{recipient.fullName}</div></div>
                </div>
              </div>

              <div className="bg-brand-red/5 dark:bg-brand-red/10 rounded-xl p-4 border border-brand-red/10 text-left">
                <div className="text-sm font-bold text-black dark:text-white mb-2">{t("whatNext")}</div>
                <div className="space-y-2">
                  {[{ step: "1", text: t("nextStep1") + " " + sender.email }, { step: "2", text: t("nextStep2") }, { step: "3", text: t("nextStep3") + " " + bookingData.trackingNumber }].map((item) => (
                    <div key={item.step} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-brand-red">{item.step}</span>
                      <span className="text-xs text-black/50 dark:text-white/50 leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleClose} className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 font-semibold rounded-xl transition-colors text-sm">{t("done")}</button>
            </div>
          )}
        </div>

        {step < 6 && (
          <div className="p-6 border-t border-black/5 dark:border-white/10 shrink-0">
            <div className="flex items-center justify-between gap-3">
              {step > 1 ? (
                <button onClick={handleBack} className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.04]">
                  <ArrowLeft className="w-4 h-4" /> {t("back")}
                </button>
              ) : <div />}
              {step < 5 ? (
                <button onClick={handleNext} disabled={!canProceed()} className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark disabled:bg-black/10 disabled:dark:bg-white/10 text-white disabled:text-black/25 disabled:dark:text-white/25 px-8 py-3 font-semibold rounded-xl transition-all text-sm shadow-lg shadow-brand-red/20 disabled:shadow-none">
                  {t("continue")} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!canProceed() || bookingLoading} className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark disabled:bg-black/10 disabled:dark:bg-white/10 text-white disabled:text-black/25 disabled:dark:text-white/25 px-8 py-3 font-semibold rounded-xl transition-all text-sm shadow-lg shadow-brand-red/20 disabled:shadow-none">
                  {bookingLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />{t("processing")}</>
                  ) : (
                    <>{t("confirmBooking")} <Check className="w-4 h-4" />
                    </>)}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}