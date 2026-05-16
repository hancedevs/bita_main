"use client";

import { useState } from "react";
import { X, Navigation } from "lucide-react";
import { toast } from "sonner";

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    toast("Pickup request submitted! Confirmation sent to your phone.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule a Pickup">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="+251 9XX XXX XXXX"
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            Pickup Address *
          </label>
          <input
            type="text"
            required
            placeholder="Full address in Addis Ababa"
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
              Preferred Date *
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
              Preferred Time *
            </label>
            <select
              required
              className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer"
            >
              <option value="">Select time</option>
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
            Number of Packages
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
            Notes
          </label>
          <textarea
            rows={2}
            placeholder="Any special instructions"
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 font-semibold rounded-xl transition-colors text-sm"
        >
          Confirm Pickup Request
        </button>
      </form>
    </Modal>
  );
}

/* ====== Locations Modal ====== */
const locations = [
  {
    name: "Bole Branch",
    address: "Near Bole International Airport, Atlas Road",
    hours: "Mon–Sat · 7:30AM – 7:00PM",
  },
  {
    name: "Kazanchis Branch",
    address: "Rwanda Street, behind Dembel City Center",
    hours: "Mon–Sat · 8:00AM – 6:00PM",
  },
  {
    name: "Saris Branch",
    address: "Mekanisa, Saris-Abo Square",
    hours: "Mon–Sat · 8:00AM – 6:00PM",
  },
  {
    name: "CMC Branch",
    address: "CMC Road, near Total Gas Station",
    hours: "Mon–Sat · 8:00AM – 6:00PM",
  },
  {
    name: "Mercato Branch",
    address: "2nd Level, Shewa Dabo Building",
    hours: "Mon–Sat · 8:00AM – 5:30PM",
  },
];

export function LocationsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Drop-off Points in Addis Ababa"
    >
      <div className="p-4 divide-y divide-black/5 dark:divide-white/10">
        {locations.map((loc) => (
          <button
            key={loc.name}
            onClick={() => {
              toast(`Opening directions to ${loc.name}...`);
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restricted & Prohibited Items"
    >
      <div className="p-6 space-y-5">
        <div>
          <h4 className="text-sm font-bold text-brand-red mb-2">
            Cannot ship (prohibited)
          </h4>
          <ul className="space-y-1.5 text-sm text-black/60 dark:text-white/60">
            <li>• Explosives, ammunition, fireworks</li>
            <li>• Flammable liquids & gases</li>
            <li>• Toxic or infectious substances</li>
            <li>• Radioactive material</li>
            <li>• Live animals (use cargo service)</li>
            <li>• Counterfeit currency or goods</li>
            <li>• Narcotics & psychotropic substances</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-black dark:text-white mb-2">
            Can ship with restrictions
          </h4>
          <ul className="space-y-1.5 text-sm text-black/60 dark:text-white/60">
            <li>
              • <strong>Lithium batteries</strong> — max 2 per package
            </li>
            <li>
              • <strong>Alcohol</strong> — up to 5L, proper packaging
            </li>
            <li>
              • <strong>Perfume</strong> — up to 1L, sealed original
            </li>
            <li>
              • <strong>Coffee & spices</strong> — phytosanitary cert for some
              destinations
            </li>
            <li>
              • <strong>Electronics</strong> — original invoice required
            </li>
            <li>
              • <strong>Seeds</strong> — export permit from MoA
            </li>
          </ul>
        </div>
        <p className="text-xs text-black/35 dark:text-white/35">
          Unsure? Call{" "}
          <a
            href="tel:+251111234567"
            className="text-brand-red font-medium"
          >
            +251 11 123 4567
          </a>{" "}
          before shipping.
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    const ref = `CLM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    toast(`Claim submitted! Ref #${ref} — check your email.`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File a Claim">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            Tracking Number *
          </label>
          <input
            type="text"
            required
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
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer"
          >
            <option value="">Select issue</option>
            <option>Lost shipment</option>
            <option>Damaged package</option>
            <option>Damaged contents</option>
            <option>Missing items</option>
            <option>Wrong delivery</option>
            <option>Late delivery</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            Your Email *
          </label>
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            Phone *
          </label>
          <input
            type="tel"
            required
            placeholder="+251 9XX XXX XXXX"
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider block mb-1.5">
            Description *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Describe what happened..."
            className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl text-sm text-black dark:text-white placeholder-black/25 dark:placeholder-white/25 focus:outline-none focus:border-brand-red transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3.5 font-semibold rounded-xl transition-colors text-sm"
        >
          Submit Claim
        </button>
        <p className="text-[11px] text-black/30 dark:text-white/30 text-center">
          You&apos;ll receive a confirmation email with your claim reference
          number.
        </p>
      </form>
    </Modal>
  );
}
