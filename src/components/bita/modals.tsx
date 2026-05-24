"use client";

import { useState } from "react";
import { X, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/10">
          <h3 className="text-lg font-bold text-black dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ====== Pickup Modal ====== */
export function PickupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Modals");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    toast(t("pickupSubmitted"));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("schedulePickup")}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("fullName")} *
          </label>
          <input
            type="text"
            required
            placeholder={t("yourName")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("phoneNumber")} *
          </label>
          <input
            type="tel"
            required
            placeholder={t("phonePlaceholder")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("pickupAddress")} *
          </label>
          <input
            type="text"
            required
            placeholder={t("addressPlaceholder")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
              {t("preferredDate")} *
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
              {t("preferredTime")} *
            </label>
            <select
              required
              className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer"
            >
              <option value="">{t("selectTime")}</option>
              <option>8:00 AM – 10:00 AM</option>
              <option>10:00 AM – 12:00 PM</option>
              <option>12:00 PM – 2:00 PM</option>
              <option>2:00 PM – 4:00 PM</option>
              <option>4:00 PM – 6:00 PM</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("numPackages")}
          </label>
          <input
            type="number"
            min="1"
            defaultValue={1}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("notes")}
          </label>
          <textarea
            rows={2}
            placeholder={t("notesPlaceholder")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 font-semibold rounded-xl transition-colors text-sm"
        >
          {t("confirmPickup")}
        </button>
      </form>
    </Modal>
  );
}

// locations array is moved inside the component to use translations

export function LocationsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Modals");

  const locations = [
    {
      name: t("loc1Name"),
      address: t("loc1Address"),
      hours: t("loc1Hours"),
    },
    {
      name: t("loc2Name"),
      address: t("loc2Address"),
      hours: t("loc2Hours"),
    },
    {
      name: t("loc3Name"),
      address: t("loc3Address"),
      hours: t("loc3Hours"),
    },
    {
      name: t("loc4Name"),
      address: t("loc4Address"),
      hours: t("loc4Hours"),
    },
    {
      name: t("loc5Name"),
      address: t("loc5Address"),
      hours: t("loc5Hours"),
    },
  ];
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("dropoffTitle")}
    >
      <div className="p-4 divide-y divide-black/5 dark:divide-white/10">
        {locations.map((loc) => (
          <button
            key={loc.name}
            onClick={() => {
              toast(`${t("openingDirections")} ${loc.name}...`);
              onClose();
            }}
            className="w-full text-left p-4 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-black dark:text-white">
                  {loc.name}
                </div>
                <div className="text-xs text-black/40 dark:text-white/40 mt-0.5">
                  {loc.address}
                </div>
                <div className="text-xs text-black/30 dark:text-white/30 mt-1">
                  {loc.hours}
                </div>
              </div>
              <Navigation className="w-4 h-4 text-brand-red shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

/* ====== Restricted Items Modal ====== */
export function RestrictedModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Modals");
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("restrictedTitle")}
    >
      <div className="p-6 space-y-5">
        <div>
          <h4 className="text-sm font-bold text-brand-red mb-2">
            {t("cannotShip")}
          </h4>
          <ul className="space-y-1.5 text-sm text-black/60 dark:text-white/60">
            <li>• {t("cannotShipItem1")}</li>
            <li>• {t("cannotShipItem2")}</li>
            <li>• {t("cannotShipItem3")}</li>
            <li>• {t("cannotShipItem4")}</li>
            <li>• {t("cannotShipItem5")}</li>
            <li>• {t("cannotShipItem6")}</li>
            <li>• {t("cannotShipItem7")}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-black dark:text-white mb-2">
            {t("canShip")}
          </h4>
          <ul className="space-y-1.5 text-sm text-black/60 dark:text-white/60">
            <li>
              • {t("canShipItem1")}
            </li>
            <li>
              • {t("canShipItem2")}
            </li>
            <li>
              • {t("canShipItem3")}
            </li>
            <li>
              • {t("canShipItem4")}
            </li>
            <li>
              • {t("canShipItem5")}
            </li>
            <li>
              • {t("canShipItem6")}
            </li>
          </ul>
        </div>
        <p className="text-xs text-black/35 dark:text-white/35">
          {t("unsure")}{" "}
          <a
            href="tel:+251111234567"
            className="text-brand-red font-medium"
          >
            +251 11 123 4567
          </a>{" "}
          {t("beforeShipping")}
        </p>
      </div>
    </Modal>
  );
}

/* ====== Claim Modal ====== */
export function ClaimModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Modals");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    const ref = `CLM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    toast(`${t("claimSubmitted")} Ref #${ref} — check your email.`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("claimTitle")}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("claimTracking")} *
          </label>
          <input
            type="text"
            required
            placeholder={t("claimTrackingPlaceholder")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("claimIssue")} *
          </label>
          <select
            required
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer"
          >
            <option value="">{t("claimSelectIssue")}</option>
            <option>{t("claimLost")}</option>
            <option>{t("claimDamaged")}</option>
            <option>{t("claimDamagedContents")}</option>
            <option>{t("claimMissing")}</option>
            <option>{t("claimWrongDelivery")}</option>
            <option>{t("claimLateDelivery")}</option>
            <option>{t("claimOther")}</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("claimEmail")} *
          </label>
          <input
            type="email"
            required
            placeholder={t("claimEmailPlaceholder")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("claimPhone")} *
          </label>
          <input
            type="tel"
            required
            placeholder={t("claimPhonePlaceholder")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            {t("claimDesc")} *
          </label>
          <textarea
            rows={3}
            required
            placeholder={t("claimDescPlaceholder")}
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 font-semibold rounded-xl transition-colors text-sm"
        >
          {t("submitClaim")}
        </button>
        <p className="text-[11px] text-black/30 dark:text-white/30 text-center">
          {t("claimNote")}
        </p>
      </form>
    </Modal>
  );
}
