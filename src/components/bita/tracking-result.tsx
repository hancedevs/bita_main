"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Package,
  MapPin,
  Copy,
  Share2,
  Download,
  Maximize2,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { trackShipment, clearTracking } from "@/store/trackingSlice";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface TrackingResultProps {
  trackingCode: string;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; progress: number }> = {
  CREATED: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", progress: 15 },
  PICKED_UP: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", progress: 30 },
  IN_TRANSIT: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", progress: 50 },
  OUT_FOR_DELIVERY: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", progress: 80 },
  DELIVERED: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500", progress: 100 },
  RETURNED: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", dot: "bg-red-500", progress: 0 },
};

function formatTimestamp(timestamp: string): string {
  try {
    return format(new Date(timestamp), "MMM d, yyyy · h:mm a");
  } catch {
    return timestamp;
  }
}

// Localized status formatting will be handled inside the component

export function TrackingResult({ trackingCode, onClose }: TrackingResultProps) {
  const t = useTranslations("TrackingResult");
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.tracking);
  const [mapExpanded, setMapExpanded] = useState(false);

  const STATUS_LABELS: Record<string, string> = {
    CREATED: t("statusCreated"),
    PICKED_UP: t("statusPickedUp"),
    IN_TRANSIT: t("statusInTransit"),
    OUT_FOR_DELIVERY: t("statusOutForDelivery"),
    DELIVERED: t("statusDelivered"),
    RETURNED: t("statusReturned"),
  };

  const formatStatus = (status: string) => STATUS_LABELS[status] || status;

  useEffect(() => {
    dispatch(trackShipment(trackingCode));
    return () => {
      dispatch(clearTracking());
    };
  }, [dispatch, trackingCode]);

  const trackingUrl = `${process.env.NEXT_PUBLIC_TRACKING_API_URL}/track/${trackingCode}`;
  const statusConfig = data ? (STATUS_CONFIG[data.status] || STATUS_CONFIG.CREATED) : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl).then(() => {
      toast.success(t("copied"));
    }).catch(() => {
      toast.error(t("copyFailed"));
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">{t("failedTitle")}</p>
          <p className="text-sm text-muted-foreground mt-2">{error || t("noData")}</p>
          <Button onClick={onClose} className="mt-4">{t("goBack")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <div className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-black/30 dark:text-white/30 uppercase tracking-widest font-medium">
                {t("title")}
              </div>
              <div className="text-xl font-bold text-black dark:text-white mt-1 font-mono flex items-center gap-2">
                {data.trackingNumber}
                <button
                  onClick={handleCopyLink}
                  className="text-black/20 dark:text-white/20 hover:text-brand-red transition-colors"
                  title={t("copyLink")}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 ${statusConfig?.bg} ${statusConfig?.text} text-xs font-bold px-3 py-1.5 rounded-full`}>
                <span className={`w-1.5 h-1.5 ${statusConfig?.dot} rounded-full pulse-dot`} />
                {formatStatus(data.status)}
              </span>
              <button
                onClick={onClose}
                className="p-2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                title={t("close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-black/35 dark:text-white/35">
            <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {data.packageType}</span>
            <span>·</span>
            <span>{t("weight")}: {data.weight}</span>
            <span>·</span>
            <span>{t("sender")}: {data.pickupAddress}</span>
            <span>·</span>
            <span>{t("receiver")}: {data.deliveryAddress}</span>
          </div>

          <div className="mt-4">
            <div className="w-full h-2 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-red rounded-full transition-all duration-1000"
                style={{ width: `${statusConfig?.progress || 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-black/25 dark:text-white/25">
              <span>{t("statusCreated")}</span>
              <span>{t("statusInTransit")}</span>
              <span>{t("statusOutForDelivery")}</span>
              <span>{t("statusDelivered")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider">{t("shipmentTimeline")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {data.events.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noEvents")}</p>
                  ) : (
                    data.events.map((event, i) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? "bg-brand-red" : "bg-black/8 dark:bg-white/10"}`}>
                            <Check className={`w-3 h-3 ${i === 0 ? "text-white" : "text-black/25 dark:text-white/25"}`} />
                          </div>
                          {i < data.events.length - 1 && <div className={`w-px flex-1 my-1.5 ${i === 0 ? "bg-brand-red/20" : "bg-black/5 dark:bg-white/10"}`} />}
                        </div>
                        <div className="pb-5">
                          <div className={`text-sm ${i === 0 ? "font-semibold text-black dark:text-white" : "font-medium text-black/40 dark:text-white/40"}`}>
                            {formatStatus(event.status)}
                          </div>
                          <div className="text-xs text-black/30 dark:text-white/30 mt-0.5">
                            {event.locationText || t("locationNotSpecified")}
                          </div>
                          <div className="text-[11px] text-black/20 dark:text-white/20 mt-0.5 font-mono">
                            {formatTimestamp(event.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm uppercase tracking-wider">{t("packageDetails")}</CardTitle>
                <button onClick={() => setMapExpanded(!mapExpanded)} className="p-1.5 hover:bg-accent rounded-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("sender")}</p>
                    <p className="text-sm font-medium mt-1">{data.senderName}</p>
                    <p className="text-xs text-muted-foreground">{data.senderPhone}</p>
                    <p className="text-xs text-muted-foreground mt-1">{data.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("receiver")}</p>
                    <p className="text-sm font-medium mt-1">{data.receiverName}</p>
                    <p className="text-xs text-muted-foreground">{data.receiverPhone}</p>
                    <p className="text-xs text-muted-foreground mt-1">{data.deliveryAddress}</p>
                  </div>
                </div>

                {data.latestEvent?.lat && data.latestEvent?.lng && (
                  <div className={`rounded-xl overflow-hidden border transition-all ${mapExpanded ? "h-[300px]" : "h-[200px]"}`}>
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(data.latestEvent.lng) - 0.5},${parseFloat(data.latestEvent.lat) - 0.5},${parseFloat(data.latestEvent.lng) + 0.5},${parseFloat(data.latestEvent.lat) + 0.5}&layer=mapnik&marker=${data.latestEvent.lat},${data.latestEvent.lng}`}
                      className="w-full h-full border-0"
                      title="Shipment Location"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 text-brand-red" />
                  <span>{t("lastUpdated")}: {formatTimestamp(data.latestEvent?.timestamp || "")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider">{t("qrCode")}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="inline-block p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                  <QRCodeSVG value={trackingUrl} size={160} level="M" includeMargin={false} fgColor="#000000" bgColor="#ffffff" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">{t("scanToTrack")}</p>
                <button onClick={() => toast(t("downloading"))} className="mt-3 text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors inline-flex items-center gap-1">
                  <Download className="w-3 h-3" /> {t("downloadQr")}
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider">{t("actions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-3 bg-black/[0.02] dark:bg-white/[0.03] rounded-xl hover:bg-brand-red/5 transition-colors text-left group border border-transparent hover:border-brand-red/10">
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-brand-red" />
                  <span className="text-sm text-muted-foreground group-hover:text-brand-red">{t("copyLink")}</span>
                </button>
                <button onClick={() => toast(t("sharing"))} className="w-full flex items-center gap-3 px-4 py-3 bg-black/[0.02] dark:bg-white/[0.03] rounded-xl hover:bg-brand-red/5 transition-colors text-left group border border-transparent hover:border-brand-red/10">
                  <Share2 className="w-4 h-4 text-muted-foreground group-hover:text-brand-red" />
                  <span className="text-sm text-muted-foreground group-hover:text-brand-red">{t("share")}</span>
                </button>
                <button onClick={() => toast(t("downloading"))} className="w-full flex items-center gap-3 px-4 py-3 bg-black/[0.02] dark:bg-white/[0.03] rounded-xl hover:bg-brand-red/5 transition-colors text-left group border border-transparent hover:border-brand-red/10">
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-brand-red" />
                  <span className="text-sm text-muted-foreground group-hover:text-brand-red">{t("downloadReceipt")}</span>
                </button>
              </CardContent>
            </Card>

            <div className="bg-brand-red/5 dark:bg-brand-red/10 rounded-2xl p-5 border border-brand-red/10">
              <h3 className="text-sm font-bold text-black dark:text-white mb-1">{t("needHelp")}</h3>
              <p className="text-xs text-muted-foreground mb-3">{t("contactSupport")}</p>
              <Button variant="default">{t("fileClaim")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}