"use client";

import { useState, useCallback } from "react";
import { Navbar, type PageView } from "@/components/bita/navbar";
import { Hero } from "@/components/bita/hero";
import {
  PickupModal,
  LocationsModal,
  RestrictedModal,
  ClaimModal,
} from "@/components/bita/modals";
import {
  TrustLogos,
  RoutesSection,
  DocsSection,
  TrackingSection,
  ServicesSection,
  MobileAppSection,
  SupportSection,
} from "@/components/bita/sections";
import { Footer } from "@/components/bita/footer";
import { AboutPage } from "@/components/bita/about-page";
import { SupportPage } from "@/components/bita/support-page";
import { TrackingResult } from "@/components/bita/tracking-result";
import { BookingModal } from "@/components/bita/booking-modal";
import { VehicleType, PriceResponse } from "@/store/quoteSlice";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [activeTab, setActiveTab] = useState<"track" | "quote">("track");
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [bookingQuote, setBookingQuote] = useState<{
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
  } | null>(null);

  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleSwitchTab = useCallback((tab: "track" | "quote") => {
    setActiveTab(tab);
  }, []);

  const handleOpenModal = useCallback((modal: string) => {
    setOpenModal(modal);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(null);
  }, []);

  const handleFillRoute = useCallback(
    (from: string, to: string) => {
      setActiveTab("quote");
      handleScrollTo("hero");
    },
    [handleScrollTo]
  );

  const handleNavigate = useCallback((page: PageView) => {
    setCurrentPage(page);
    setTrackingCode(null);
  }, []);

  const handleTrack = useCallback((code: string) => {
    setTrackingCode(code);
  }, []);

  const handleCloseTracking = useCallback(() => {
    setTrackingCode(null);
  }, []);

  const handleProceedToBook = useCallback(
    (quoteDetails: {
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
    }) => {
      setBookingQuote(quoteDetails);
    },
    []
  );

  const handleCloseBooking = useCallback(() => {
    setBookingQuote(null);
  }, []);

  // If tracking result is active, show tracking view
  if (trackingCode) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-500">
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onScrollTo={handleScrollTo}
        />
        <main className="flex-1">
          <TrackingResult
            trackingCode={trackingCode}
            onClose={handleCloseTracking}
          />
        </main>
        <Footer
          onScrollTo={handleScrollTo}
          onSwitchTab={handleSwitchTab}
          onOpenModal={handleOpenModal}
          onNavigate={handleNavigate}
        />
        <PickupModal isOpen={openModal === "pickup"} onClose={handleCloseModal} />
        <LocationsModal isOpen={openModal === "locations"} onClose={handleCloseModal} />
        <RestrictedModal isOpen={openModal === "restricted"} onClose={handleCloseModal} />
        <ClaimModal isOpen={openModal === "claim"} onClose={handleCloseModal} />
        <BookingModal isOpen={!!bookingQuote} onClose={handleCloseBooking} quoteDetails={bookingQuote} />
      </div>
    );
  }

  // About page
  if (currentPage === "about") {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-500">
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onScrollTo={handleScrollTo}
        />
        <main className="flex-1">
          <AboutPage />
        </main>
        <Footer
          onScrollTo={handleScrollTo}
          onSwitchTab={handleSwitchTab}
          onOpenModal={handleOpenModal}
          onNavigate={handleNavigate}
        />
        <PickupModal isOpen={openModal === "pickup"} onClose={handleCloseModal} />
        <LocationsModal isOpen={openModal === "locations"} onClose={handleCloseModal} />
        <RestrictedModal isOpen={openModal === "restricted"} onClose={handleCloseModal} />
        <ClaimModal isOpen={openModal === "claim"} onClose={handleCloseModal} />
        <BookingModal isOpen={!!bookingQuote} onClose={handleCloseBooking} quoteDetails={bookingQuote} />
      </div>
    );
  }

  // Support page
  if (currentPage === "support") {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-500">
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onScrollTo={handleScrollTo}
        />
        <main className="flex-1">
          <SupportPage />
        </main>
        <Footer
          onScrollTo={handleScrollTo}
          onSwitchTab={handleSwitchTab}
          onOpenModal={handleOpenModal}
          onNavigate={handleNavigate}
        />
        <PickupModal isOpen={openModal === "pickup"} onClose={handleCloseModal} />
        <LocationsModal isOpen={openModal === "locations"} onClose={handleCloseModal} />
        <RestrictedModal isOpen={openModal === "restricted"} onClose={handleCloseModal} />
        <ClaimModal isOpen={openModal === "claim"} onClose={handleCloseModal} />
        <BookingModal isOpen={!!bookingQuote} onClose={handleCloseBooking} quoteDetails={bookingQuote} />
      </div>
    );
  }

  // Home page (default)
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-500">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onScrollTo={handleScrollTo}
      />

      <main className="flex-1">
        <Hero
          activeTab={activeTab}
          onSwitchTab={handleSwitchTab}
          onOpenModal={handleOpenModal}
          onTrack={handleTrack}
          onProceedToBook={handleProceedToBook}
        />

        <TrustLogos />

        <RoutesSection onFillRoute={handleFillRoute} />

        <MobileAppSection />

        <DocsSection />

        <TrackingSection />

        <ServicesSection onOpenModal={handleOpenModal} />

        <SupportSection onOpenModal={handleOpenModal} />
      </main>

      <Footer
        onScrollTo={handleScrollTo}
        onSwitchTab={handleSwitchTab}
        onOpenModal={handleOpenModal}
        onNavigate={handleNavigate}
      />

      {/* Modals */}
      <PickupModal
        isOpen={openModal === "pickup"}
        onClose={handleCloseModal}
      />
      <LocationsModal
        isOpen={openModal === "locations"}
        onClose={handleCloseModal}
      />
      <RestrictedModal
        isOpen={openModal === "restricted"}
        onClose={handleCloseModal}
      />
      <ClaimModal
        isOpen={openModal === "claim"}
        onClose={handleCloseModal}
      />
      <BookingModal isOpen={!!bookingQuote} onClose={handleCloseBooking} quoteDetails={bookingQuote} />
    </div>
  );
}
